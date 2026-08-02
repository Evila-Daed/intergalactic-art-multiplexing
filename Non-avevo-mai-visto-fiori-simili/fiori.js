let flowers = [];
const flowersNum = 50;
let cam1;
let maxDim = 0;


function setup() {
  createCanvas(windowWidth,windowHeight,WEBGL);
  angleMode(DEGREES);
  rectMode(CENTER);
  frameRate(120);
  smooth();

  maxDim = min(width,height);

  cam1 = createCamera();
  cam1.setPosition(width*1.5, -height/4, 0);
  cam1.lookAt(0, 0, 0);

  for (let i = 0; i < flowersNum; i++) {
    flowers.push(new Fiore(i));
  } 
}

function draw() {
  background(180);

  rotateY(frameCount*0.1);

  push();
  noStroke();
  fill(0);
  translate(0,height/2,0);
  rotateX(90);  
  box(maxDim,maxDim,10);
  pop();

  for (let i = 0; i < flowersNum; i++) {
    flowers[i].display();
  } 
}

class Fiore {
  constructor(i) {
    this.i = i;
    this.pos = createVector(0,0,0);
    this.size = createVector(0,0,0);

    this.spawn();
  }   
  spawn() {
    this.pos.set(random(-maxDim/3,maxDim/3),random(-maxDim/2,maxDim/4),random(-maxDim/3,maxDim/3));
    this.size.set(height*random(0.1,0.2),height*random(0.1,0.2),height*random(0.1,0.2));
    this.elementsNum = int(random(2,16));
    this.elementsParam = [];
    this.generateElements();
  }
  generateElements() {
    for (let e = 0; e < this.elementsNum; e++) {
      this.elementsParam[e] = {
        x: this.pos.x*random(0.95,1.05),
        y: this.pos.y*random(0.95,1.05),
        z: this.pos.z*random(0.95,1.05),
        rotX: random(360),
        rotY: random(360),
        rotZ: random(360),
        sizeX: this.size.x*random(0.1,1),
        sizeY: this.size.y*random(0.1,1),
        r: random(255),
        g: random(255),
        b: random(255),
        shape: int(random(2))
      }
    }
  }
  display() {
    for (let e = 0; e < this.elementsNum; e++) {
      push();
      translate(this.elementsParam[e].x,this.elementsParam[e].y,this.elementsParam[e].z);
      rotateX(this.elementsParam[e].rotX);
      rotateY(this.elementsParam[e].rotY);
      rotateZ(this.elementsParam[e].rotZ);
      noStroke();
      fill(this.elementsParam[e].r,this.elementsParam[e].g,this.elementsParam[e].b);
      if (this.elementsParam[e].shape == 0) {
        rect(0,0,this.elementsParam[e].sizeX,this.elementsParam[e].sizeY);
      } else {
        ellipse(0,0,this.elementsParam[e].sizeX*0.5,this.elementsParam[e].sizeY*0.5);
      }

      pop();
    }
    stroke(0);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.pos.z,
      this.pos.x, height / 2, this.pos.z
    );

    if (random() < 0.01) {
      this.generateElements();
    }
    if (random() < 0.001) {
      this.spawn();
    }
  }
}