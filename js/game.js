import { randomCircle, newRandomCircle, specialCircle, biggerCircle } from "./circle.js";
import { spawnPlayer } from "./player.js";
import { handleCircleCollisions, checkPlayerCollisions, formatTime } from "./helper.js";

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");
const endScreen = document.getElementById("endScreen");
const restartBtn = document.getElementById("restartBtn");
const backToBtn = document.getElementById("backToStart");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const pauseBtn = document.getElementById("pauseBtn");
const pauseScreen = document.getElementById("pauseScreen");
const continueBtn = document.getElementById("continueBtn");
const finalScore = document.getElementById("finalScore");
const finalTimer = document.getElementById("finalTimer");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreSpan = document.getElementById("score");
const timerSpan = document.getElementById("timer");
const colorSelect = document.getElementById("playerColor");
const nameInput = document.getElementById("playerName");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circles = [];
for(let i = 0; i<30; i++) {
  let circle = randomCircle(canvas);
  circles.push(circle);
}

let player = spawnPlayer(circles, canvas, colorSelect.value);

window.addEventListener("keydown", (k) => {
  if(gameOver || paused) return;
  if(k.key === "w" || k.key === "ArrowUp") {
    player.dx = 0;
    player.dy = -1;
  }
  if(k.key === "s" || k.key === "ArrowDown") {
    player.dx = 0;
    player.dy = 1;
  }
  if(k.key === "a" || k.key === "ArrowLeft") {
    player.dx = -1;
    player.dy = 0;
  }
  if(k.key === "d" || k.key === "ArrowRight") {
    player.dx = 1;
    player.dy = 0;
  }
});

let gameOver = false;
let score = 0;
let startTime = null;
let timer = 0;
let timerInterval = null;
let animationId = null;
let paused = false;
let biggerCircleInterval = null;

function gameLoop() {
  if(paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleCircleCollisions(circles);

  const collision = checkPlayerCollisions(player, circles);
  if(collision != null) {
    let circle = circles[collision];
    if(circle.type === "special"){
      player.justAte = true;
      setTimeout(() => {player.justAte = false; }, 500);
      const effect = Math.random();
      if(effect <= 0.3) {
        player.shield = true;
        setTimeout(() => player.shield = false, 7000);
      }else if(effect <= 0.6) {
        player.speedBoost = true;
        setTimeout(() => player.speedBoost = false, 7000);
      }else {
        player.slowEffect = true;
        setTimeout(() => player.slowEffect = false, 7000);
      }
      circles.splice(collision, 1);
    } else {
    if(Math.floor(player.radius) > Math.floor(circle.radius)) {
      player.justAte = true;
      setTimeout(() => {player.justAte = false}, 500);
      player.radius += Math.max(0.5, circle.radius * 0.05);
      score += circle.radius;
      scoreSpan.textContent = score;
      circles.splice(collision, 1);
      if(Math.random() < 0.15){
        let circle = specialCircle(canvas, player);
        circles.push(circle);
        setTimeout(() => {
          const index = circles.indexOf(circle);
          if(index !== -1)
            circles.splice(index, 1);
            circles.push(newRandomCircle(canvas, player));
        }, 7000);
      } else
        circles.push(newRandomCircle(canvas, player));
    } else if(Math.floor(player.radius) < Math.floor(circle.radius)) {
      if(!player.shield) {
        gameOver = true;
        finalScore.textContent = "Score:  " + score;
        finalTimer.textContent = "Timer:  " + formatTime(timer);
        clearInterval(timerInterval);
        clearInterval(biggerCircleInterval);
        endScreen.style.display = "flex";
        pauseBtn.disabled = true;
      }
    }
  }
  }

  for(let circle of circles) {
    circle.Update(canvas);
    circle.Draw(ctx);
  }

  if(!gameOver) {
    player.Update(canvas);
    player.Draw(ctx);
    animationId = requestAnimationFrame(gameLoop);
  }
}

function updateTimer() {
  timer = Math.floor((Date.now() - startTime)/1000);
  timerSpan.textContent = formatTime(timer);
}

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  pauseBtn.disabled = false;

  circles = [];
  for(let i = 0; i<30; i++) {
    let circle = randomCircle(canvas);
    circles.push(circle);
  }
  player = spawnPlayer(circles, canvas, colorSelect.value, nameInput.value);

  player.gameStart = true;
  setTimeout(() => {player.gameStart = false;}, 2000);

  cancelAnimationFrame(animationId);
  gameOver = false;
  gameLoop();

  biggerCircleInterval = setInterval(() => {
    const bigCircle = biggerCircle(canvas, player);
    circles.push(bigCircle); 
  }, 20000);
});


function restartGame() {
  endScreen.style.display = "none";
  gameScreen.style.display = "block";
  cancelAnimationFrame(animationId);
  clearInterval(timerInterval);
  clearInterval(biggerCircleInterval);

  gameOver = false;
  score = 0;
  scoreSpan.textContent = score;

  timer = 0;
  timerSpan.textContent = "00:00";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  pauseBtn.disabled = false;

  circles = [];
  for(let i = 0; i<30; i++) {
    let circle = randomCircle(canvas);
    circles.push(circle);
  }
  player = spawnPlayer(circles, canvas, colorSelect.value, nameInput.value);

  player.gameStart = true;
  setTimeout(() => {player.gameStart = false;}, 2000);

  gameLoop();

  biggerCircleInterval = setInterval(() => {
    const bigCircle = biggerCircle(canvas, player);
    circles.push(bigCircle); 
  }, 20000);
}
restartBtn.addEventListener("click", restartGame);

backToBtn.addEventListener("click", () => {
  endScreen.style.display = "none";
  gameScreen.style.display = "none";
  startScreen.style.display = "flex";

  gameOver = false;
  score = 0;
  scoreSpan.textContent = score;
  timer = 0;
  timerSpan.textContent = "0 s";
  clearInterval(biggerCircleInterval);
  clearInterval(timerInterval);
  cancelAnimationFrame(animationId);
});

document.documentElement.setAttribute("theme", "dark");
themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("theme");

  if(currentTheme === "dark") {
    document.documentElement.setAttribute("theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }
  else{
    document.documentElement.setAttribute("theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }
});

pauseBtn.addEventListener("click", () => {
  pauseScreen.style.display = "flex";
  paused = true;
  cancelAnimationFrame(animationId);
  clearInterval(timerInterval);
  clearInterval(biggerCircleInterval);
});

continueBtn.addEventListener("click", () => {
  pauseScreen.style.display = "none";
  paused = false;
  startTime = Date.now() - timer * 1000;
  timerInterval = setInterval(updateTimer, 1000);
  gameLoop();

  biggerCircleInterval = setInterval(() => {
    const bigCircle = biggerCircle(canvas, player);
    circles.push(bigCircle); 
  }, 20000);
});
