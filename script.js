// ---------------------- PROFILE SECTION ----------------------
window.onload = () => {
  const name = localStorage.getItem("name");
  const desc = localStorage.getItem("desc");
  const avatar = localStorage.getItem("avatar");

  if (name || desc || avatar) {
    document.getElementById("displayName").textContent = name;
    document.getElementById("displayDesc").textContent = desc;
    if (avatar) document.getElementById("avatar").src = avatar;
    document.getElementById("editMode").style.display = "none";
    document.getElementById("displayMode").style.display = "block";
  }

  initGame();
};

function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const desc = document.getElementById("descInput").value;
  const file = document.getElementById("imgInput").files[0];

  document.getElementById("displayName").textContent = name;
  document.getElementById("displayDesc").textContent = desc;

  localStorage.setItem("name", name);
  localStorage.setItem("desc", desc);

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const avatar = e.target.result;
      document.getElementById("avatar").src = avatar;
      localStorage.setItem("avatar", avatar);
    };
    reader.readAsDataURL(file);
  }

  document.getElementById("editMode").style.display = "none";
  document.getElementById("displayMode").style.display = "block";
}

function editProfile() {
  document.getElementById("editMode").style.display = "block";
  document.getElementById("displayMode").style.display = "none";
}

// ---------------------- 2048 GAME SECTION ----------------------
const boardSize = 4;
let board = [];
let score = 0;

function initGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  addTile();
  addTile();
  drawBoard();
  score = 0;
  document.getElementById("score").textContent = score;
}

function drawBoard() {
  const boardDiv = document.getElementById("gameBoard");
  boardDiv.innerHTML = "";

  board.forEach(row => {
    row.forEach(val => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = val || "";
      boardDiv.appendChild(tile);
    });
  });
}

function addTile() {
  let empty = [];
  board.forEach((r, i) =>
    r.forEach((val, j) => {
      if (val === 0) empty.push({ i, j });
    })
  );

  if (empty.length === 0) return;

  const { i, j } = empty[Math.floor(Math.random() * empty.length)];
  board[i][j] = Math.random() > 0.1 ? 2 : 4;
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  return arr.filter(val => val).concat(Array(boardSize).fill(0)).slice(0, boardSize);
}

function rotateClockwise() {
  board = board[0].map((_, i) => board.map(r => r[i]).reverse());
}

function rotateCounterClockwise() {
  board = board[0].map((_, i) => board.map(r => r[boardSize - 1 - i]));
}

function moveLeft() {
  board = board.map(row => slide(row));
  addTile();
  drawBoard();
  document.getElementById("score").textContent = score;
}

function moveRight() {
  board = board.map(row => slide(row.reverse()).reverse());
  addTile();
  drawBoard();
  document.getElementById("score").textContent = score;
}

function moveUp() {
  rotateCounterClockwise();
  moveLeft();
  rotateClockwise();
}

function moveDown() {
  rotateClockwise();
  moveLeft();
  rotateCounterClockwise();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
  else if (e.key === "ArrowUp") moveUp();
  else if (e.key === "ArrowDown") moveDown();
});

function resetGame() {
  initGame();
}
