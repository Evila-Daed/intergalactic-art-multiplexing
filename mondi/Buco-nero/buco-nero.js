const N = 100;
const vertexArray = [];
let dimMax = 0;

let padAudio;
let glitchAudio;

function preload() {
    padAudio = loadSound("audio/padAudio.mp3");
    glitchAudio = loadSound("audio/glitchAudio.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    smooth();
    angleMode(DEGREES);

    dimMax = min(width, height) * 0.25;

    for (let i = 0; i < N; i++) {
        vertexArray.push(new Vertice(i));
    }

    startAudioLoop();
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

        this.spawn();
    }
    spawn() {
        this.radius = dimMax;
        this.theta = random(360);
        this.speed = random(0.1,1);
        this.direction = random() < 0.5 ? -1 : 1;
        this.color = color(random(180), random(180), random(180));
        this.respawnChance = 0;//random(0.001, 0.1);
        this.attractionForce = random(0.1, 1);
        for (let i = 0; i < 4; i++) {
            this.curveFactor[i] = random(0.75,1.25);
        }
        this.linkIndex = floor(random(N - 1));
        if (this.linkIndex >= this.i) {
            this.linkIndex++;
        }
    }
    update() {
        if (random() < this.respawnChance) {
            this.spawn();
        }
        this.attraction();
        this.rotate();
        this.display();
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
        let tempSpeed = map(this.radius,0,dimMax,dimMax*0.01,dimMax*0.0001);
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
        this.size = map(this.radius,0,dimMax,dimMax*0.0001,dimMax*0.01); 
        // orbite
        noFill();
        strokeWeight(this.size*0.075);
        stroke(this.color);
        circle(0,0,this.radius*2);

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

function mousePressed() {
    userStartAudio();
}
function startAudioLoop() {
    padAudio.loop();
    padAudio.amp(0.2);
    glitchAudio.loop();
    glitchAudio.amp(0.2);
}
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        padAudio.pause();
        glitchAudio.pause();
    } else {
        padAudio.play();
        glitchAudio.play();
    }
});