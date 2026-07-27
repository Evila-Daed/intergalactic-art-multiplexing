let myCanvas;

let entitiesNum = 1000;
let allEntities = [];

let colorChangeCoeff = 1;
let rgbMinMax = [0, 255];
let alphaMinMax = [0, 10];

let dirChangeMinMax = [1, 50];
let sizeMinMax = [0.01, 2.5];
let speedMinMax = [0.1, 1];

let starsNumMinMax = [1, 5];
let starGenChance = 0.01;

let globalChance = 1;

let centerForce = 0.00001;
let rotationForce = 0.00001;

let zoom = 1;
    
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(120);

    background(0);

    allEntities = [];
    let x = width*0.5;
    let y = height*0.5;
    for (let i = 0; i < entitiesNum; i++) {
        let x, y;
        if (random() < 0.9) {
            x = random(width);
            y = random(height);
        } else {
            x = width * 0.5;
            y = height * 0.5;
        }
        allEntities.push(new Entità(x,y));
    }
}

function draw() {
    background(0,0.2);

    for (let i = 0; i < entitiesNum; i++) {
        if (random() < globalChance) {
            allEntities[i].colorUpdate();
            allEntities[i].posSizeUpdate();
            allEntities[i].display();
        }
    }
}

class Entità {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.size = random(sizeMinMax[0], sizeMinMax[1]);
        this.dirX = 1;
        this.dirY = 1;
        this.r = random(rgbMinMax[0], rgbMinMax[1]);
        this.g = random(rgbMinMax[0], rgbMinMax[1]);
        this.b = random(rgbMinMax[0], rgbMinMax[1]);
        this.a = random(alphaMinMax[0], alphaMinMax[1]);
        this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
        this.speedCoeff = random(speedMinMax[0], speedMinMax[1]);
        this.dirX = random([-1,1]);
        this.dirY = random([-1,1]);
    }
    colorUpdate() {
        if (this.r <= rgbMinMax[0]) {
            this.r += colorChangeCoeff;
        } else if (this.r >= rgbMinMax[1]) {
            this.r += colorChangeCoeff;
        } else {
            if (random(1) < 0.5) {
                this.r += colorChangeCoeff;
            } else {
                this.r -= colorChangeCoeff;
            }
        }
        if (this.g <= rgbMinMax[0]) {
            this.g += colorChangeCoeff;
        } else if (this.g >= rgbMinMax[1]) {
            this.g += colorChangeCoeff;
        } else {
            if (random(1) < 0.5) {
                this.g += colorChangeCoeff;
            } else {
                this.g -= colorChangeCoeff;
            }
        }
        if (this.b <= rgbMinMax[0]) {
            this.b += colorChangeCoeff;
        } else if (this.b >= rgbMinMax[1]) {
            this.b += colorChangeCoeff;
        } else {
            if (random(1) < 0.5) {
                this.b += colorChangeCoeff;
            } else {
                this.b -= colorChangeCoeff;
            }
        }
        // ALPHA
        if (this.a <= alphaMinMax[0]) {
            this.a++;
        } else if (this.a >= alphaMinMax[1]) {
            this.a--;
        } else {
            this.a += random(-1, 1);
        }
        this.r = constrain(this.r, rgbMinMax[0], rgbMinMax[1]);
        this.g = constrain(this.g, rgbMinMax[0], rgbMinMax[1]);
        this.b = constrain(this.b, rgbMinMax[0], rgbMinMax[1]);
        this.a = constrain(this.a, alphaMinMax[0], alphaMinMax[1]);
    }
    posSizeUpdate() {
        // DIMENSIONE
        this.size = random(sizeMinMax[0], sizeMinMax[1]);

        // MOVIMENTO
        if (this.x < this.size / 2) {
            this.dirX = 1;
            this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
        } else if (this.x > windowWidth - this.size / 2) {
            this.dirX = -1;
            this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
        } else {
            if (random(101) < this.dirChange) {
                this.dirX *= -1;
                this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
            }
        }
        if (this.y < this.size / 2) {
            this.dirY = 1;
            this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
        } else if (this.y > windowHeight - this.size / 2) {
            this.dirY = -1;
            this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
        } else {
            if (random(101) < this.dirChange) {
                this.dirY *= -1;
                this.dirChange = random(dirChangeMinMax[0], dirChangeMinMax[1]);
            }
        }

        this.x += random(this.speedCoeff * 0.5, this.speedCoeff) * this.dirX;
        this.y += random(this.speedCoeff * 0.5, this.speedCoeff) * this.dirY;

        let centerX = width * 0.5;
        let centerY = height * 0.5;
        let dx = centerX - this.x;
        let dy = centerY - this.y;
        // attrazione verso il centro
        this.x += dx * centerForce;
        this.y += dy * centerForce;
        // rotazione attorno al centro
        this.x += -dy * rotationForce;
        this.y += dx * rotationForce;

        this.x = constrain(this.x, this.size / 2, windowWidth - this.size / 2);
        this.y = constrain(this.y, this.size / 2, windowHeight - this.size / 2);
        this.size = constrain(this.size, sizeMinMax[0], sizeMinMax[1]);
    }
    display() {
        // STELLE
        if (random() < starGenChance) {
            let starsNum = int(random(starsNumMinMax[0], starsNumMinMax[1]));
            for (let i = 0; i < starsNum; i++) {
                noStroke();
                fill(random(130, 255), random(alphaMinMax[0]*10, alphaMinMax[1]*10));
                let starX = this.x + random(-this.size, this.size);
                let starY = this.y + random(-this.size, this.size);
                let starSize = random(this.size*0.1,this.size*0.5);
                circle(starX, starY, starSize);
            }
        }
        
        noStroke();
        fill(this.r, this.g, this.b, this.a);
        circle(this.x, this.y, this.size);
    }
}

