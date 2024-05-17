const BALL_AMOUNT = 25;

const par = document.querySelector("span");
let ballCount = 0;

// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
    constructor(x, y, velX, velY, exists) {
      super(x, y, velX, velY, exists);
      this.color = 'white';
      this.size = 10;
    }
  
    draw() {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  
    checkBounds() {
      if (this.x + this.size >= width) {
        this.x -= this.size;
      }
  
      if (this.x - this.size <= 0) {
        this.x += this.size;
      }
  
      if (this.y + this.size >= height) {
        this.y -= this.size;
      }
  
      if (this.y - this.size <= 0) {
        this.y += this.size;
      }
    }

    setControls() {
      var _this = this;
      window.onkeydown = function (e) {
        if (e.keyCode === 65) {
          _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
          _this.x += _this.velX;
        } else if (e.keyCode === 87) {
          _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
          _this.y += _this.velY;
        }
      };
    }
  
    collisionDetect() {
      for (const ball of balls) {
        if (!(ball.exists === false)) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < this.size + ball.size) {
            ball.exists = false;
            ballCount--;
            par.textContent = ballCount;
          }
        }
      }
    }
  }

const balls = [];

while (balls.length < BALL_AMOUNT) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomRGB(),
    size
  );
  ballCount++;
  par.textContent = ballCount;
  balls.push(ball);
}

const evilBall = new EvilCircle (
  random(0 + 10, width - 10),
  random(0 + 10, height - 10),
  20,
  20,
  true
);

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  evilBall.draw();
  evilBall.setControls();
  for (const ball of balls) {
    evilBall.checkBounds();
    evilBall.collisionDetect();
    if(ball.exists === true) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }
  requestAnimationFrame(loop);
}

loop();