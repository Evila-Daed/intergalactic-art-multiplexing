// dimensioni
let dimMax;

// walkers
const walkersNum = 1000;
let walkers = [];

const walkersColorChangeCoeff = 1;
const walkersRgbMinMax = [0, 255];
const walkersAlphaMinMax = [2.5, 20];

const walkersDirChangeMinMax = [10, 75];

// valori relativi alla dimensione della finestra
let walkersSizeMinMax = [0, 0];
let walkersSpeedMinMax = [0, 0];

// stars
const starsNumMinMax = [1, 10];
const starsGenerationChance = 0.005;

let starsSizeMinMax = [0, 0];
let starsPositionOffsetMax = 0;

// forze
const centerForce = 0.00001;
const rotationForce = 0.00002;
const mouseForce = 0.75;
let mouseRadius;

// audio
let starsAudio;
let padAudio;
let glitchAudio;
let nasaAudio;

function preload() {
  starsAudio = loadSound("homepage/audio/starsAudio.mp3");
  padAudio = loadSound("homepage/audio/padAudio.mp3");
  glitchAudio = loadSound("homepage/audio/glitchAudio.mp3");
  nasaAudio = loadSound("homepage/audio/nasaAudio.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    background(20);

    // calcolo dimensioni relative
    updateDimensions();

    // walkers generation
    for (let i = 0; i < walkersNum; i++) {
        walkers.push(new Walker());
    }

    startAudioLoop();
}

function draw() {
    background(20, 0.5);

    for (const walker of walkers) {
        walker.update();
        walker.drawWalkers();
        walker.drawStars();
    }

    if (mouseMovedOnce) {
        noStroke();
        for (let i = 5; i > 0; i--) {
            fill(20, 8);
            circle(
                mouseX,
                mouseY,
                mouseRadius * i / 5
            );
        }
    }
}

function mousePressed() {
  userStartAudio();
}
function startAudioLoop() {
    starsAudio.loop();
    starsAudio.amp(0.2);
    padAudio.loop();
    padAudio.amp(0.1);
    glitchAudio.loop();
    glitchAudio.amp(0.1);
    nasaAudio.loop();
    nasaAudio.amp(0.2);
}
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        starsAudio.pause();
        padAudio.pause();
        glitchAudio.pause();
        nasaAudio.pause();
    } else {
        starsAudio.play();
        padAudio.play();
        glitchAudio.play();
        nasaAudio.play();
    }
});

let mouseMovedOnce = false;
function mouseMoved() {
    mouseMovedOnce = true;
}

class Walker {
    constructor() {
        this.spawn();
    }
    spawn() {
        if (random() < 0.7) {
            // 70% dei walker: nucleo galattico
            let angle = random(TWO_PI);
            let radius = abs(randomGaussian(
                dimMax * 0.2,
                dimMax * 0.15
            ));
            this.x = width / 2 + cos(angle) * radius * 1.3;
            this.y = height / 2 + sin(angle) * radius * 0.8;
        } else {
            // 30%: materia diffusa
            this.x = random(width * 0.05, width * 0.95);
            this.y = random(height * 0.05, height * 0.95);
        }
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
        dimMax * 0.00005,
        dimMax * 0.0001
    ];
    starsPositionOffsetMax = dimMax * 0.002;
    mouseRadius = dimMax * 0.05;
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
    let menuToggle = document.getElementById("menu-toggle");
    let menuLinks = document.getElementById("menu-links");

    // entrata frase
    setTimeout(() => {
        info.style.opacity = 1;
    }, 1000);
    // uscita frase
    setTimeout(() => {
        info.style.opacity = 0;
    }, 2000);
    // entrata menu
    setTimeout(() => {
        menu.style.opacity = 1;
    }, 3000);

    // apertura / chiusura link
    menuToggle.addEventListener("click", () => {
        if (menuLinks.classList.contains("collapsed")) {
            menuLinks.classList.remove("collapsed");
            menuToggle.textContent = "HIDE";
        } else {
            menuLinks.classList.add("collapsed");
            menuToggle.textContent = "SHOW";
        }
    });
});