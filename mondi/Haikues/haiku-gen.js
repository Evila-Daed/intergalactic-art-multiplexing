let poems = [];
const N = 50;
let fonts = [];

function preload() {
  fonts.push(loadFont("../../font/IBMPlexMono-Bold.ttf"));
  fonts.push(loadFont("../../font/IBMPlexMono-Medium.ttf"));
  fonts.push(loadFont("../../font/IBMPlexMono-Regular.ttf"));
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  frameRate(60);

  for (let i = 0; i < N; i++) {
    poems.push(new Poem());
  }

  background(0);
}

function draw() {
  orbitControl();

  rotateY(frameCount*1.21);

  translate(-width * 0.5, -height * 0.5, 0);
  background(0);

  for (let poem of poems) {
    poem.update();
    poem.display();
  }
}

class Poem {
  constructor() {
    this.generateParam();
  }
  generateParam() {
    this.x = width / 2 * random(0.9, 1.1);//random(width*0.1,width*0.9);
    this.y = random(height * 0.1, height * 0.9);
    this.z = random(-height*0.05, height*0.05);
    this.size = min(width, height) * 0.015 * random(0.01, 1);
    this.color = color(random(220), random(220), random(220));
    this.alpha = 0;
    this.state = "fadeIn";
    this.fadeSpeed = random(2.5, 10);
    this.xMax = width * random(0.2, 0.5);
    this.font = random(fonts);
    this.rotationX = random(-25);
    this.rotationY = random(-20, 20);

    this.generateSentence();
  }
  generateSentence() {
    let adjective = randomWord(words.adjectives);
    let noun = randomWord(words.nouns);
    let article = "A";

    if ("aeiouh".includes(adjective[0].toLowerCase())) {
      article = "An";
    }

    let par1 = `${article} ${adjective} ${noun}`;
    let par2 = `${randomWord(words.adverbs)} ${randomWord(words.verbs)}.`;
    let par3 = `I am the ${randomWord(words.nouns)}:`;

    let par4 =
      `${randomWord(words.adverbs)}, ` +
      `${randomWord(words.adverbs)}, ` +
      `${randomWord(words.adverbs)} ` +
      `${randomWord(words.verbs)}`;

    let par5 = `${randomWord(words.prepositions)} the ${randomWord(words.nouns)}`;
    let par6 = `thinking ${randomWord(words.subjectVerb)} ${randomWord(words.verbs)}.`;

    this.text = `${par1} ${par2} ${par3} ${par4} ${par5} ${par6}`;
  }
  update() {
    if (this.state == "fadeIn") {
      this.alpha += this.fadeSpeed;
      if (this.alpha >= 255) {
        this.alpha = 255;
        this.state = "fadeOut";
      }
    }
    if (this.state == "fadeOut") {
      this.alpha -= this.fadeSpeed;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.generateParam();
        this.state = "fadeIn";
      }
    }
  }
  display() {
    push();
    noStroke();
    fill(
      red(this.color),
      green(this.color),
      blue(this.color),
      this.alpha
    );
    textSize(this.size);
    textFont(this.font);
    translate(this.x, this.y, this.z);
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    text(this.text, 0, 0, this.xMax, height);
    pop();
  }
}

function randomWord(list) {
  return list[int(random(list.length))];
}