// Profile Switching Logic
function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const desc = document.getElementById("descInput").value;
  const file = document.getElementById("imgInput").files[0];

  if (name) {
    document.getElementById("displayName").textContent = name;
    document.getElementById("displayDesc").textContent = desc || "No description.";
    document.getElementById("editMode").style.display = "none";
    document.getElementById("displayMode").style.display = "block";

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("avatar").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

function editProfile() {
  document.getElementById("editMode").style.display = "block";
  document.getElementById("displayMode").style.display = "none";
}

// Snake Game
const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
let box = 20;
let snake = [];
let food;
let dx = box;
let dy = 0;
let score = 0;
let game;

function startGame() {
  snake = [{ x: 200, y: 200 }];
  dx = box;
  dy = 0;
  score = 0;
  placeFood();
  clearInterval(game);
  game = setInterval(draw, 100);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  ctx.fillStyle = "#e8fbe4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let s of snake) {
    ctx.fillStyle = "#519872";
    ctx.fillRect(s.x, s.y, box, box);
  }

  ctx.fillStyle = "#32CD32";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head, snake)) {
    clearInterval(game);
    alert("Game over! Final score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
  } else {
    snake.pop();
  }
}

function collision(head, array) {
  return array.some(s => s.x === head.x && s.y === head.y);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -box;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = box;
  } else if (e.key === "ArrowLeft" && dx === 0) {
    dx = -box; dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = box; dy = 0;
  }
});
