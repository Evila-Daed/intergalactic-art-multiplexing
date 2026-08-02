const circlesNum = 10;
let dimMax;
let circles = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);
    smooth();
    frameRate(120);
    
    dimMax = max(width,height);

    for (var i = 0; i  < circlesNum; i++) {
        circles.push(new Cerchio(i));
    }
}

function draw() {
    background(180);

    for (var i = 0; i  < circlesNum; i++) {
        circles[i].update();
        circles[i].display();
    }
}

class Cerchio {
    constructor(i) {
        this.i = i;

        this.center = createVector(0,0,0);
        this.rot = createVector(random(360),random(360),random(360));
        this.pointCoord1 = createVector();
        this.pointCoord2 = createVector();

        this.spawn();
    }
    spawn() {
        // cerchio
        
        this.diameter = random(dimMax*0.1,dimMax*0.25);
        // punti
        this.pointTheta1 = 0;
        this.pointTheta2 = 180;
        this.pointSpeed1 = random(-1,1);
        this.pointSpeed2 = random(-1,1);
    }
    update() {
        // point rotation
        this.pointTheta1 += this.pointSpeed1;
        this.pointTheta2 += this.pointSpeed2;
        // constrain 0-360
        if (this.pointTheta1 <= 0) {
            this.pointTheta1 = 360;
        } else if (this.pointTheta1 >= 360) {
            this.pointTheta1 = 0;
        }
        if (this.pointTheta2 <= 0) {
            this.pointTheta2 = 360;
        } else if (this.pointTheta2 >= 360) {
            this.pointTheta2 = 0;
        }
        // calcola coordinate punti
        this.pointCoord1.x = (this.diameter*0.5)*cos(this.pointTheta1);
        this.pointCoord1.y = (this.diameter*0.5)*sin(this.pointTheta1);
        this.pointCoord2.x = (this.diameter*0.5)*cos(this.pointTheta2);
        this.pointCoord2.y = (this.diameter*0.5)*sin(this.pointTheta2);

        // se i punti si toccano
        if (abs(this.pointTheta1 - this.pointTheta2) < 10) {
            this.center.x = this.pointCoord1.x;
            this.center.y = this.pointCoord1.y;
            this.center.z = this.pointCoord1.z;
            this.spawn();
        }
    }
    display() {
        push();

        translate(this.center);
        rotateX(this.rot.x);
        rotateY(this.rot.y);
        rotateZ(this.rot.z);

        noFill();
        strokeWeight(this.diameter*0.005);
        stroke(0);
        circle(0,0,this.diameter);

        push();
        noStroke();
        fill(0);
        translate(this.pointCoord1.x,this.pointCoord1.y,0);
        sphere(this.diameter*0.025);
        pop();

        push();
        noStroke();
        fill(0);
        translate(this.pointCoord2.x,this.pointCoord2.y,0);
        sphere(this.diameter*0.025);
        pop();
        
        pop();
    }
}