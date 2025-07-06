// Profile Info Save/Load
window.onload = () => {
  const savedName = localStorage.getItem("name");
  const savedDesc = localStorage.getItem("desc");
  const savedImg = localStorage.getItem("avatar");

  if (savedName || savedDesc || savedImg) {
    document.getElementById("displayName").textContent = savedName;
    document.getElementById("displayDesc").textContent = savedDesc;
    if (savedImg) {
      document.getElementById("avatar").src = savedImg;
    }
    document.getElementById("editMode").style.display = "none";
    document.getElementById("displayMode").style.display = "block";
  }
};

function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const desc = document.getElementById("descInput").value;
  const file = document.getElementById("imgInput").files[0];

  if (name) {
    document.getElementById("displayName").textContent = name;
    document.getElementById("displayDesc").textContent = desc || "No description.";
    document.getElementById("editMode").style.display = "none";
    document.getElementById("displayMode").style.display = "block";

    localStorage.setItem("name", name);
    localStorage.setItem("desc", desc);

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("avatar").src = e.target.result;
        localStorage.setItem("avatar", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}

function editProfile() {
  document.getElementById("editMode").style.display = "block";
  document.getElementById("displayMode").style.display = "none";
}

// Snake Game Variables
const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
let box = 20;
let snake = [];
let food;
let dx = box;
let dy = 0;
let game;

function startGame() {
  snake = [{ x: 200, y: 200 }];
  dx = box;
  dy = 0;
  placeFood();
  clearInterval(game);
  game = setInterval(draw, 150); // slower speed
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
    alert("Game over! Score: " + snake.length);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }
}

function collision(head, array) {
  return array.some(s => s.x === head.x && s.y === head.y);
}

document.addEventListener("keydown", e => {
  if (e.key === "w" && dy === 0) {
    dx = 0; dy = -box;
  } else if (e.key === "s" && dy === 0) {
    dx = 0; dy = box;
  } else if (e.key === "a" && dx === 0) {
    dx = -box; dy = 0;
  } else if (e.key === "d" && dx === 0) {
    dx = box; dy = 0;
  }
});

// Triangle Particle Background
const bgCanvas = document.getElementById("backgroundCanvas");
const bgCtx = bgCanvas.getContext("2d");
let triangles = [];

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.onresize = resizeCanvas;
resizeCanvas();

for (let i = 0; i < 40; i++) {
  triangles.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    size: Math.random() * 30 + 10,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function drawBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgCtx.fillStyle = "rgba(200, 220, 200, 0.3)";
  triangles.forEach(t => {
    bgCtx.beginPath();
    bgCtx.moveTo(t.x, t.y);
    bgCtx.lineTo(t.x + t.size, t.y);
    bgCtx.lineTo(t.x + t.size / 2, t.y - t.size);
    bgCtx.closePath();
    bgCtx.fill();
    t.x += t.dx;
    t.y += t.dy;

    if (t.x < 0 || t.x > bgCanvas.width) t.dx *= -1;
    if (t.y < 0 || t.y > bgCanvas.height) t.dy *= -1;
  });
  requestAnimationFrame(drawBackground);
}
drawBackground();
