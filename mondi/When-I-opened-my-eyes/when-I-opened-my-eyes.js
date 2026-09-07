let font;
let poems = [];

let textDim;
let cam;

let angleY = 0;
let freqY = 10;
let targetY = 0;
let nextFace = 0;

function preload() {
  font = loadFont("../../font/IBMPlexMono-Bold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, 0, height * 2);
  cam.lookAt(0, 0, 0);
  angleMode(DEGREES);
  frameRate(60);

  textFont(font);
  textAlign(CENTER, CENTER);

  textDim = height * 0.04;

  for (let i = 0; i < 4; i++) {
    poems.push(new Poem(i));
  }
}

function draw() {
  background(20);

  orbitControl();

  let speedY = 0.1;

  if (abs(angleY - targetY) < 0.01) {
    nextFace = floor(random(4));
    targetY = nextFace * 90;
  }

  angleY = lerp(angleY, targetY, speedY);

  rotateY(angleY);

  let s = height * 0.7;

  // cubo
  fill(180);
  stroke(255);
  box(s);

  // faccia frontale
  push();
  translate(0, 0, s / 2 + 1);
  poems[0].update();
  pop();

  // faccia destra
  push();
  rotateY(90);
  translate(0, 0, s / 2 + 1);
  poems[1].update();
  pop();

  // faccia posteriore
  push();
  rotateY(180);
  translate(0, 0, s / 2 + 1);
  poems[2].update();
  pop();

  // faccia sinistra
  push();
  rotateY(-90);
  translate(0, 0, s / 2 + 1);
  poems[3].update();
  pop();
}


class Poem {
  constructor(i) {
    this.i = i;
    this.elements = [
      new Element(random(adjectives)),
      new Element(random(adjectives)),
      new Element(random(nouns)),
      new Element(random(adverbs)),
      new Element(random(verbs)),
      new Element(random(adjectives))
    ];

    this.middleWord = ["eyes", "mouth", "ears", "ass"][i];
    this.scopeAdjective = ["endless", "infinite", "boundless"][i % 3];
    this.scopeNoun = ["spacetimes", "dimensions", "realities", "explosions"][i];
    this.lastWord = ["beings", "essence", "substance", "matter"][i];

    this.resetChance = 0.01;
  }
  update() {
    for (let i = 0; i < this.elements.length; i++) {
      if (i === 0) {
        if (random() < this.resetChance) {
          this.elements[i] = new Element(random(adjectives));
        }
      } else if (i === 1) {
        if (random() < this.resetChance) {
          this.elements[i] = new Element(random(adjectives));
        }
      } else if (i === 2) {
        if (random() < this.resetChance) {
          this.elements[i] = new Element(random(nouns));
        }
      } else if (i === 3) {
        if (random() < this.resetChance) {
          this.elements[i] = new Element(random(adverbs));
        }
      } else if (i === 4) {
        if (random() < this.resetChance) {
          this.elements[i] = new Element(random(verbs));
        }
      } else if (i === 5) {
        if (random() < this.resetChance) {
          this.elements[i] = new Element(random(adjectives));
        }
      }
    }

    this.display();
  }
  display() {
    let lineHeight = textDim * 1.25;
    let startY = -lineHeight * 4.5;

    fill(20);
    noStroke();
    textSize(textDim);

    text("When I opened my", 0, startY);
    this.elements[0].display(0, startY + lineHeight);
    text(this.middleWord + ", the", 0, startY + lineHeight * 2);
    this.displayPair(this.elements[1], this.elements[2], startY + lineHeight * 3);
    text("was still there,", 0, startY + lineHeight * 4);
    this.displayPair(this.elements[3], this.elements[4], startY + lineHeight * 5);
    text("the " + this.scopeAdjective + " " + this.scopeNoun, 0, startY + lineHeight * 6);
    text("around my", 0, startY + lineHeight * 7);
    this.elements[5].display(0, startY + lineHeight * 8);
    text(this.lastWord + ".", 0, startY + lineHeight * 9);
  }
  displayPair(a, b, y) {
    textSize(textDim);
    let gap = textDim * 0.5;
    let w1 = textWidth(a.word);
    let w2 = textWidth(b.word);
    let total = w1 + gap + w2;
    a.display(-total / 2 + w1 / 2, y);
    b.display(total / 2 - w2 / 2, y);
  }
}

class Element {
  constructor(word) {
    this.word = word;
  }
  display(x, y) {
    fill(20);
    textSize(textDim);
    text(this.word, x, y);
  }
}