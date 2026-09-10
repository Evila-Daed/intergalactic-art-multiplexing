let dimMax;
let curve = [];
const curveNum = 50;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    smooth();

    dimMax = min(width, height) * 0.5;

    for (let i = 0; i < curveNum; i++) {
        curve.push(new Curva());
    }

    background(180);
}

function draw() {
    background(180);

    strokeWeight(dimMax * 0.005);
    noFill();

    for (let i = 0; i < curveNum; i++) {
        curve[i].update();
    }
}

class Curva {
    constructor() {
        this.spawn();
    }
    spawn() {
        this.color = color(random(150),random(150),random(150));

        this.vertici = [];
        if (random() < 0.25) {
            this.vertexNum = int(random(2,25));
        } else {
            this.vertexNum = int(random(25,100));
        }
        
        let baseY = height*0.5;
        for (let i = 0; i < this.vertexNum; i++) {
            let x, y;
            if (i == 0) {
                x = 0;
                y = baseY;
            } else if (i == this.vertexNum - 1) {
                x = width;
                y = baseY;
            } else {
                x = map(i, 0, this.vertexNum - 1, 0, width);
                y = baseY + random(-dimMax*0.1,dimMax*0.1);
            }
            this.vertici.push({
                x: x,
                y: y
            });
        }
        this.decay = random(0.0001,0.0025);
        this.life = 1;
    }
    update() {
        this.life -= this.decay;
        if (this.life <= 0) {
            this.spawn();
        }
        this.display();
    }
    display() {
        push();
        translate(0,height*0.5);
        beginShape();
        let size = dimMax * 0.0025 * (1-this.life);
        strokeWeight(size);
        stroke(20,this.life*255);
        fill(20,(1-this.life)*255);
        for (let i = 0; i < this.vertexNum; i++) {
            let y = this.vertici[i].y * this.life;
            vertex(this.vertici[i].x, y);
        }
        endShape();
        pop();
    }
}