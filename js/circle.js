import { randomColor } from "./helper.js";

export class Circle {
  constructor(x, y, radius, speed, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.type = "ordinary";
  }

  Draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI)
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.fillStyle = "black";
    let fontSize = Math.min(12, Math.floor(this.radius * 0.6));
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.radius, this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
  }

  Update(canvas) {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if(this.x - this.radius < 0) {
      this.x = this.radius;
      this.dx *= -1;
    }
    if(this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.dx *= -1;
    }
    if(this.y - this.radius < 0) {
      this.y = this.radius;
      this.dy *= -1;
    }
    if(this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.dy *= -1;
    }
  }
}

export class SpecialCircle extends Circle {
  constructor(x, y, radius, speed, dx, dy) {
    super(x, y, radius, speed, "#FFD700", dx, dy);
    this.type = "special";
  }
  Draw(ctx) {
    ctx.save();
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", this.x, this.y);
    ctx.restore();
  }
}

export function randomCircle(canvas) {
  let circleRadius;
  let randNum = Math.random();
  if(randNum < 0.7) 
    circleRadius = Math.floor(Math.random() * 15 + 5);
  else 
    circleRadius = Math.floor(Math.random() * 60 + 20);

  let circleX = Math.floor(Math.random() * (canvas.width - 2 * circleRadius) + circleRadius);
  let circleY = Math.floor(Math.random() * (canvas.height - 2 * circleRadius) + circleRadius);
  let circleSpeed = Math.max(0.5, 1.5 / (circleRadius / 10));
  let circleColor = randomColor();
  let angle = Math.random() * 2 * Math.PI;
  let circleDx = Math.cos(angle);
  let circleDy = Math.sin(angle);

  return new Circle(circleX, circleY, circleRadius, circleSpeed, circleColor, circleDx, circleDy);
}

export function newRandomCircle(canvas, player) {
  let circle = randomCircle(canvas);
  let valid = false;
  while(!valid) {
    circle.x = Math.floor(Math.random() * (canvas.width - 2 * circle.radius) + circle.radius);
    circle.y = Math.floor(Math.random() * (canvas.height - 2 * circle.radius) + circle.radius);
    valid = true;
    const distance = Math.sqrt((circle.x - player.x)**2 + (circle.y - player.y)**2);
    if(distance <= circle.radius + player.radius + 5)
      valid = false;
  }
  return circle;
}

export function specialCircle(canvas, player) {
  const specialRadius = 15;
  let valid = false;
  let specialX;
  let specialY;
  while(!valid) {
    specialX = Math.floor(Math.random() * (canvas.width - 2 * specialRadius) + specialRadius);
    specialY = Math.floor(Math.random() * (canvas.height - 2 * specialRadius) + specialRadius);
    valid = true;
    const distance = Math.sqrt((specialX - player.x)**2 + (specialY - player.y)**2);
    if(distance <= specialRadius + player.radius + 5)
      valid = false;
  }
  const specialSpeed = 1;
  const angle = Math.random() * 2 * Math.PI;
  const specialDx = Math.cos(angle);
  const specialDy = Math.sin(angle);

  return new SpecialCircle(specialX, specialY, specialRadius, specialSpeed, specialDx, specialDy);
}

export function biggerCircle (canvas, player) {
  const radius = Math.floor(player.radius + 5);
  let valid = false;
  let x;
  let y;
  while(!valid) {
    x = Math.floor(Math.random() * (canvas.width - 2 * radius) + radius);
    y = Math.floor(Math.random() * (canvas.width - 2 * radius) + radius);
    valid = true;
    const distance = Math.sqrt((x - player.x)**2 + (y - player.y)**2);
    if(distance <= radius + player.radius +5)
      valid = false;
  }
  const speed = 1.1;
  const angle = Math.random() * 2 * Math.PI;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const color = randomColor();

  return new Circle(x, y, radius, speed, color, dx, dy);
}
