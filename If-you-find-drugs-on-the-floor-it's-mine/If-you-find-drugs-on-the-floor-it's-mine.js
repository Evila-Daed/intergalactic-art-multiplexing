var myCanvas;

var boxNum;
var boxNumMinMax = [20, 20];
var speedMinMax = [0.1, 10];

var allBox = []; // lista con tutti i punti x,y,size

var rotationIndex = [];
var rotationSpeed = [];
var rotationIndexText = [];
var rotationSpeedText = [];

var xMinMax = [];
var yMinMax = [];
var zMinMax = [];

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    myCanvas.position(0, 0);
    myCanvas.style("z-index", "-1");
    frameRate(30);
    noSmooth();
    angleMode(DEGREES);

    // indici di rotazione e velocità
    rotationIndex = [0, 0, 0];
    var rotationDirX, rotationDirY, rotationDirZ;
    if (random(1) < 0.5) {
        rotationDirX = 1;
    } else {
        rotationDirX = -1;
    }
    if (random(1) < 0.5) {
        rotationDirY = 1;
    } else {
        rotationDirY = -1;
    }
    if (random(1) < 0.5) {
        rotationDirZ = 1;
    } else {
        rotationDirZ = -1;
    }
    rotationSpeed = [random(0.4, 0.6) * rotationDirX, random(0.4, 0.6) * rotationDirY, random(0.4, 0.6) * rotationDirZ];

    rotationIndexText = [0, 0, 0];
    var rotationDirXtext, rotationDirYtext, rotationDirZtext;
    if (random(1) < 0.5) {
        rotationDirXtext = 1;
    } else {
        rotationDirXtext = -1;
    }
    if (random(1) < 0.5) {
        rotationDirYtext = 1;
    } else {
        rotationDirYtext = -1;
    }
    if (random(1) < 0.5) {
        rotationDirZtext = 1;
    } else {
        rotationDirZtext = -1;
    }
    rotationSpeedText = [random(0.3, 0.6) * rotationDirXtext, random(0.3, 0.6) * rotationDirYtext, random(0.3, 0.6) * rotationDirZtext];

    // set minmax based on screen ratio
    if (windowWidth > windowHeight) {
        xMinMax = [-windowHeight / 4, windowHeight / 4];
        yMinMax = [-windowHeight / 4, windowHeight / 4];
        zMinMax = [-windowHeight / 4, windowHeight / 4];
    } else {
        xMinMax = [-windowWidth / 4, windowWidth / 4];
        yMinMax = [-windowWidth / 4, windowWidth / 4];
        zMinMax = [-windowWidth / 4, windowWidth / 4];
    }

    // crea array di vertici
    boxNum = int(random(boxNumMinMax[0],boxNumMinMax[1]));
    for (var i = 0; i < boxNum; i++) {
        // direzione random
        var dirX, dirY, dirZ;
        if (random(1) < 0.5) {
            dirX = 1;
        } else {
            dirX = -1;
        }
        if (random(1) < 0.5) {
            dirY = 1;
        } else {
            dirY = -1;
        }
        if (random(1) < 0.5) {
            dirZ = 1;
        } else {
            dirZ = -1;
        }
        allBox.push(
            new Scatola(
                0,
                0,
                0,
                0,
                0,
                0,
                random(speedMinMax[0], speedMinMax[1]) * dirX, // speedX
                random(speedMinMax[0], speedMinMax[1]) * dirY, // speedY
                random(speedMinMax[0], speedMinMax[1]) * dirZ, // speedZ
                random(255), // r
                random(255), // g
                random(255), // b
                i, // index
            )
        );
    }
    background(0);
}

function draw() {
    orbitControl();

    background(0);

    for (var i = 0; i < 3; i++) {
        if (rotationIndex[i] < 360) {
            rotationIndex[i] += rotationSpeed[i];
        } else {
            rotationIndex[i] = 0;
        }
        if (rotationIndexText[i] < 360) {
            rotationIndexText[i] += rotationSpeed[i];
        } else {
            rotationIndexText[i] = 0;
        }
    }

    push();
    rotateX(rotationIndex[0]);
    rotateY(rotationIndex[1]);
    rotateZ(rotationIndex[2]);
    for (var i = 0; i < allBox.length; i++) {
        allBox[i].display();
        allBox[i].move();
    }
    pop();
}


class Scatola {
    constructor(x, y, z, xOffset, yOffset, zOffset, speedX, speedY, speedZ, r, g, b, i) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.zOffset = zOffset;
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
        this.r = r;
        this.g = g;
        this.b = b;
        this.i = i;
    }
    move() {

        if (this.x <= xMinMax[0] || this.x >= xMinMax[1]) {
            this.speedX *= -1;
        }
        if (this.y <= yMinMax[0] || this.y >= yMinMax[1]) {
            this.speedY *= -1;
        }
        if (this.z <= zMinMax[0] || this.z >= zMinMax[1]) {
            this.speedZ *= -1;
        }

        if (this.xOffset < xMinMax[0] / 2) {
            this.xOffset += abs(this.speedX * 0.3);
        } else if (this.xOffset > xMinMax[1]) {
            this.xOffset -= abs(this.speedX * 0.3);
        } else {
            if (random(1) < 0.50) {
                this.xOffset += abs(this.speedX * 0.3);
            } else {
                this.xOffset -= abs(this.speedX * 0.3);
            }
        }
        if (this.yOffset < yMinMax[0] / 2) {
            this.yOffset += abs(this.speedY * 0.3);
        } else if (this.yOffset > yMinMax[1]) {
            this.yOffset -= abs(this.speedY * 0.3);
        } else {
            if (random(1) < 0.50) {
                this.yOffset += abs(this.speedY * 0.3);
            } else {
                this.yOffset -= abs(this.speedY * 0.3);
            }
        }
        if (this.zOffset < zMinMax[0] / 2) {
            this.zOffset += abs(this.speedZ * 0.3);
        } else if (this.zOffset > zMinMax[1]) {
            this.yOffset -= abs(this.speedY * 0.3);
        } else {
            if (random(1) < 0.50) {
                this.yOffset += abs(this.speedY * 0.3);
            } else {
                this.yOffset -= abs(this.speedY * 0.3);
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;

        this.r += random(-10, 10);
        this.g += random(-10, 10);
        this.b += random(-10, 10);

        this.r = constrain(this.r, 0, 255);
        this.g = constrain(this.g, 0, 255);
        this.b = constrain(this.b, 0, 255);
    }
    display() {
        // POLIEDRI
        push();
        translate(this.xOffset, this.yOffset, this.zOffset);
        //noFill();
        //stroke(this.r);
        //strokeWeight(1);
        //noFill();
        strokeWeight(1);
        stroke(this.r, this.g, this.b, 180);
        fill(this.r, this.g, this.b, 35);
        box(this.x, this.y, this.z);
        pop();

    }
}