let schegge = [];
const scheggeNum = 100;
let dimMax = 0;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  rectMode(CENTER);
  frameRate(60);
  smooth();

  dimMax = min(width, height) * 0.25;

  for (let i = 0; i < scheggeNum; i++) {
    schegge.push(new Scheggia(i));
  }
}

function draw() {
  background(20);

  rotateY(frameCount*0.17);

  translate(0, height * 0.2, 0);

  //rotateX(frameCount * 0.57);
  //rotateY(frameCount * 0.53);
  //rotateZ(frameCount * 0.51);

  for (let i = 0; i < scheggeNum; i++) {
    schegge[i].update();
    schegge[i].display();
  }
}

class Scheggia {
  constructor(i) {
    this.i = i;
    this.pos = createVector(0, 0, 0);
    this.spawn();
  }
  spawn() {
    this.pos.set(0, 0, 0);
    this.speed = p5.Vector.random3D();
    this.size = dimMax * 0.025 * random(0.1, 1);
    this.dimMax = random(0.25, 1) * dimMax;
    this.color = color(random(50, 180), random(50, 180), random(50, 180));

    this.distanceNorm = 0;

    this.historyMax = int(random(5, 50));
    this.history = new Array(this.historyMax);
    this.historyIndex = 0;
    this.historyCount = 0;
  }
  update() {
    this.distanceNorm = constrain(this.pos.mag() / this.dimMax, 0, 1);

    let coeff = max(0.5, 2.5 - this.distanceNorm);

    this.pos.add(
      this.speed.x * coeff,
      this.speed.y * coeff,
      this.speed.z * coeff
    );

    if (this.pos.x < -this.dimMax || this.pos.x > this.dimMax
      || this.pos.y < -this.dimMax || this.pos.y > this.dimMax
      || this.pos.z < -this.dimMax || this.pos.z > this.dimMax
    ) {
      this.spawn();
    }

    this.history[this.historyIndex] = this.pos.copy();
    this.historyIndex = (this.historyIndex + 1) % this.historyMax;
    if (this.historyCount < this.historyMax) {
      this.historyCount++;
    }
  }
  display() {
    let size = this.size * this.distanceNorm * 0.5;
    // schegge
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(this.color);
    noStroke();
    sphere(size, 8, 8);
    pop();

    // linee
    stroke(this.color);
    strokeWeight(size * 0.75);
    noFill();
    beginShape();
    for (let i = 0; i < this.historyCount; i++) {
      let index = (this.historyIndex + i) % this.historyMax;
      let p = this.history[index];
      if (p) {
        vertex(p.x, p.y, p.z);
      }
    }
    endShape();
  }
}