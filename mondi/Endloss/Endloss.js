let soldiers = [];
let blood = [];
let craters = [];
const N = 500;

let grid;
let field;
const GRID_X = 20;
const GRID_Y = 20;

const cellSize = 0;
let DIM = 0;

let params = {
  cohesion: 0,
  speed: 1,
  fear: 0.5,
  artilleryChance: 0.001,
  damage: 0.1
};
let cohesionSlider, speedSlider, fearSlider, artilleryChanceSlider, damageSlider;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  DIM = min(width, height);

  let cellW = width / GRID_X;
  let cellH = height / GRID_Y;

  grid = new SpatialGrid(cellW, cellH);
  field = new BattleField(cellW, cellH);

  updateMenuPosition();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);

  DIM = min(width, height);

  let cellW = width / GRID_X;
  let cellH = height / GRID_Y;
  grid = new SpatialGrid(cellW, cellH);
  field = new BattleField(cellW, cellH);

  for (let i = 0; i < N; i++) {
    let faction = i < N / 2 ? 0 : 1;
    soldiers.push(new Soldier(faction, i));
  }

  createMenu();
}

function draw() {
  background(100);

  // GRIGLIA
  grid.clear();
  for (let s of soldiers) {
    grid.insert(s);
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

  // SANGUE
  for (let i = blood.length - 1; i >= 0; i--) {
    blood[i].update();
    if (blood[i].size <= 0) {
      blood.splice(i, 1);
    } else {
      blood[i].display();
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

  params.cohesion = cohesionSlider.value();
  params.speed = speedSlider.value();
  params.fear = fearSlider.value();
  params.artilleryChance = artilleryChanceSlider.value();
  params.damage = damageSlider.value();
  drawMenu();
}

function keyPressed() {
  if (keyCode === TAB) {
    menuOpen = !menuOpen;
    return false;
  }
}

function createMenu() {
  let x = DIM * 0.02;
  let w = DIM * 0.20;
  let startY = DIM * 0.04;
  let gap = DIM * 0.06;
  let sliderOffset = DIM * 0.018;

  cohesionSlider = createSlider(0, 1, 0, 0.01);
  cohesionSlider.position(x, startY + sliderOffset);
  cohesionSlider.style("width", w + "px");

  speedSlider = createSlider(0, 5, 1, 0.01);
  speedSlider.position(x, startY + gap + sliderOffset);
  speedSlider.style("width", w + "px");

  fearSlider = createSlider(0, 1, 0.5, 0.01);
  fearSlider.position(x, startY + gap * 2 + sliderOffset);
  fearSlider.style("width", w + "px");

  artilleryChanceSlider = createSlider(0, 0.01, 0.001, 0.0001);
  artilleryChanceSlider.position(x, startY + gap * 3 + sliderOffset);
  artilleryChanceSlider.style("width", w + "px");

  damageSlider = createSlider(0, 1, 0.1, 0.01);
  damageSlider.position(x, startY + gap * 4 + sliderOffset);
  damageSlider.style("width", w + "px");
}


function drawMenu() {
  let pad = DIM * 0.02;
  let startY = DIM * 0.04;
  let gap = DIM * 0.06;

  let menuW = DIM * 0.25;
  let menuH = gap * 6;

  push();

  rectMode(CORNER);
  fill(0,100);
  noStroke();
  rect(0,0,menuW,menuH);

  fill(255);
  textAlign(LEFT,TOP);
  textSize(DIM * 0.015);

  text("COHESION", pad, startY);
  text("SPEED", pad, startY + gap);
  text("FEAR", pad, startY + gap * 2);
  text("ARTILLERY", pad, startY + gap * 3);
  text("DAMAGE", pad, startY + gap * 4);

  pop();
}

function updateMenuPosition() {
  let x = DIM * 0.02;
  let w = DIM * 0.20;

  cohesionSlider.style("width", w + "px");
  speedSlider.style("width", w + "px");
  fearSlider.style("width", w + "px");
  artilleryChanceSlider.style("width", w + "px");
  damageSlider.style("width", w + "px");
}


class Soldier {
  constructor(faction, id) {
    this.faction = faction;
    this.id = id;

    this.spawn();
  }
  spawn() {
    this.vel = p5.Vector.random2D();
    this.friction = random(0.1, 0.25);
    this.vision = random(0.03, 0.08) * DIM;
    this.baseSpeed = random(0.001, 0.005) * DIM;

    this.hp = random(0.25, 1);

    this.desired = createVector(0, 0);
    this.dir = createVector(0, 0);

    this.currentCohesion;
    this.currentSpeed;
    this.currentFear;

    this.alliesCenter = createVector(0, 0);
    this.nearby = [];

    if (this.faction === 0) {
      this.pos = createVector(-0.02 * DIM, random(height));
      this.advanceDirection = createVector(1, 0);
    } else {
      this.pos = createVector(width + 0.02 * DIM, random(height));
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
    this.updateParams();

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
  updateParams() {
    this.currentCohesion = params.cohesion * random(0.75, 1.25);
    this.currentSpeed = this.baseSpeed * params.speed * random(0.75, 1.25);
    this.currentFear = params.fear * random(0.75, 1.25);
  }
  decide() {
    // nessun nemico vicino
    if (!this.closestEnemy) {
      this.state = 0;
      return;
    }
    // rapporto di pressione nemica
    let danger = this.enemies / (this.allies + 1);
    // paura individuale
    let fear = this.currentFear * random(0.75, 1.25);
    // probabilità di fuga
    let fleeProbability = danger * fear;
    // limita tra 0 e 1
    fleeProbability = constrain(fleeProbability, 0, 1);

    if (random() < fleeProbability) {
      this.state = 2; // FLEE
    }
    else {
      this.state = 1; // ATTACK
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
      this.dir.mult(this.currentCohesion);
      desired.add(this.dir);
    }

    desired.setMag(this.currentSpeed);

    this.vel.lerp(desired, this.friction);

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
    if (this.state == 1 && this.closestEnemy && this.minD < this.vision * 0.3) {
      this.closestEnemy.hp -= this.closestEnemy.hp * params.damage * random(0.8, 1.2);
    }

    // decaDIMento naturale
    this.hp -= 0.001;

    // morte improvvisa
    if (random() < params.artilleryChance) {
      craters.push(new Crater(this.pos.x, this.pos.y, random(0.005, 0.05) * DIM));
      this.hp = 0;
    }

    // respawm
    if (this.hp <= 0) {
      blood.push(new Blood(this.pos.x, this.pos.y, random(0.001, 0.02) * DIM));
      this.spawn();
    }
  }
  draw() {
    if (this.faction === 0) stroke(20); else stroke(180);
    if (
      this.state === 1 &&
      this.closestEnemy &&
      this.closestEnemy.state === 2
    ) {
      strokeWeight(this.hp * 0.005 * DIM);
      line(
        this.pos.x,
        this.pos.y,
        this.closestEnemy.pos.x,
        this.closestEnemy.pos.y
      );
    }
    strokeWeight(this.hp * 0.02 * DIM);
    point(this.pos.x, this.pos.y);
  }
}

class Blood {
  constructor(x, y, size) {
    this.x = x * random(0.99, 1.01);
    this.y = y * random(0.99, 1.01);
    this.size = size;
    this.decay = random(0.1, 0.5);
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
  constructor(x, y, size) {
    this.x = x * random(0.975, 1.025);
    this.y = y * random(0.975, 1.025);
    this.size = size;
    this.decay = random(0.01, 0.25);
    this.r = random(50, 100);
    this.g = random(50, 90);
    this.b = random(20, 50);
  }
  update() {
    if (this.size > 0) {
      this.size -= this.decay;
    }
  }
  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.size);
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