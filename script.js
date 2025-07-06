
let isGameActive = false;
const gridDisplay = document.querySelector(".grid");
const scoreDisplay = document.getElementById("score");
const resultDisplay = document.getElementById("result");
const width = 4;
let squares = [];
let score = 0;

function createBoard() {
  gridDisplay.innerHTML = "";
  squares = [];
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.innerHTML = 0;
    gridDisplay.appendChild(square);
    squares.push(square);
  }
}

function generate() {
  const emptySquares = squares.filter(sq => sq.innerHTML == 0);
  if (emptySquares.length === 0) return;
  const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  randomSquare.innerHTML = 2;
  addColours();
}

function move(dir) {
  let moved = false;
  if (dir === "right" || dir === "left") {
    for (let i = 0; i < 16; i += 4) {
      let row = squares.slice(i, i + 4).map(sq => parseInt(sq.innerHTML));
      let filtered = row.filter(n => n !== 0);
      if (dir === "right") filtered = Array(4 - filtered.length).fill(0).concat(filtered);
      else filtered = filtered.concat(Array(4 - filtered.length).fill(0));
      for (let j = 0; j < 3; j++) {
        if (filtered[j] !== 0 && filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          score += filtered[j];
          filtered[j + 1] = 0;
        }
      }
      filtered = filtered.filter(n => n !== 0);
      if (dir === "right") filtered = Array(4 - filtered.length).fill(0).concat(filtered);
      else filtered = filtered.concat(Array(4 - filtered.length).fill(0));
      for (let j = 0; j < 4; j++) {
        if (squares[i + j].innerHTML != filtered[j]) moved = true;
        squares[i + j].innerHTML = filtered[j];
      }
    }
  } else {
    for (let i = 0; i < 4; i++) {
      let col = [0, 1, 2, 3].map(j => parseInt(squares[i + j * 4].innerHTML));
      let filtered = col.filter(n => n !== 0);
      if (dir === "down") filtered = Array(4 - filtered.length).fill(0).concat(filtered);
      else filtered = filtered.concat(Array(4 - filtered.length).fill(0));
      for (let j = 0; j < 3; j++) {
        if (filtered[j] !== 0 && filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          score += filtered[j];
          filtered[j + 1] = 0;
        }
      }
      filtered = filtered.filter(n => n !== 0);
      if (dir === "down") filtered = Array(4 - filtered.length).fill(0).concat(filtered);
      else filtered = filtered.concat(Array(4 - filtered.length).fill(0));
      for (let j = 0; j < 4; j++) {
        if (squares[i + j * 4].innerHTML != filtered[j]) moved = true;
        squares[i + j * 4].innerHTML = filtered[j];
      }
    }
  }
  if (moved) generate();
  scoreDisplay.innerHTML = score;
}

function control(e) {
  if (!isGameActive || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
}

function addColours() {
  squares.forEach(sq => {
    let val = parseInt(sq.innerHTML);
    const colors = {
      0: "#afa192", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#ffcea4", 32: "#e8c064",
      64: "#ffab6e", 128: "#fd9982", 256: "#ead79c", 512: "#76daff", 1024: "#beeaa5", 2048: "#d7d4f0"
    };
    sq.style.backgroundColor = colors[val] || "#ccc";
  });
}

function restartGame() {
  score = 0;
  scoreDisplay.innerHTML = "0";
  createBoard();
  generate();
  generate();
}

function startGame() {
  isGameActive = true;
  restartGame();
}

function editProfile() {
  document.getElementById("profileCard").style.display = "none";
  document.getElementById("editForm").style.display = "block";
  document.getElementById("nameInput").value = document.getElementById("profileName").innerText;
  document.getElementById("bioInput").value = document.getElementById("profileDescription").innerText;
}

function saveProfile() {
  document.getElementById("profileName").innerText = document.getElementById("nameInput").value;
  document.getElementById("profileDescription").innerText = document.getElementById("bioInput").value;
  const file = document.getElementById("imageInput").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("profileImage").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  document.getElementById("profileCard").style.display = "block";
  document.getElementById("editForm").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
  addColours();
  document.addEventListener("keydown", control);
});
