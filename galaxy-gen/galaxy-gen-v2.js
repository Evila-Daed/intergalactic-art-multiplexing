// dimensioni
let dimMax;

// walkers
const walkersNum = 1000;
let walkers = [];

const walkersColorChangeCoeff = 1;
const walkersRgbMinMax = [0, 255];
const walkersAlphaMinMax = [0, 30];

const walkersDirChangeMinMax = [5, 50];

// valori relativi alla dimensione della finestra
let walkersSizeMinMax = [0, 0];
let walkersSpeedMinMax = [0, 0];

// stars
const starsNumMinMax = [1, 10];
const starsGenerationChance = 0.001;

let starsSizeMinMax = [0, 0];
let starsPositionOffsetMax = 0;

// forze
const centerForce = 0.00001;
const rotationForce = 0.00002;
const mouseForce = 0.75;
let mouseRadius;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(120);
    background(0);

    // calcolo dimensioni relative
    updateDimensions();

    // walkers generation
    for (let i = 0; i < walkersNum; i++) {
        walkers.push(new Walker());
    }
}

function draw() {
    background(0, 0.25);

    for (const walker of walkers) {
        walker.update();
        walker.drawWalkers();
        walker.drawStars();
    }

    if (mouseMovedOnce) {
        noStroke();
        fill(0, 20);
        circle(mouseX, mouseY, mouseRadius * 0.75);
    }
}

let mouseMovedOnce = false;
function mouseMoved() {
    mouseMovedOnce = true;
}

class Walker {
    constructor() {
        this.spawn();
    }
    spawn() {
        let angle = random(TWO_PI);
        let radius = abs(randomGaussian(
            dimMax * 0.15,
            dimMax * 0.1
        ));
        this.x = width / 2 + cos(angle) * radius * 1.5;
        this.y = height / 2 + sin(angle) * radius * 0.5;
        this.size = random(walkersSizeMinMax[0], walkersSizeMinMax[1]);
        this.dirX = random([-1, 1]);
        this.dirY = random([-1, 1]);
        this.r = random(walkersRgbMinMax[0], walkersRgbMinMax[1]);
        this.g = random(walkersRgbMinMax[0], walkersRgbMinMax[1]);
        this.b = random(walkersRgbMinMax[0], walkersRgbMinMax[1]);
        this.a = random(walkersAlphaMinMax[0], walkersAlphaMinMax[1]);
        this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
        this.speed = random(walkersSpeedMinMax[0], walkersSpeedMinMax[1]);
    }
    update() {
        this.colorUpdate();
        this.move();
        this.sizeUpdate();
    }
    colorUpdate() {
        if (this.r <= walkersRgbMinMax[0]) {
            this.r += walkersColorChangeCoeff;
        } else if (this.r >= walkersRgbMinMax[1]) {
            this.r += walkersColorChangeCoeff;
        } else {
            if (random(1) < 0.5) {
                this.r += walkersColorChangeCoeff;
            } else {
                this.r -= walkersColorChangeCoeff;
            }
        }
        if (this.g <= walkersRgbMinMax[0]) {
            this.g += walkersColorChangeCoeff;
        } else if (this.g >= walkersRgbMinMax[1]) {
            this.g += walkersColorChangeCoeff;
        } else {
            if (random(1) < 0.5) {
                this.g += walkersColorChangeCoeff;
            } else {
                this.g -= walkersColorChangeCoeff;
            }
        }
        if (this.b <= walkersRgbMinMax[0]) {
            this.b += walkersColorChangeCoeff;
        } else if (this.b >= walkersRgbMinMax[1]) {
            this.b += walkersColorChangeCoeff;
        } else {
            if (random(1) < 0.5) {
                this.b += walkersColorChangeCoeff;
            } else {
                this.b -= walkersColorChangeCoeff;
            }
        }
        // ALPHA
        if (this.a <= walkersAlphaMinMax[0]) {
            this.a++;
        } else if (this.a >= walkersAlphaMinMax[1]) {
            this.a--;
        } else {
            this.a += random(-1, 1);
        }
        this.r = constrain(this.r, walkersRgbMinMax[0], walkersRgbMinMax[1]);
        this.g = constrain(this.g, walkersRgbMinMax[0], walkersRgbMinMax[1]);
        this.b = constrain(this.b, walkersRgbMinMax[0], walkersRgbMinMax[1]);
        this.a = constrain(this.a, walkersAlphaMinMax[0], walkersAlphaMinMax[1]);
    }
    move() {
        // MOVIMENTO
        if (this.x < this.size / 2) {
            this.dirX = 1;
            this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
        } else if (this.x > windowWidth - this.size / 2) {
            this.dirX = -1;
            this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
        } else {
            if (random(101) < this.dirChange) {
                this.dirX *= -1;
                this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
            }
        }
        if (this.y < this.size / 2) {
            this.dirY = 1;
            this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
        } else if (this.y > windowHeight - this.size / 2) {
            this.dirY = -1;
            this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
        } else {
            if (random(101) < this.dirChange) {
                this.dirY *= -1;
                this.dirChange = random(walkersDirChangeMinMax[0], walkersDirChangeMinMax[1]);
            }
        }

        this.x += random(this.speed * 0.5, this.speed) * this.dirX;
        this.y += random(this.speed * 0.5, this.speed) * this.dirY;

        // attrazione verso il centro
        let centerX = width * 0.5;
        let centerY = height * 0.5;
        let dx = centerX - this.x;
        let dy = centerY - this.y;
        this.x += dx * centerForce;
        this.y += dy * centerForce;
        // rotazione attorno al centro
        this.x += -dy * rotationForce;
        this.y += dx * rotationForce;

        // perturbazione mouse
        let mouseDX = this.x - mouseX;
        let mouseDY = this.y - mouseY;
        let mouseDist = sqrt(mouseDX * mouseDX + mouseDY * mouseDY);
        if (mouseDist < mouseRadius && mouseDist > 0) {
            let force = (mouseRadius - mouseDist) / mouseRadius;
            this.x += mouseDX / mouseDist * force * mouseForce;
            this.y += mouseDY / mouseDist * force * mouseForce;
        }

        this.x = constrain(this.x, this.size / 2, windowWidth - this.size / 2);
        this.y = constrain(this.y, this.size / 2, windowHeight - this.size / 2);
    }
    sizeUpdate() {
        this.size = random(walkersSizeMinMax[0], walkersSizeMinMax[1]);
    }
    drawWalkers() {
        noStroke();
        fill(this.r, this.g, this.b, this.a);
        circle(this.x, this.y, this.size);
    }
    drawStars() {
        if (random() < starsGenerationChance) {
            let starsNum = int(random(starsNumMinMax[0], starsNumMinMax[1]));
            for (let i = 0; i < starsNum; i++) {
                let size = random(starsSizeMinMax[0], starsSizeMinMax[1]);
                let x = this.x + random(-starsPositionOffsetMax, starsPositionOffsetMax);
                let y = this.y + random(-starsPositionOffsetMax, starsPositionOffsetMax);
                let light = random(150, 255);
                noStroke();
                fill(light);
                circle(x, y, size);
            }
        }
    }
}

function updateDimensions() {
    dimMax = min(width, height);
    walkersSizeMinMax = [
        dimMax * 0.0005,
        dimMax * 0.001
    ];
    walkersSpeedMinMax = [
        dimMax * 0.0001,
        dimMax * 0.001
    ];
    starsSizeMinMax = [
        dimMax * 0.0001,
        dimMax * 0.001
    ];
    starsPositionOffsetMax = dimMax * 0.002;
    mouseRadius = dimMax * 0.15;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateDimensions();
}

function resizeWalkers() {
    for (let walker of walkers) {
        walker.x = width * 0.5 + (walker.x - width * 0.5) * 0.9;
        walker.y = height * 0.5 + (walker.y - height * 0.5) * 0.9;
    }
}

window.addEventListener("load", () => {
    let info = document.getElementById("info");
    let menu = document.getElementById("menu");

    // entrata frase
    setTimeout(() => {
        info.style.opacity = 1;
    }, 1000);

    // uscita frase
    setTimeout(() => {
        info.style.opacity = 0;
    }, 3000);

    // entrata menu
    setTimeout(() => {
        menu.style.opacity = 1;
    }, 4000);

});