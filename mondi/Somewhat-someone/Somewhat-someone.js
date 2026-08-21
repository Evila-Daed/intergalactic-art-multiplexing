const pointSpeedMinMax = [0.01, 5];
var restartChance = 0.0025;
var bornChance = 0.01;
const viteNum = 10;
var vite = [];

var mainCanvas;
var tempCanvas;

var fonts = [];

const bgColor = 180;

function preload() {
    fonts.push(loadFont("../../font/IBMPlexMono-Bold.ttf"));
    fonts.push(loadFont("../../font/IBMPlexMono-Light.ttf"));
    fonts.push(loadFont("../../font/IBMPlexMono-Medium.ttf"));
    fonts.push(loadFont("../../font/IBMPlexMono-Regular.ttf"));
}

function setup() {
    mainCanvas = createCanvas(windowWidth, windowHeight);
    tempCanvas = createGraphics(windowWidth, windowHeight);
    mainCanvas.position(0, 0);
    mainCanvas.style("z-index", "-1");
    frameRate(30);
    smooth();
    
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);

    for (let i = 0; i < viteNum; i++) {
        vite.push(new Vita(i));
    }

    background(bgColor);
    tempCanvas.background(bgColor);
}

function draw() {
    tempCanvas.background(bgColor, 0.1);

    for (var i = 0; i < viteNum; i++) {
        if (vite[i].aliveState === 1) {
            vite[i].move();
            vite[i].checkForContact();

            if (vite[i].continueState === 1) {
                vite[i].continueCircles();
            }

        } else {
            if (random() < bornChance) {
                vite[i].startFromCenter();
            }
        }
    }

    image(tempCanvas, 0, 0);

    for (var i = 0; i < viteNum; i++) {
        if (vite[i].aliveState === 1) {
            vite[i].dynamicDisplay();
        }
    }
}

class Vita {
    constructor(i) {
        this.i = i;

        this.pos1 = createVector();
        this.pos2 = createVector();

        this.aliveState = 0;
    }
    startFromCenter() {
        this.vitaColor = color(random(100), random(100), random(100));

        this.count = 1;

        this.circleCenter = createVector(width/2,height/2); // cerchio al centro
        this.prevCenterCoord = this.circleCenter;
        let maxDim = max(width, height);
        this.circleRadius = random(maxDim * 0.05, maxDim * 0.35); // rnd radius
        this.pointSize = this.circleRadius * 0.025;

        this.randomParam();

        this.pos1.x = this.circleRadius * 0.5 * cos(this.t1) + this.circleCenter.x;
        this.pos1.y = this.circleRadius * 0.5 * sin(this.t1) + this.circleCenter.y;
        this.pos2.x = this.circleRadius * 0.5 * cos(this.t2) + this.circleCenter.x;
        this.pos2.y = this.circleRadius * 0.5 * sin(this.t2) + this.circleCenter.y;
    }
    continueCircles() {
        this.count++;

        this.prevCenterCoord = createVector(this.circleCenter.x, this.circleCenter.y); // reset prev
        this.circleCenter.x = (this.pos1.x + this.pos2.x) / 2;
        this.circleCenter.y = (this.pos1.y + this.pos2.y) / 2;
        let maxDim = max(width, height);
        this.circleRadius *= pow((1 / this.count), 0.5);
        this.pointSize = this.circleRadius * 0.025;

        this.randomParam();

        this.pos1.x = this.circleRadius * 0.5 * cos(this.t1) + this.circleCenter.x;
        this.pos1.y = this.circleRadius * 0.5 * sin(this.t1) + this.circleCenter.y;
        this.pos2.x = this.circleRadius * 0.5 * cos(this.t2) + this.circleCenter.x;
        this.pos2.y = this.circleRadius * 0.5 * sin(this.t2) + this.circleCenter.y;

        this.staticDisplay();
    }
    randomParam() {
        this.t1 = random(1, 361);
        this.t2 = (this.t1 + 180) % 360;
        this.t1speed = random(pointSpeedMinMax[0], pointSpeedMinMax[1]); // rnd speed1
        this.t2speed = random(pointSpeedMinMax[0], pointSpeedMinMax[1]); // rnd speed2

        let rndCurveMinMax = createVector(0.8, 1.2);
        this.curveFactor = {
            a: random(rndCurveMinMax.x, rndCurveMinMax.y),
            b: random(rndCurveMinMax.x, rndCurveMinMax.y),
            c: random(rndCurveMinMax.x, rndCurveMinMax.y),
            d: random(rndCurveMinMax.x, rndCurveMinMax.y),
        };

        this.rndAction = azioni[int(random(azioni.length))];
        this.font = random(fonts);

        this.continueState = 0;
        this.aliveState = 1;
    }
    checkForContact() {
        // quando i punti si toccano resetta
        if (dist(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y) < this.pointSize * 1.5) {
            if (random() < restartChance) {
                this.aliveState = 0;
            } else {
                this.continueState = 1;
            }
        }
    }
    move() {
        this.pos1.x = this.circleRadius * 0.5 * cos(this.t1) + this.circleCenter.x;
        this.pos1.y = this.circleRadius * 0.5 * sin(this.t1) + this.circleCenter.y;
        this.pos2.x = this.circleRadius * 0.5 * cos(this.t2) + this.circleCenter.x;
        this.pos2.y = this.circleRadius * 0.5 * sin(this.t2) + this.circleCenter.y;

        this.t1 += this.t1speed;
        this.t2 += this.t2speed;

        if (this.t1 > 360) {
            this.t1 = 1;
        }
        if (this.t2 > 360) {
            this.t2 = 1;
        }
    }
    staticDisplay() {
        // linee che uniscono i raggi
        tempCanvas.strokeWeight(this.pointSize * 0.1);
        tempCanvas.stroke(this.vitaColor);
        //tempCanvas.line(this.circleCenter.x, this.circleCenter.y,this.prevCenterCoord.x, this.prevCenterCoord.y);
        tempCanvas.noFill();
        tempCanvas.bezier(
            this.circleCenter.x, this.circleCenter.y,
            this.circleCenter.x * this.curveFactor.a, this.circleCenter.y * this.curveFactor.b,
            this.circleCenter.x * this.curveFactor.c, this.circleCenter.y * this.curveFactor.d,
            this.prevCenterCoord.x, this.prevCenterCoord.y
        );

        // testo
        tempCanvas.textAlign(CENTER, CENTER);
        tempCanvas.fill(this.vitaColor);
        tempCanvas.noStroke();
        tempCanvas.textFont(this.font);
        tempCanvas.textSize(this.circleRadius * 0.1);
        tempCanvas.text(this.rndAction, this.circleCenter.x, this.circleCenter.y);
    }
    dynamicDisplay() {
        // circonferenza
        stroke(this.vitaColor);
        noFill();
        strokeWeight(this.pointSize * 0.2);
        circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);

        // linee centro punti
        strokeWeight(this.pointSize * 0.2);
        noFill();
        line(this.circleCenter.x, this.circleCenter.y, this.pos1.x, this.pos1.y);
        line(this.circleCenter.x, this.circleCenter.y, this.pos2.x, this.pos2.y);

        // punti
        fill(this.vitaColor);
        noStroke();
        let circlesDim = this.pointSize*0.5;
        circle(this.pos1.x, this.pos1.y, circlesDim);
        circle(this.pos2.x, this.pos2.y, circlesDim);

    }
}