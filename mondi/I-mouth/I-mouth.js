// persone
var people = [];
var peopleNum = 20;
const peopleOnChance = 0.0005;

// ragno
var ragni = [];
const ragniNum = 10;

var font;

var cam1;
var roomSize;

const bgColor = 120;
const skyColor = 220;
const groundColor = 50;
const textColor = 50;

var fonts = [];

function preload() {
    fonts.push(loadFont("../../font/IBMPlexMono-Bold.ttf"));
    //fonts.push(loadFont("../font/IBMPlexMono-Light.ttf"));
    fonts.push(loadFont("../../font/IBMPlexMono-Medium.ttf"));
    fonts.push(loadFont("../../font/IBMPlexMono-Regular.ttf"));
    //fonts.push(loadFont("../font/IBMPlexMono-Thin.ttf"));
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    textAlign(CENTER, BOTTOM);
    rectMode(CENTER);
    angleMode(DEGREES);
    frameRate(30);
    smooth();

    // dimensioni
    roomSize = min(width, height);

    cam1 = createCamera();
    cam1.setPosition(roomSize * 3, 0, 0);
    cam1.lookAt(0, 0, 0);

    // ragno
    for (let i = 0; i < ragniNum; i++) {
        ragni.push(new Ragno(i));
    }

    // persone
    for (let i = 0; i < peopleNum; i++) {
        people.push(new Persona(i));
    }
}

function draw() {
    background(bgColor);

    rotateY(frameCount * 0.0301);

    noStroke();
    // pavimento
    push();
    translate(0, roomSize * 1.5, 0);
    rotateX(90);
    fill(groundColor);
    rect(0, 0, roomSize * 2, roomSize * 2);
    pop();
    // soffitto
    push();
    translate(0, -roomSize * 1.5, 0);
    rotateX(90);
    fill(skyColor);
    rect(0,0,roomSize*2,roomSize*2);
    pop();

    // RAGNO
    for (let i = 0; i < ragniNum; i++) {
        ragni[i].update();
        ragni[i].display();
    }

    // PERSONE
    for (let n = 0; n < peopleNum; n++) {
        people[n].update();
    }
}

class Persona {
    constructor(i) {
        this.i = i;
        this.active = 0;
    }
    update() {
        if (this.active === 0) {
            if (random() < peopleOnChance) {
                this.randomizeParam();

                this.active = 1;
            }
        } else {
            this.display();
            this.rotate();
        }

        // dimension calc
        this.relativeDim = pow(this.relativeDim, this.decayRamp);
        this.textDimension *= this.relativeDim;
        if (this.textDimension <= 0.5) {
            this.active = 0;
        }
        this.relativeDim -= this.decayFactor;
    }
    randomizeParam() {
        this.pos = createVector(random(-roomSize * 0.75, roomSize * 0.75), random(-roomSize * 0.2, roomSize * 0.75), random(-roomSize * 0.75, roomSize * 0.75));

        this.rotYCoeff = random(360);
        this.rotYSpeed = pow(random(0.01, 1), 2);
        if (random() < 0.5) {
            this.rotYSpeed *= -1;
        }
        this.textRandIndex = int(random(testi.length));
        this.font = random(fonts);
        this.text = randomWrapText(testi[this.textRandIndex], 1, 4);
        this.textDimension = roomSize * 0.1 * random(0.25, 1);

        this.relativeDim = 1;
        this.decayFactor = random(0.0001, 0.01);
        this.decayRamp = random(0.1, 0.5);
    }
    rotate() {
        this.rotYCoeff += this.rotYSpeed;

        if (this.rotYCoeff >= 360) {
            this.rotYCoeff = 0;
        }
        if (this.rotYCoeff < 0) {
            this.rotYCoeff = 359;
        }
        this.rotYCoeff = constrain(this.rotYCoeff, 0, 360);
    }
    display() {
        if (this.active === 1) {
            // testo
            push();
            translate(this.pos.x, this.pos.y - this.textDimension / 4, this.pos.z);
            rotateY(this.rotYCoeff);
            fill(textColor);
            textFont(this.font);
            textSize(this.textDimension);
            text(this.text, 0, 0);
            pop();

            stroke(textColor);
            strokeWeight(this.textDimension * 0.1);
            line(this.pos.x, this.pos.y, this.pos.z, this.pos.x, roomSize * 1.5 - 1, this.pos.z);
            //strokeWeight(this.textDimension * 0.05);
            //line(this.pos.x, roomSize - 1, this.pos.z, 0, 0, 0);
        }
    }
}

function randomWrapText(str, minWords = 4, maxWords = 10) {
    let words = str.split(' ');

    // testi corti → no wrapping
    if (words.length <= maxWords) return str;

    let lines = [];
    let index = 0;

    while (index < words.length) {

        // numero casuale di parole per riga
        let count = floor(random(minWords, maxWords + 1));

        // evita ultima riga da 1 parola
        let remaining = words.length - index;

        if (remaining <= maxWords) {
            count = remaining;
        }

        let line = words.slice(index, index + count).join(' ');
        lines.push(line);

        index += count;
    }

    return lines.join('\n');
}

class Ragno {
    constructor(i) {
        this.i = i;
        this.spawn();
    }
    spawn() {
        this.color = color(random(100), random(100), random(100));
        this.pos = createVector(0, -roomSize * 0.5, 0);
        this.speedMin = 0.1;
        this.speedMax = 2.5;
        this.speed = createVector(
            random() < 0.5 ? -1 : 1,
            random() < 0.5 ? -1 : 1,
            random() < 0.5 ? -1 : 1
        );
        this.speed.mult(random(this.speedMin, this.speedMax), random(this.speedMin, this.speedMax), random(this.speedMin, this.speedMax));
        this.colorSpeed = createVector(
            random() < 0.5 ? -1 : 1,
            random() < 0.5 ? -1 : 1,
            random() < 0.5 ? -1 : 1
        );
        this.colorSpeed.mult(random(this.speedMin * 0.01, this.speedMax), random(this.speedMin * 0.01, this.speedMax), random(this.speedMin * 0.01, this.speedMax));
        this.size = random(2.5, 20);
        this.details = int(random(2, 10));
        this.speedChangeChance = random(0.1, 0.5);
        this.decayFactor = random(0.9, 0.999);

        this.linkedPeoples = [];
        for (let i = 0; i < peopleNum; i++) {
            let active;
            if (random() < 0.9) { active = 0 } else { active = 1 }
            this.linkedPeoples.push(active);
        }
        let bezierMaxFactor = 4;
        this.bezierOffset1 = createVector(random(-bezierMaxFactor, bezierMaxFactor), random(-bezierMaxFactor, bezierMaxFactor), random(-bezierMaxFactor, bezierMaxFactor));
        this.bezierOffset2 = createVector(random(-bezierMaxFactor, bezierMaxFactor), random(-bezierMaxFactor, bezierMaxFactor), random(-bezierMaxFactor, bezierMaxFactor));
    }
    update() {
        if (random() < this.speedChangeChance) {
            this.speed = createVector(
                random() < 0.5 ? -1 : 1,
                random() < 0.5 ? -1 : 1,
                random() < 0.5 ? -1 : 1
            );
            this.speed.mult(random(this.speedMin, this.speedMax), random(this.speedMin, this.speedMax), random(this.speedMin, this.speedMax));
        }
        this.move();

        this.size *= this.decayFactor;
        if (this.size < 2) {
            this.spawn();
        }
    }
    move() {
        this.pos.add(this.speed.x, this.speed.y, this.speed.z);

        if (this.pos.x < -roomSize || this.pos.x > roomSize) {
            this.speed.x *= -1;
        }
        if (this.pos.y < -roomSize || this.pos.y > roomSize * 2) {
            this.speed.y *= -1;
        }
        if (this.pos.z < -roomSize || this.pos.z > roomSize) {
            this.speed.z *= -1;
        }


        let col = createVector(red(this.color), green(this.color), blue(this.color));
        col.add(this.colorSpeed.x, this.colorSpeed.y, this.colorSpeed.z);
        if (col.x < 0 || col.x > 100) {
            this.colorSpeed.x *= -1;
        }
        if (col.y < 0 || col.y > 100) {
            this.colorSpeed.y *= -1;
        }
        if (col.z < 0 || col.z > 100) {
            this.colorSpeed.z *= -1;
        }
        this.color = color(col.x, col.y, col.z,100);
    }
    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        fill(this.color);
        noStroke();
        sphere(this.size, this.details);
        pop();

        stroke(this.color);
        strokeWeight(this.size * 0.5);
        noFill();
        for (let i = 0; i < peopleNum; i++) {
            if (people[i].active === 1) {
                if (this.linkedPeoples[i] === 1) {
                    bezier(
                        this.pos.x, this.pos.y, this.pos.z,
                        this.pos.x * this.bezierOffset1.x, this.pos.y * this.bezierOffset1.y, this.pos.z * this.bezierOffset1.z,
                        people[i].pos.x * this.bezierOffset2.x, people[i].pos.y * this.bezierOffset2.y, people[i].pos.z * this.bezierOffset2.z,
                        people[i].pos.x, people[i].pos.y, people[i].pos.z
                    );
                }
            }
        }
    }
}
