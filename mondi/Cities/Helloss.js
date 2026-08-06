let citizens = [];
const N = 500;

let grid;
let field;
const GRID_X = 20;
const GRID_Y = 20;

const cellSize = 0;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    let cellW = width / GRID_X;
    let cellH = height / GRID_Y;

    grid = new SpatialGrid(cellW, cellH);
    field = new BattleField(cellW, cellH);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    frameRate(60);

    let cellW = width / GRID_X;
    let cellH = height / GRID_Y;
    grid = new SpatialGrid(cellW, cellH);
    field = new BattleField(cellW, cellH);

    for (let i = 0; i < N; i++) {
        let role = i < N / 2 ? 0 : 1;
        citizens.push(new Citizen(role, i));
    }
}

function draw() {
    background(100);

    // GRIGLIA
    grid.clear();
    for (let c of citizens) {
        grid.insert(c);
    }

    for (let c of citizens) {
        c.update(grid);
    }

    // GRIGLIA VISIVA
    field.clear();
    for (let c of citizens) {
        field.addCitizen(c);
    }
    field.draw();

    for (let c of citizens) {
        c.draw();
    }
}

class SpatialGrid {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.cols = GRID_X;
        this.rows = GRID_Y;

        this.cells = [];

        for (let x = 0; x < this.cols; x++) {
            this.cells[x] = [];
            for (let y = 0; y < this.rows; y++) {
                this.cells[x][y] = [];
            }
        }
    }
    clear() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.cells[x][y].length = 0;
            }
        }
    }
    insert(s) {
        let cx = floor(s.pos.x / this.w);
        let cy = floor(s.pos.y / this.h);

        if (cx >= 0 && cx < this.cols && cy >= 0 && cy < this.rows) {
            this.cells[cx][cy].push(s);
        }
    }
    fillNearby(pos, radius, result) {

        let reachX = ceil(radius / this.w);
        let reachY = ceil(radius / this.h);

        let cx = floor(pos.x / this.w);
        let cy = floor(pos.y / this.h);

        for (let x = -reachX; x <= reachX; x++) {
            for (let y = -reachY; y <= reachY; y++) {

                let cell = this.cells[cx + x]?.[cy + y];

                if (cell) {
                    for (let s of cell) {
                        result.push(s);
                    }
                }
            }
        }
    }
}

class BattleField {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.cols = GRID_X;
        this.rows = GRID_Y;

        this.cells = [];

        for (let x = 0; x < this.cols; x++) {
            this.cells[x] = [];

            for (let y = 0; y < this.rows; y++) {
                this.cells[x][y] = {
                    a: 0,
                    b: 0,
                    value: 100
                };
            }
        }
    }
    clear() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {

                this.cells[x][y].a = 0;
                this.cells[x][y].b = 0;
            }
        }
    }
    addCitizen(c) {
        let x = floor(c.pos.x / this.w);
        let y = floor(c.pos.y / this.h);

        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            if (c.role === 0)
                this.cells[x][y].a++;
            else
                this.cells[x][y].b++;
        }
    }
    draw() {
        rectMode(CORNER);
        noStroke();
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                let c = this.cells[x][y];
                let influence = c.a - c.b;
                let target = map(
                    influence,
                    -5,
                    5,
                    180,
                    20
                );
                c.value = lerp(
                    c.value,
                    target,
                    0.7
                );
                c.value = constrain(c.value, 20, 180);
                fill(c.value, 100);
                rect(x * this.w, y * this.h, this.w, this.h);
            }
        }
    }
}

class Citizen {
    constructor(role, id) {
        this.role = role;
        this.id = id;

        this.spawn();
    }
    spawn() {
        this.vel = p5.Vector.random2D();
        this.speed = random(1, 5);
        this.friction = random(0.1, 0.25);
        this.vision = random(25, 100);

        this.hp = random(0.25, 1);
        this.desire = random(0.1,1);

        this.desired = createVector(0, 0);
        this.dir = createVector(0, 0);

        this.nearby = [];

        if (this.role === 0) {
            this.pos = createVector(-20, random(height));
            this.advanceDirection = createVector(1, 0);
        } else {
            this.pos = createVector(width + 20, random(height));
            this.advanceDirection = createVector(-1, 0);
        }

        this.state = 0; // 0-advance 1-attack 2-flee
        this.stateTimer = random(5);
        this.stateTimerMax = int(random(1, 5));
    }
    update(grid) {
        if (frameCount % 2 == this.id % 2) {
            this.sense(grid);
        }
        if (this.stateTimer <= 0) {
            this.decide();
            this.stateTimer = this.stateTimerMax;
        }
        this.stateTimer--;
        if (frameCount % 2 == this.id % 2) {
            this.move();
            this.trade();
        }
    }
    sense(grid) {
        this.target = null;
        this.minD = Infinity;

        this.nearby.length = 0;
        grid.fillNearby(this.pos, this.vision, this.nearby);

        for (let o of this.nearby) {
            if (o === this) continue;

            let dx = this.pos.x - o.pos.x;
            let dy = this.pos.y - o.pos.y;
            let d2 = dx * dx + dy * dy;

            if (d2 < this.vision * this.vision) {
                if (o.role !== this.role) {
                    if (d2 < this.minD * this.minD) {
                        this.minD = sqrt(d2);
                        this.target = o;
                    }
                }
            }
        }
        if (this.allies > 0) {
            this.alliesCenter.div(this.allies);
        }
    }
    decide() {
        if (this.role === 0) {
            // CLIENTE
            if (this.target) {
                if (random() < this.desire) {
                    this.state = 1; // compra
                }
                else {
                    this.state = 2; // scappa
                }
            } else {
                this.state = 0;
            }
        } else {
            // VENDITORE
            if (this.target) {
                this.state = 1; // cerca clienti
            }
            else {
                this.state = 0;
            }
        }
    }
    move() {
        let desired = this.desired;
        desired.set(0, 0);

        // ADVANCE
        if (this.state === 0) {
            desired.add(this.advanceDirection);
        }

        // INTERAZIONE
        if (this.state === 1) {
            if (this.target) {
                this.dir.set(
                    this.target.pos.x - this.pos.x,
                    this.target.pos.y - this.pos.y
                );
                this.dir.normalize();
                // CLIENTE: va verso il venditore
                if (this.role === 0) {
                    desired.add(this.dir);
                }
                // VENDITORE: va verso il cliente
                if (this.role === 1) {
                    desired.add(this.dir);
                }
            }
        }

        // FLEE
        if (this.state === 2) {
            if (this.target) {
                this.dir.set(this.target.pos.x - this.pos.x, this.target.pos.y - this.pos.y);
                this.dir.normalize();
                this.dir.mult(-0.75);
                desired.add(this.dir);
            }
        }

        desired.setMag(this.speed);

        this.vel.lerp(
            desired,
            this.friction
        );

        this.pos.add(this.vel);

        // rimbalzo ai bordi
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        }
        if (this.pos.y > height) {
            this.pos.y = height;
            this.vel.y *= -1;
        }

        if (this.pos.x < -50 || this.pos.x > width + 50) {
            this.spawn();
        }
    }
    trade() {
        if (
            this.state == 1 &&
            this.target &&
            this.minD < this.vision * 0.1
        ) {
            if (this.role === 0) {
                let amount = random(0.001, 0.01);
                if (this.hp > amount) {
                    this.hp -= amount;
                    this.target.hp += amount;
                }
            }
        }
    }
    draw() {
        if (this.role === 0) stroke(20); else stroke(180);
        strokeWeight(this.hp * 20);
        point(this.pos.x, this.pos.y);
    }
}