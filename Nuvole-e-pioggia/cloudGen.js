const cloudsNum = 100;
let clouds = [];
let drops = [];
let groundWater = 0;

let maxDim;



function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);
    frameRate(120);
    smooth();

    maxDim = min(width / 3, height / 3);

    for (let i = 0; i < cloudsNum; i++) {
        clouds.push(new Nuvola(i));
    }
}

function draw() {
    background(135, 206, 250);

    rotateY(frameCount * 0.13);

    push();
    noStroke();
    fill(50);
    translate(0, maxDim-groundWater/2, 0);
    box(maxDim*2, groundWater, maxDim*2);
    pop();

    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].update();
        clouds[i].display();
    }

    for (let i = drops.length - 1; i >= 0; i--) {
        drops[i].update();
        drops[i].display();

        if (drops[i].dead) {
            drops.splice(i, 1);
        }
    }
}

class Nuvola {
    constructor(i) {
        this.i = i;
        this.color = color(random(50, 255));
        this.pos = createVector(
            random(-maxDim*0.75, maxDim*0.75),
            random(-maxDim * 0.75, -maxDim * 0.25),
            random(-maxDim*0.75, maxDim*0.75)
        );
        this.water = random(5, 50);
        this.rotY = random(360);
    }
    update() {
        // pioggia
        if (random() < 0.005 && this.water > 20) {
            drops.push(new Goccia(this));
            this.water -= random(0.1,0.25);
        }

        // assorbimento
        if (random() < 0.001 && groundWater > 0 && this.water < 50) {
            let rndVal = random(1, 5);
            this.water += rndVal;
            groundWater -= rndVal;
        }
    }
    display() {
        push();
        noStroke();
        fill(this.color);
        translate(this.pos);
        rotateY(this.rotY);
        box(this.water);
        pop();
    }
}

class Goccia {
    constructor(cloud) {
        this.cloud = cloud;
        this.pos = cloud.pos.copy();
        this.color = cloud.color;
        this.speed = random(1, 2.5);
        this.dead = false;
    }
    update() {
        this.pos.y += this.speed;
        if (this.pos.y > maxDim) {
            groundWater++;
            this.dead = true;
        }
    }
    display() {
        push();
        noStroke();
        fill(this.color);
        translate(this.pos);
        sphere(2);
        pop();
    }
}