
let gameStarted = false;
let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let resultDisplay = document.getElementById("result");
const width = 4;
let squares = [];
let score = 0;

function startGame() {
  if (grid.children.length > 0) return;
  gameStarted = true;
  score = 0;
  scoreDisplay.textContent = score;
  grid.innerHTML = '';
  squares = [];
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.textContent = '0';
    grid.appendChild(square);
    squares.push(square);
  }
  generate();
  generate();
}

function generate() {
  let emptySquares = squares.filter(s => s.textContent == '0');
  if (emptySquares.length === 0) return;
  let rand = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  rand.textContent = '2';
  colorTiles();
}

function colorTiles() {
  for (let i = 0; i < squares.length; i++) {
    let val = parseInt(squares[i].textContent);
    squares[i].style.backgroundColor = {
      0: "#cdc1b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179",
      16: "#ffcea4", 32: "#e8c064", 64: "#ffab6e", 128: "#fd9982",
      256: "#ead79c", 512: "#76daff", 1024: "#beeaa5", 2048: "#d7d4f0"
    }[val] || "#ccc";
  }
}

function moveRow(row, reverse=false) {
  let nums = row.map(i => parseInt(squares[i].textContent)).filter(n => n !== 0);
  if (reverse) nums.reverse();
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i+1]) {
      nums[i] *= 2;
      score += nums[i];
      nums[i+1] = 0;
    }
  }
  nums = nums.filter(n => n !== 0);
  while (nums.length < width) nums.push(0);
  if (reverse) nums.reverse();
  for (let i = 0; i < width; i++) squares[row[i]].textContent = nums[i];
}

function move(dir) {
  if (!gameStarted || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

  for (let r = 0; r < width; r++) {
    let row = [];
    for (let c = 0; c < width; c++) {
      let idx = dir === 'left' || dir === 'right' ? r * width + c : c * width + r;
      row.push(idx);
    }
    if (dir === 'right' || dir === 'down') row.reverse();
    moveRow(row, dir === 'right' || dir === 'down');
  }
  scoreDisplay.textContent = score;
  generate();
}

document.addEventListener("keydown", e => {
  if (!gameStarted) return;
  let key = e.key.toLowerCase();
  if ("wasd".includes(key)) e.preventDefault();
  if (key === "a" || e.key === "ArrowLeft") move("left");
  if (key === "d" || e.key === "ArrowRight") move("right");
  if (key === "w" || e.key === "ArrowUp") move("up");
  if (key === "s" || e.key === "ArrowDown") move("down");
  colorTiles();
});

// Profile logic
function toggleEdit(edit) {
  document.getElementById("profileEdit").style.display = edit ? "block" : "none";
  document.getElementById("profileView").style.display = edit ? "none" : "block";
}

function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const bio = document.getElementById("bioInput").value;
  const file = document.getElementById("imageInput").files[0];
  localStorage.setItem("name", name);
  localStorage.setItem("bio", bio);
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("image", reader.result);
      loadProfile();
    };
    reader.readAsDataURL(file);
  } else {
    loadProfile();
  }
  toggleEdit(false);
}

function loadProfile() {
  document.getElementById("displayName").textContent = localStorage.getItem("name") || "Your Name";
  document.getElementById("displayBio").textContent = localStorage.getItem("bio") || "Your short bio goes here.";
  document.getElementById("profileImage").src = localStorage.getItem("image") || "";
}
loadProfile();
