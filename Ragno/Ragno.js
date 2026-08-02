let spiders = [];
const spidersNum = 10;
let halfW, halfH, halfD;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  halfW = windowWidth;
  halfH = windowHeight;
  halfD = min(halfW, halfH);
  colorMode(RGB);
  frameRate(120);

  for (var i = 0; i < spidersNum; i++) {
    spiders.push(new Spider(color(random(255),random(255),random(255)),random(0.1,0.9),random(0.01,0.1)));
  }
}

function draw() {
  background(0);
  orbitControl();
  //rotateX(frameCount * 0.002);
  rotateY(frameCount * 0.001);
  //rotateZ(frameCount * 0.001);


  for (let s of spiders) s.updateAndDraw();
}

// ----------------- Spider 3D -----------------
class Spider {
  constructor(col, dirProb, concProb) {
    this.color = col;
    this.dirChangeProb = dirProb;
    this.concentricProb = concProb;

    this.pos = createVector(0, 0, 0);
    this.prev = this.pos.copy();
    this.direction = p5.Vector.random3D();

    this.step = random(1,10);
    this.jitter = 0;
    this.trail = [];
    this.maxTrail = random(50,500);
    
    this.spessore = 1;

    this.mode = "wander";
  }

  bounce() {
    if (abs(this.pos.x) > halfW || abs(this.pos.y) > halfH || abs(this.pos.z) > halfD) {
      this.direction.mult(-1);
      this.pos.x = constrain(this.pos.x, -halfW, halfW);
      this.pos.y = constrain(this.pos.y, -halfH, halfH);
      this.pos.z = constrain(this.pos.z, -halfD, halfD);
    }
  }

  startCircle() {
    this.mode = "circle";
    this.center = this.pos.copy();

    // vettore normale al piano del cerchio
    this.axis = p5.Vector.random3D().normalize();
    // genera base ortogonale
    let arbitrary = abs(this.axis.x) < 0.9 ? createVector(1, 0, 0) : createVector(0, 1, 0);
    this.u = p5.Vector.cross(this.axis, arbitrary).normalize();
    this.v = p5.Vector.cross(this.axis, this.u).normalize();

    this.radius = random(10, halfW * 0.15);
    this.angle = 0;
    this.rotationDir = random([-1, 1]);
    this.turns = int(random(2, 20));

    // leggero spostamento del piano per creare profondità
    this.planeDrift = p5.Vector.random3D().mult(random(1, 25));
    this.verticalAmp = random(5, 30);
    this.verticalStep = random(0.01, 0.05);
  }

  updateAndDraw() {
    if (this.mode === "wander") {
      if (random() < this.concentricProb) this.startCircle();
      if (random() < this.dirChangeProb) this.direction = p5.Vector.random3D();
      this.pos.add(p5.Vector.mult(this.direction, this.step));
    } else {
      // --- cerchio 3D stabile ma con leggera variazione nello spazio ---
      let cosA = cos(this.angle);
      let sinA = sin(this.angle);

      // base ortogonale del piano
      let planar = p5.Vector.add(
        p5.Vector.mult(this.u, cosA * this.radius),
        p5.Vector.mult(this.v, sinA * this.radius)
      );

      // lieve offset lungo asse per spirale o “drift”
      let offset = p5.Vector.mult(
        this.axis,
        sin(this.angle * 1.5) * this.verticalAmp + this.angle * this.verticalStep
      );

      // combinazione + drift del piano
      this.pos = p5.Vector.add(this.center, planar).add(offset).add(this.planeDrift);

      this.angle += (this.step / this.radius) * this.rotationDir;

      // dopo tot giri → esce
      if (this.angle > TWO_PI * this.turns) {
        this.mode = "wander";
        // direzione tangente al cerchio → continuità naturale
        let tang = p5.Vector.add(
          p5.Vector.mult(this.u, -sinA),
          p5.Vector.mult(this.v, cosA)
        ).normalize();
        this.direction = tang;
      }
    }

    this.pos.add(p5.Vector.random3D().mult(this.jitter));
    this.bounce();

    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) this.trail.shift();

    // --- disegno ---
    noFill();
    stroke(this.color);
    strokeWeight(this.spessore);
    beginShape();
    for (let p of this.trail) vertex(p.x, p.y, p.z);
    endShape();

    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    strokeWeight(this.spessore);
    point(0, 0, 0);
    pop();
  }
}

