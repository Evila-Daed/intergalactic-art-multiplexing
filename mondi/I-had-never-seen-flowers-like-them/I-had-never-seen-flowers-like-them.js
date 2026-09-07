let flowers = [];
const flowersNum = 50;
let grass = [];
const grassNum = 100;
let cam1;

let xMax = 0;
let yMax = 0;
let zMax = 0;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  rectMode(CENTER);
  frameRate(30);
  smooth();

  xMax = width;
  yMax = height;
  zMax = xMax;

  cam1 = createCamera();
  cam1.setPosition(width * 1.5, height * 0.25, 0);
  cam1.lookAt(0, 0, 0);

  for (let i = 0; i < flowersNum; i++) {
    flowers.push(new Fiore(i));
  }
  for (let i = 0; i < grassNum; i++) {
    grass.push(new Erba(i));
  }
}

function draw() {
  background(25, 189, 255);

  rotateY(frameCount * 0.1127);

  push();
  fill(126, 200, 80);
  noStroke();
  translate(0, height / 2, 0);
  rotateX(90);
  box(xMax * 2, zMax * 2, yMax * 0.02);
  pop();

  for (let i = 0; i < flowersNum; i++) {
    flowers[i].update();
  }
  for (let i = 0; i < grassNum; i++) {
    grass[i].update();
  }
}

class Fiore {
  constructor(i) {
    this.i = i;
    this.pos = createVector(0, 0, 0);
    this.size = createVector(0, 0, 0);

    this.spawn();
  }
  spawn() {
    this.pos.set(random(-xMax * 0.75, xMax * 0.75), random(-yMax / 2, yMax / 4), random(-zMax * 0.75, zMax * 0.75));
    this.size.set(zMax * random(0.05, 0.25), zMax * random(0.05, 0.25), zMax * random(0.05, 0.25));
    this.centerOffsetX = this.pos.x * random(0.75, 1.25);
    this.centerOffsetZ = this.pos.z * random(0.75, 1.25);
    this.elementsNum = int(random(2, 10));
    this.elementsParam = [];

    this.spawnChance = random(0.00001, 0.01);
    this.generateElements();
  }
  generateElements() {
    for (let e = 0; e < this.elementsNum; e++) {
      let x = this.pos.x * random(0.95, 1.05);

      this.elementsParam[e] = {
        x: this.pos.x,
        y: this.pos.y,
        z: this.pos.z,
        rotX: random(360),
        rotY: random(360),
        rotZ: random(360),
        sizeX: this.size.x * random(0.1, 1),
        sizeY: this.size.y * random(0.1, 1),
        r: random(255),
        g: random(255),
        b: random(255),
        shape: int(random(2))
      }
    }
  }
  update() {
    if (random() < this.spawnChance) {
      this.spawn();
    } else {
      this.display();
    }
  }
  display() {
    for (let e = 0; e < this.elementsNum; e++) {
      push();
      translate(this.elementsParam[e].x, this.elementsParam[e].y, this.elementsParam[e].z);
      rotateX(this.elementsParam[e].rotX);
      rotateY(this.elementsParam[e].rotY);
      rotateZ(this.elementsParam[e].rotZ);
      noStroke();
      fill(this.elementsParam[e].r, this.elementsParam[e].g, this.elementsParam[e].b);
      if (this.elementsParam[e].shape == 0) {
        rect(0, 0, this.elementsParam[e].sizeX, this.elementsParam[e].sizeY);
      } else {
        ellipse(0, 0, this.elementsParam[e].sizeX * 0.5, this.elementsParam[e].sizeY * 0.5);
      }

      pop();
    }
    stroke(0);
    strokeWeight(this.size.x * 0.015);
    line(this.pos.x, this.pos.y, this.pos.z,
      this.centerOffsetX, height / 2, this.centerOffsetZ
    );
  }
}

class Erba {
  constructor(i) {
    this.i = i;
    this.pos = createVector(0, 0, 0);
    this.spawn();
  }
  spawn() {
    this.pos.set(random(-xMax * 0.75, xMax * 0.75), random(-yMax / 4, yMax / 4), random(-zMax * 0.75, zMax * 0.75));
    this.size = zMax * 0.0025 * random(0.1, 1);
    this.centerOffsetX = this.pos.x * random(0.9, 1.1);
    this.centerOffsetZ = this.pos.z * random(0.9, 1.1);

    this.spawnChance = random(0.00001, 0.01);
  }
  update() {
    if (random() < this.spawnChance) {
      this.spawn();
    } else {
      this.display();
    }
  }
  display() {
    strokeWeight(this.size);
    stroke(0);
    line(this.pos.x, this.pos.y, this.pos.z,
      this.centerOffsetX, height / 2, this.centerOffsetZ
    );
  }
}