var myCanvas;

const boxNum = 25;
var speedMinMax = [0.5, 2.5];

var allBox = []; // lista con tutti i punti x,y,size

let dimMax;

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
    smooth();
    angleMode(DEGREES);

    dimMax = min(width, height) * 0.5;

    // crea array di vertici
    for (var i = 0; i < boxNum; i++) {
        allBox.push(new Scatola(i));
    }
    background(0);
}

function draw() {
    orbitControl();

    background(0);

    rotateX(frameCount * 0.15);
    rotateY(frameCount * 0.17);
    rotateZ(frameCount * 0.11);

    for (var i = 0; i < allBox.length; i++) {
        allBox[i].update();
    }
}


class Scatola {
    constructor(i) {
        this.i = i;
        this.speed = createVector(0, 0, 0);
        this.offset = createVector(0, 0, 0);
        this.rotation = createVector(0, 0, 0);
        this.spawn();

    }
    spawn() {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.offset.set(0, 0, 0);

        let dirX = random() < 0.5 ? -1 : 1;
        let dirY = random() < 0.5 ? -1 : 1;
        let dirZ = random() < 0.5 ? -1 : 1;
        this.speedX = random(speedMinMax[0], speedMinMax[1]) * dirX;
        this.speedY = random(speedMinMax[0], speedMinMax[1]) * dirY;
        this.speedZ = random(speedMinMax[0], speedMinMax[1]) * dirZ;
        this.speed.set(
            random(speedMinMax[0], speedMinMax[1]) * dirX,
            random(speedMinMax[0], speedMinMax[1]) * dirY,
            random(speedMinMax[0], speedMinMax[1]) * dirZ
        );

        this.r = random(255);
        this.g = random(255);
        this.b = random(255);
        this.colorChangeSpeed = random(0.1, 10);

        let rotationMax = 1.5;
        this.rotation.set(
            random(-rotationMax, rotationMax),
            random(-rotationMax, rotationMax),
            random(-rotationMax, rotationMax)
        );
    }
    update() {
        this.move();
        this.colorChange();

        if (random() < 0.001) {
            this.spawn();
        }

        this.display();
    }
    move() {
        if (this.x <= -dimMax || this.x >= dimMax) {
            this.speed.x *= -1;
        }
        if (this.y <= -dimMax || this.y >= dimMax) {
            this.speed.y *= -1;
        }
        if (this.z <= -dimMax || this.z >= dimMax) {
            this.speed.z *= -1;
        }

        if (this.offset.x < -dimMax / 2) {
            this.offset.x += abs(this.speed.x * 0.3);
        } else if (this.offset.x > dimMax / 2) {
            this.offset.x -= abs(this.speed.x * 0.3);
        } else {
            if (random(1) < 0.50) {
                this.offset.x += abs(this.speed.x * 0.3);
            } else {
                this.offset.x -= abs(this.speed.x * 0.3);
            }
        }
        if (this.offset.y < -dimMax / 2) {
            this.offset.y += abs(this.speed.y * 0.3);
        } else if (this.offset.y > dimMax / 2) {
            this.offset.y -= abs(this.speed.y * 0.3);
        } else {
            if (random(1) < 0.50) {
                this.offset.y += abs(this.speed.y * 0.3);
            } else {
                this.offset.y -= abs(this.speed.y * 0.3);
            }
        }
        if (this.offset.z < -dimMax / 2) {
            this.offset.z += abs(this.speed.z * 0.3);
        } else if (this.offset.z > dimMax / 2) {
            this.offset.z -= abs(this.speed.z * 0.3);
        } else {
            if (random(1) < 0.50) {
                this.offset.z += abs(this.speed.z * 0.3);
            } else {
                this.offset.z -= abs(this.speed.z * 0.3);
            }
        }

        this.x += this.speed.x;
        this.y += this.speed.y;
        this.z += this.speed.z;
    }
    colorChange() {
        this.r += random(-this.colorChangeSpeed, this.colorChangeSpeed);
        this.g += random(-this.colorChangeSpeed, this.colorChangeSpeed);
        this.b += random(-this.colorChangeSpeed, this.colorChangeSpeed);

        this.r = constrain(this.r, 0, 255);
        this.g = constrain(this.g, 0, 255);
        this.b = constrain(this.b, 0, 255);
    }
    display() {
        // POLIEDRI
        push();
        translate(this.offset.x, this.offset.y, this.offset.z);
        rotateX(this.rotation.x);
        rotateY(this.rotation.y);
        rotateZ(this.rotation.z);
        strokeWeight(dimMax * 0.005);
        stroke(this.r, this.g, this.b, 120);
        fill(this.r, this.g, this.b, 35);
        box(this.x, this.y, this.z);
        pop();
    }
}