let suddivisioni = [];
let angleX = 0;
let angleY = 0;
let angleZ = 0;
let angle = 0;
let currentAxis = 0;
let cambioAsse = true;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    colorMode(HSB, 360, 100, 100);
    angleMode(DEGREES);
    frameRate(120);
    smooth();

    suddivisioni.push({
        x: 0,
        y: 0,
        z: 0,
        w: width / 2,
        h: height / 2,
        d: 5,
        hue: random(360),
        s: 0,
        b: 50,
        rot: 0,
        children: [],
        level: 0
    });
}

function draw() {
    push();

    rotateFigure();
    rotateX(angleX);
    rotateY(angleY);
    rotateZ(angleZ);

    scale(1.5);
    translate(-width / 4, -height / 4);

    background(0, 0, 10);

    render(suddivisioni[0]);

    if (random() < 0.5) {
        let disponibili = [];
        trovaDivisibili(suddivisioni[0], disponibili);
        if (disponibili.length > 0) {
            suddividi(random(disponibili));
        }
    }

    if (random() < 0.1) {
        let resettabili = [];
        trovaResettabili(suddivisioni[0], resettabili);
        if (resettabili.length > 0) {
            let s = random(resettabili);
            s.children = [];
            s.z = 0;
            s.d = 5;
            s.hue = random(360);
            s.s = 0;
            s.b = 50;
            s.rot = 0;
        }
    }
    pop();
}

function rotateFigure() {
    // canvas rotation
    let phase = angle % 360;
    let speed = map(abs(sin(phase)), 0, 1, 0.01, 5);
    angle += speed;

    if (currentAxis == 0) {
        angleX = angle;
    }
    if (currentAxis == 1) {
        angleY = angle;
    }
    if (currentAxis == 2) {
        angleZ = angle;
    }
    if (angle % 180 < speed && cambioAsse) {
        currentAxis = int(random(3));
        if (currentAxis == 0) {
            angle = angleX;
        }
        if (currentAxis == 1) {
            angle = angleY;
        }
        if (currentAxis == 2) {
            angle = angleZ;
        }
        cambioAsse = false;
    }
    if (abs(angle % 180) > 10) {
        cambioAsse = true;
    }
}

function trovaDivisibili(s, array) {
    if (s.children.length == 0) {
        if (s.w > 30 || s.h > 30) {
            array.push(s);
        }
    } else {
        for (let child of s.children) {
            trovaDivisibili(child, array);
        }
    }
}

function trovaResettabili(s, array) {
    array.push(s);
    for (let child of s.children) {
        trovaResettabili(child, array);
    }
}

function suddividi(s) {
    let vertical = random() < 0.5;
    let cut = random(0.25, 0.75);
    let x = s.x;
    let y = s.y;
    let z = s.z + random(-10, 10);
    let depth = lerp(s.d, random(10, 100), 0.35);
    let rot = s.rot;


    let s1 = constrain(s.s + random(5, 15), 0, 100);
    let s2 = constrain(s.s + random(5, 15), 0, 100);
    let hue1 = (s.hue + random(-20, 20) + 360) % 360;
    let hue2 = (s.hue + random(-20, 20) + 360) % 360;
    let b1 = constrain(s.b + random(-10, 10), 0, 100);
    let b2 = constrain(s.b + random(-10, 10), 0, 100);


    if (random() < 0) {
        x *= random(0.75, 1.25);
        y *= random(0.75, 1.25);
    }
    if (random() < 0) {
        rot = random(-2, 2) + s.rot;
    }

    if (vertical) {
        let w1 = s.w * cut;
        let w2 = s.w - w1;

        s.children = [
            {
                x: x,
                y: y,
                z: z,
                w: w1,
                h: s.h,
                d: depth,
                hue: hue1,
                s: s1,
                b: b1,
                rot: rot,
                children: [],
                level: s.level + 1
            },
            {
                x: x + w1,
                y: y,
                z: z,
                w: w2,
                h: s.h,
                d: depth,
                hue: hue2,
                s: s2,
                b: b2,
                rot: rot,
                children: [],
                level: s.level + 1
            }
        ];
    } else {
        let h1 = s.h * cut;
        let h2 = s.h - h1;
        s.children = [
            {
                x: x,
                y: y,
                z: z,
                w: s.w,
                h: h1,
                d: depth,
                hue: hue1,
                s: s1,
                b: b1,
                rot: rot,
                children: [],
                level: s.level + 1
            },
            {
                x: x,
                y: y + h1,
                z: z,
                w: s.w,
                h: h2,
                d: depth,
                hue: hue2,
                s: s2,
                b: b2,
                rot: rot,
                children: [],
                level: s.level + 1
            }
        ];
    }
}

function render(s) {
    if (s.children.length == 0) {
        fill(s.hue, s.s, s.b);
        noStroke();
        //stroke(0);
        //strokeWeight(map(s.level,0,10,3,0.2));
        push();
        translate(s.x + s.w / 2, s.y + s.h / 2, s.z);
        rotateZ(s.rot);
        box(s.w, s.h, s.d);
        pop();
    } else {
        for (let child of s.children) {
            render(child);
        }
    }
}