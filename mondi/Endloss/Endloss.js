let soldiers = [];
let blood = [];
let craters = [];
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
    let faction = i < N / 2 ? 0 : 1;
    soldiers.push(new Soldier(faction, i));
  }
}

function draw() {
  background(100);

  // GRIGLIA
  grid.clear();
  for (let s of soldiers) {
    grid.insert(s);
  }

  // SANGUE
  for (let i = blood.length - 1; i >= 0; i--) {
    blood[i].update();
    if (blood[i].size <= 0) {
      blood.splice(i, 1);
    } else {
      blood[i].display();
    }
  }

  // CRATERI
  for (let i = craters.length - 1; i >= 0; i--) {
    craters[i].update();
    if (craters[i].size <= 0) {
      craters.splice(i, 1);
    } else {
      craters[i].display();
    }
  }

  for (let s of soldiers) {
    s.update(grid);
  }

  // GRIGLIA VISIVA
  field.clear();
  for (let s of soldiers) {
    field.addSoldier(s);
  }
  field.draw();

  for (let s of soldiers) {
    s.draw();
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
  addSoldier(s) {
    let x = floor(s.pos.x / this.w);
    let y = floor(s.pos.y / this.h);

    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      if (s.faction === 0)
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

class Soldier {
  constructor(faction, id) {
    this.faction = faction;
    this.id = id;

    this.spawn();
  }
  spawn() {
    this.vel = p5.Vector.random2D();
    this.speed = random(1, 5);
    this.friction = random(0.1, 0.25);
    this.vision = random(10, 50);
    this.fleeChance = random();

    this.hp = random(0.25, 1);

    this.desired = createVector(0,0);
    this.dir = createVector(0,0);

    this.cohesion = random(0.01, 0.1);
    this.alliesCenter = createVector(0,0);
    this.nearby = [];

    if (this.faction === 0) {
      this.pos = createVector(-20, random(height));
      this.advanceDirection = createVector(1, 0);
    } else {
      this.pos = createVector(width+20, random(height));
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
      this.fight();
    }
  }
  sense(grid) {
    this.allies = 0;
    this.enemies = 0;

    this.closestEnemy = null;
    this.minD = Infinity;
    this.alliesCenter.set(0, 0);

    this.nearby.length = 0;
    grid.fillNearby(this.pos, this.vision, this.nearby);

    for (let o of this.nearby) {
      if (o === this) continue;

      let dx = this.pos.x - o.pos.x;
      let dy = this.pos.y - o.pos.y;
      let d2 = dx * dx + dy * dy;

      if (d2 < this.vision * this.vision) {
        if (o.faction === this.faction) {
          this.allies++;
          this.alliesCenter.add(o.pos);
        } else {
          this.enemies++;
          if (d2 < this.minD * this.minD) {
            this.minD = sqrt(d2);
            this.closestEnemy = o;
          }
        }
      }
    }
    if (this.allies > 0) {
      this.alliesCenter.div(this.allies);
    }
  }
  decide() {
    if (this.closestEnemy) {
      if (this.allies >= this.enemies) {
        this.state = 1;
      } else {
        if (random() < this.fleeChance) {
          this.state = 2;
        } else  {
          this.state = 1;
        }
      }
    } else {
      this.state = 0;
    }
  }
  move() {
    let desired = this.desired;
    desired.set(0, 0);

    // ADVANCE
    if (this.state === 0) {
      desired.add(this.advanceDirection);
    }

    // ATTACK
    if (this.state === 1) {
      if (this.closestEnemy) {
        this.dir.set(this.closestEnemy.pos.x - this.pos.x, this.closestEnemy.pos.y - this.pos.y);
        this.dir.normalize();
        desired.add(this.dir);
      }
    }

    // FLEE
    if (this.state === 2) {
      if (this.closestEnemy) {
        this.dir.set(this.closestEnemy.pos.x - this.pos.x, this.closestEnemy.pos.y - this.pos.y);
        this.dir.normalize();
        this.dir.mult(-0.75);
        desired.add(this.dir);
      }
    }

    // COESIONE
    if (this.allies > 0) {
      this.dir.set(this.alliesCenter.x - this.pos.x, this.alliesCenter.y - this.pos.y);
      this.dir.normalize();
      this.dir.mult(this.cohesion);
      desired.add(this.dir);
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
  }
  fight() {
    // COMBATTIMENTO
    if (this.state == 1 && this.closestEnemy && this.minD < this.vision * 0.1) {
      this.closestEnemy.hp -= this.closestEnemy.hp * random(0.1, 1);
    }

    // decadimento naturale
    this.hp -= 0.001;

    // morte improvvisa
    if (random() < 0.001) {
      craters.push(new Crater(this.pos.x, this.pos.y, random(5, 50), random(0.01, 0.1)));
      this.hp = 0;
    }

    // respawm
    if (this.hp <= 0) {
      blood.push(new Blood(this.pos.x, this.pos.y, random(1, 20), random(0.01, 0.25)));
      this.spawn();
    }
  }
  draw() {
    if (this.faction === 0) stroke(20); else stroke(180);
    strokeWeight(this.hp * 20);
    point(this.pos.x, this.pos.y);
  }
}

class Blood {
  constructor(x, y, size, decay) {
    this.x = x * random(0.99, 1.01);
    this.y = y * random(0.99, 1.01);
    this.size = size;
    this.decay = decay;
  }
  update() {
    if (this.size > 0) {
      this.size -= this.decay;
    }
  }
  display() {
    noStroke();
    fill(255, 0, 0);
    circle(this.x, this.y, this.size);
  }
}

class Crater {
  constructor(x, y, size, decay) {
    this.x = x * random(0.975, 1.025);
    this.y = y * random(0.975, 1.025);
    this.size = size;
    this.decay = decay;
    this.r = random(150);
    this.g = random(150);
    this.b = random(150);
  }
  update() {
    if (this.size > 0) {
      this.size -= this.decay;
    }
  }
  display() {
    noFill();
    stroke(this.r, this.g, this.b);
    strokeWeight(this.size * 0.05);
    circle(this.x, this.y, this.size);
  }
}