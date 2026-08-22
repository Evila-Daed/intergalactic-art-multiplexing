const N = 100;
const vertexArray = [];
let dimMax = 0;
let audioEnabled = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    smooth();
    angleMode(DEGREES);

    dimMax = min(width, height) * 0.25;

    for (let i = 0; i < N; i++) {
        vertexArray.push(new Vertice(i));
    }
}

function draw() {
    translate(width * 0.5, height * 0.5);

    background(20);

    for (let i = 0; i < N; i++) {
        vertexArray[i].update();
    }
}

class Vertice {
    constructor(i) {
        this.i = i;
        this.pos = createVector(0, 0);
        this.curveFactor = [];

        // AUDIO
        this.waveTypes = ["sine", "triangle", "square"];
        this.waveType = random(this.waveTypes);
        this.osc = new p5.Oscillator(this.waveType);
        this.osc.start();
        this.osc.amp(0);

        this.spawn();
    }
    spawn() {
        this.radius = dimMax;
        this.theta = random(360);
        this.speed = random(0.1, 1);
        this.direction = random() < 0.5 ? -1 : 1;
        this.color = color(random(180), random(180), random(180));
        this.attractionForce = random(0.1, 1);
        for (let i = 0; i < 4; i++) {
            this.curveFactor[i] = random(0.75, 1.25);
        }
        this.linkIndex = floor(random(N - 1));
        if (this.linkIndex >= this.i) {
            this.linkIndex++;
        }
        // AUDIO
        this.freqStart = random(50, 250);
        this.freqEnd = random(1000, 3500);
    }
    update() {
        this.attraction();
        this.rotate();
        this.display();

        if (audioEnabled) {
            let freq = map(this.radius, dimMax, 0, this.freqStart, this.freqEnd);
            let amp = map(this.radius, dimMax, 0, 0.01, 0.0001);
            this.osc.amp(amp, 0.05);
            this.osc.freq(freq, 0.05);
        } else {
            this.osc.amp(0, 0.05);
        }
    }
    attraction() {
        let force = map(this.radius, 0, dimMax, 1, 0.1);
        force *= this.attractionForce;
        this.radius -= force;
        if (this.radius < 0) {
            this.spawn();
        }
    }
    rotate() {
        let tempSpeed = map(this.radius, 0, dimMax, dimMax * 0.01, dimMax * 0.0001);
        tempSpeed *= this.speed;
        tempSpeed *= this.direction;
        this.theta += tempSpeed;

        if (this.theta > 360) {
            this.theta = 0;
        } else if (this.theta < 0) {
            this.theta = 360;
        }

        let x = cos(this.theta) * this.radius;
        let y = sin(this.theta) * this.radius;
        this.pos.set(x, y);
    }
    display() {
        this.size = map(this.radius, 0, dimMax, dimMax * 0.0001, dimMax * 0.01);
        // orbite
        noFill();
        strokeWeight(this.size * 0.075);
        stroke(this.color);
        circle(0, 0, this.radius * 2);

        // link
        let link = vertexArray[this.linkIndex];
        let linkX = link.pos.x;
        let linkY = link.pos.y;
        let linkRadius = link.radius;
        noFill();
        strokeWeight(this.size);
        stroke(this.color);
        let radiusDifference = abs(this.radius - linkRadius);
        let curve = map(radiusDifference, 0, dimMax, 1.5, 1);
        let cx1 = this.pos.x * this.curveFactor[0] * curve;
        let cy1 = this.pos.y * this.curveFactor[1] * curve;
        let cx2 = linkX * this.curveFactor[2] * curve;
        let cy2 = linkY * this.curveFactor[3] * curve;
        bezier(this.pos.x, this.pos.y, cx1, cy1, cx2, cy2, linkX, linkY);
        fill(this.color);
        noStroke();
        circle(this.pos.x, this.pos.y, this.size);
    }
}
document.addEventListener("visibilitychange", () => {
    audioEnabled = !document.hidden;
});