let dimMax;
let curve = [];
const curveNum = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    smooth();

    dimMax = min(width, height) * 0.5;

    for (let i = 0; i < curveNum; i++) {
        curve.push(new Curva());
    }
}

function draw() {
    background(180);

    for (let i = 0; i < curveNum; i++) {
        curve[i].update();
    }
}

class Curva {
    constructor() {
        this.spawn();
    }
    spawn() {
        this.color = color(random(20,50));

        this.vertici = [];
        if (random() < 0.75) {
            this.vertexNum = int(random(2,20));
        } else {
            this.vertexNum = int(random(20,150));
        }
        
        let baseY = height*0.6;
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
                y = baseY + random(-dimMax*0.075,dimMax*0.075);
            }
            this.vertici.push({
                x: x,
                y: y
            });
        }
        this.decay = random(0.0001,0.005);
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
        noStroke();
        fill(this.color,(1-this.life)*255);
        for (let i = 0; i < this.vertexNum; i++) {
            let y = this.vertici[i].y * (this.life);
            vertex(this.vertici[i].x, y);
        }
        endShape();
        pop();
    }
}