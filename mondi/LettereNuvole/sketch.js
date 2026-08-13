let dimMax;
const cloudsNum = 1;
let clouds = [];
let font;

function preload() {
    font = loadFont("../../font/IBMPlexMono-Bold.ttf");
}

function setup () {
    createCanvas(windowWidth,windowHeight,WEBGL);
    frameRate(60);
    smooth();

    textFont(font);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    angleMode(DEGREES);

    dimMax = min(width,height)*0.4;

    for (let i = 0; i < cloudsNum; i++) {
        clouds.push(new Nuvola(i));
    }
}

function draw() {
    background(25,189,255);

    rotateY(frameCount*0.15);

    for (let c of clouds) {
        c.update();
        c.display();
    }
}

class Nuvola {
    constructor(i) {
        this.i = i;

        let dimMaxCoeff = 0.5;
        this.pos = createVector(random(-dimMax,dimMax)*dimMaxCoeff,random(-dimMax,dimMax)*dimMaxCoeff,random(-dimMax,dimMax)*dimMaxCoeff);
        this.elementsNum = 100;//int(random(1,100));
        this.elements = [];
        for (let i = 0; i < this.elementsNum; i++) {
            this.elements.push(new Lettera(i));
        }
        this.alpha = 100;
        this.alphaGrowFactor = random(0.01,0.5);
    }
    update() {
        this.alpha += this.alphaGrowFactor;
        if (this.alpha > 220 || this.alpha < 0) {
            this.alphaGrowFactor *= -1;
        }
    }
    display() {
        push();
        translate(this.pos);
        for (let e of this.elements) {
            e.display(this.alpha);
        }
        pop();
    }
}

class Lettera {
    constructor(i) {
        this.i = i;
        this.spawn();
    }
    spawn() {
        let offsetCoeff = 0.1;
        this.pos = createVector(random(-dimMax*offsetCoeff,dimMax*offsetCoeff),random(-dimMax*offsetCoeff,dimMax*offsetCoeff),random(-dimMax*offsetCoeff,dimMax*offsetCoeff));
        this.size = random(dimMax*0.001,dimMax*0.1);
        this.rotation = createVector(random(360),random(360),random(360));
        this.color = color(random(50,220));
        if (random() < 0.5) {
            this.letter = char(int(random(65, 91)));
        } else {
            this.letter = char(int(random(97, 123)));
        }
    }
    display(alpha) {
        push();
        noStroke();
        this.color.setAlpha(alpha);
        fill(this.color);
        translate(this.pos);
        rotateX(this.rotation.x);
        rotateY(this.rotation.y);
        rotateZ(this.rotation.z);
        textSize(this.size);
        text(this.letter,0,0);
        pop();
    }
}