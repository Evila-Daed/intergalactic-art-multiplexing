let font;
let poems = [];
const poemNum = 101;

let textDim;

function preload() {
  font = loadFont("../../font/IBMPlexMono-Bold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  frameRate(60);

  textFont(font);
  textAlign(CENTER, CENTER);

  textDim = height * 0.05;

  for (let i = poemNum - 1; i >= 0; i--) {
    poems.push(new Poem(i));
  }

  background(20);
}

function draw() {
  background(20);

  for (let i = 0; i < poemNum; i++) {
    poems[i].update();
  }
}

class Poem {
  constructor(i) {
    this.i = i;
    this.pos = createVector(0, 0, 0);
    this.rot = createVector(0,0,0);
    this.spawn();
  }
  spawn() {
    this.adj1 = random(adjectives);
    this.adj2 = random(adjectives);
    this.noun1 = random(nouns);
    this.adv1 = random(adverbs);
    this.verb1 = random(verbs);
    this.adj3 = random(adjectives);

    this.bodyPart = random(bodyParts);
    this.scopeAdjective = random(scopeAdjectives);
    this.scopeNoun = random(scopeNouns);
    this.lastWord = random(lastWords);

    if (this.i != 0) {
      let posCoeff = textDim * 8;
      this.pos.set(random(-posCoeff, posCoeff), random(-posCoeff, posCoeff), -textDim * 4);
      this.color = color(random(20, 220), random(20, 220), random(20, 220), 150);
      this.size = textDim * pow(random(0.1, 1), 4);
      this.changeChance = random(0.0001, 0.01);
      this.respawnChance = random(0.0001, 0.01);
      let rotCoeff = 5;
      this.rot.set(random(-rotCoeff, rotCoeff),random(-rotCoeff, rotCoeff),0);
    } else {
      this.pos.set(0, 0, 0);
      this.color = color(220, 255);
      this.size = textDim;
      this.changeChance = 0.01;
      this.respawnChance = 0;
      this.rot.set(0,0,0);
    }
  }
  update() {
    if (random(1) < this.changeChance) {
      this.adj1 = random(adjectives);
    }
    if (random(1) < this.changeChance) {
      this.adj2 = random(adjectives);
    }
    if (random(1) < this.changeChance) {
      this.noun1 = random(nouns);
    }
    if (random(1) < this.changeChance) {
      this.adv1 = random(adverbs);
    }
    if (random(1) < this.changeChance) {
      this.verb1 = random(verbs);
    }
    if (random(1) < this.changeChance) {
      this.adj3 = random(adjectives);
    }
    if (random(1) < this.changeChance * 0.5) {
      this.bodyPart = random(bodyParts);
    }
    if (random(1) < this.changeChance * 0.5) {
      this.scopeAdjective = random(scopeAdjectives);
    }
    if (random(1) < this.changeChance * 0.5) {
      this.scopeNoun = random(scopeNouns);
    }
    if (random(1) < this.changeChance * 0.5) {
      this.lastWord = random(lastWords);
    }
    if (random() < this.respawnChance) {
      this.spawn();
    }

    this.display();
  }
  display() {
    let lineHeight = this.size * 1.1;
    let startY = -lineHeight * 4.5;

    push();
    translate(this.pos);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);

    fill(this.color);
    noStroke();
    textSize(this.size);

    text("when I opened my", 0, startY);
    text(this.adj1, 0, startY + lineHeight);
    text(this.bodyPart + ", the", 0, startY + lineHeight * 2);
    text(this.adj2 + " " + this.noun1, 0, startY + lineHeight * 3);
    text("was still there,", 0, startY + lineHeight * 4);
    text(this.adv1 + " " + this.verb1, 0, startY + lineHeight * 5);
    text("the " + this.scopeAdjective + " " + this.scopeNoun, 0, startY + lineHeight * 6);
    text("around my", 0, startY + lineHeight * 7);
    text(this.adj3, 0, startY + lineHeight * 8);
    text(this.lastWord, 0, startY + lineHeight * 9);

    pop();
  }
}