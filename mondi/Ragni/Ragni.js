let spiders = [];
const SPIDERS_NUM = 50;

let dim, bounds;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  dim = min(width, height)*0.5;
  bounds = { x: dim * 0.5, y: dim * 0.5, z: dim * 0.5 };

  for (let i = 0; i < SPIDERS_NUM; i++) spiders.push(new Spider());
}

function draw() {
  background(180);
  orbitControl();

  rotateX(frameCount * 0.00137);
  rotateY(frameCount * 0.00151);
  rotateZ(frameCount * 0.00129);

  noFill();
  strokeWeight(dim*0.005);
  stroke(20);
  box(dim);

  for (let s of spiders) {
    s.update();
    s.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  dim = min(width, height)*0.5;
  bounds = { x: dim * 0.5, y: dim * 0.5, z: dim * 0.5 };
}

class Spider {
  constructor() {
    this.position = createVector(0, 0, 0);
    this.direction = createVector(0, 0, 0);

    this.spawn();
  }
  spawn() {
    this.position.set(random(-dim*0.5,dim*0.5),random(-dim*0.5,dim*0.5),random(-dim*0.5,dim*0.5));
    this.direction.set(p5.Vector.random3D());
    this.color = color(random(50,150));
    this.speed = dim * 0.01 * random(0.001,1);
    this.turnChance = random(0.01,0.5);

    this.trail = [];
    this.trailLength = int(random(20,200));
    this.size = dim * 0.005 * random(0.25,1);

    this.mode = "wander";
    this.circleChance = random(0.0001,0.01);

    this.respawnChance = 0;
  }
  update() {
    if (this.mode === "wander") {
      if (random() < this.circleChance) {
        this.startCircle();
      } else {
        if (random() < this.turnChance) {
          this.direction = p5.Vector.random3D();
        }
        this.position.add(
          p5.Vector.mult(this.direction, this.speed)
        );
        this.checkBounds();
      }
    } else if (this.mode === "circle") {
      this.circle();
    }

    this.trail.push(this.position.copy());
    if (this.trail.length > this.trailLength) this.trail.shift();

    if (random() < this.respawnChance) {
      this.spawn();
    }
  }
  checkBounds() {
    if (abs(this.position.x) > bounds.x) {
      this.position.x = constrain(this.position.x, -bounds.x, bounds.x);
      this.direction.x *= -1;
    }
    if (abs(this.position.y) > bounds.y) {
      this.position.y = constrain(this.position.y, -bounds.y, bounds.y);
      this.direction.y *= -1;
    }
    if (abs(this.position.z) > bounds.z) {
      this.position.z = constrain(this.position.z, -bounds.z, bounds.z);
      this.direction.z *= -1;
    }
  }
  startCircle() {
    this.mode = "circle";
    this.center = this.position.copy();
    this.axis = p5.Vector.random3D();
    this.offsetAmp = random(dim * 0.001, dim * 0.1);
    this.offsetCycles = random(1, 10);

    let a = abs(this.axis.x) < 0.9
      ? createVector(1, 0, 0)
      : createVector(0, 1, 0);

    this.u = p5.Vector.cross(this.axis, a).normalize();
    this.v = p5.Vector.cross(this.axis, this.u).normalize();

    this.radius = random(dim * 0.01, dim * 0.05);
    this.angle = 0;
    this.rotationDir = random([-1, 1]);
    this.turns = random(2, 10);
  }
  circle() {
    let x = cos(this.angle) * this.radius;
    let y = sin(this.angle) * this.radius;
    let offset = sin(this.angle * this.offsetCycles) * this.offsetAmp;

    this.position = createVector(
      this.center.x + this.u.x * x + this.v.x * y + this.axis.x * offset,
      this.center.y + this.u.y * x + this.v.y * y + this.axis.y * offset,
      this.center.z + this.u.z * x + this.v.z * y + this.axis.z * offset
    );

    this.angle += this.speed / this.radius * this.rotationDir;

    if (abs(this.angle) >= TWO_PI * this.turns) {
      this.mode = "wander";
      this.direction = p5.Vector.random3D();
    }
  }
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.size);

    beginShape();
    for (let p of this.trail) vertex(p.x, p.y, p.z);
    endShape();

    push();
    translate(this.position.x, this.position.y, this.position.z);
    point(0, 0, 0);
    pop();
  }
}