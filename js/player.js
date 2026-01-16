export class Player {
  constructor(x, y, radius, speed, color, nameText, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.color = color;
    this.nameText = nameText;
    this.dx = dx;
    this.dy = dy;
    this.shield = false;
    this.speedBoost = false;
    this.slowEffect = false;
    this.justAte = false;
    this.gameStart = false;
  }

  Draw(ctx) {
    ctx.save();

    if(this.shield) {
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = "25";
    }
    else if(this.justAte) {
      ctx.shadowColor = "#FFF000"
      ctx.shadowBlur = 8;
    }
    else if(this.gameStart) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 30;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius-0.5, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.fillStyle = "black";
    let fontSize = Math.min(12, this.radius * 0.8);
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.nameText, this.x, this.y);
    ctx.font = "10px Arial";
    ctx.fillText(Math.floor(this.radius), this.x, this.y - this.radius - 8);
    ctx.restore()
  }

  Update(canvas) {
    let speed = this.speed;
    if(this.speedBoost) speed *= 2;
    if(this.slowEffect) speed /= 2;

    this.x += this.dx * speed;
    this.y += this.dy * speed;

    if(this.x - this.radius < 0) this.x = this.radius;
    if(this.x + this.radius > canvas.width) this.x = canvas.width - this.radius;
    if(this.y - this.radius < 0) this.y = this.radius;
    if(this.y + this.radius > canvas.height) this.y = canvas.height - this.radius;
   }
}

export function spawnPlayer(circles, canvas, color, name) {
  let valid = false;
  let playerRadius = 10;
  let playerX, playerY;
  let playerSpeed = Math.max(0.7, 2 / (playerRadius / 10));

  while(!valid) {
    playerX = Math.floor(Math.random() * (canvas.width - 2 * playerRadius) + playerRadius);
    playerY = Math.floor(Math.random() * (canvas.height - 2 * playerRadius) + playerRadius);
    valid = true;
    for(let circle of circles) {
      const distance = Math.sqrt((circle.x - playerX)**2 + (circle.y - playerY)**2);
      if(distance <= circle.radius + playerRadius + 50){
        valid = false;
        break;
      }
    }
  }
  return new Player(playerX, playerY, playerRadius, playerSpeed, color, name, 1, 0);
}
