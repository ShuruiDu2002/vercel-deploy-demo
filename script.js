// ----------- Personal Info Logic ----------- //
const nameInput = document.getElementById("name");
const taglineInput = document.getElementById("tagline");
const aboutInput = document.getElementById("about");
const profilePicInput = document.getElementById("profile-pic-input");
const profilePic = document.getElementById("profile-pic");
const profileForm = document.getElementById("profile-form");
const profileDisplay = document.getElementById("profile-display");
const displayName = document.getElementById("display-name");
const displayTagline = document.getElementById("display-tagline");
const displayAbout = document.getElementById("display-about");
const editBtn = document.getElementById("edit-btn");

function loadProfile() {
  const saved = JSON.parse(localStorage.getItem("profileData"));
  if (saved) {
    nameInput.value = saved.name;
    taglineInput.value = saved.tagline;
    aboutInput.value = saved.about;
    if (saved.image) {
      profilePic.src = saved.image;
      profilePic.style.display = "block";
    }

    displayName.textContent = saved.name;
    displayTagline.textContent = saved.tagline;
    displayAbout.textContent = saved.about;

    profileForm.style.display = "none";
    profileDisplay.style.display = "block";
  }
}
loadProfile();

profileForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {
    name: nameInput.value,
    tagline: taglineInput.value,
    about: aboutInput.value,
    image: profilePic.src || "",
  };
  localStorage.setItem("profileData", JSON.stringify(data));
  displayName.textContent = data.name;
  displayTagline.textContent = data.tagline;
  displayAbout.textContent = data.about;
  profileForm.style.display = "none";
  profileDisplay.style.display = "block";
});

profilePicInput.addEventListener("change", function () {
  const file = profilePicInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    profilePic.src = reader.result;
    profilePic.style.display = "block";
  };
  reader.readAsDataURL(file);
});

editBtn.addEventListener("click", function () {
  profileForm.style.display = "block";
  profileDisplay.style.display = "none";
});

// ----------- 2048 Game Logic ----------- //
const gridSize = 4;
let board = [];
const gameContainer = document.getElementById("game-board");
const restartBtn = document.getElementById("restart-btn");

function initGame() {
  board = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(0)
  );
  addRandomTile();
  addRandomTile();
  drawBoard();
}

function addRandomTile() {
  const emptyCells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length > 0) {
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function drawBoard() {
  gameContainer.innerHTML = "";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (board[r][c] !== 0) {
        tile.textContent = board[r][c];
        tile.style.backgroundColor = "#e0e0e0";
        tile.style.transform = "scale(1.05)";
        setTimeout(() => (tile.style.transform = "scale(1)"), 100);
      }
      gameContainer.appendChild(tile);
    }
  }
}

function slide(row) {
  const arr = row.filter((v) => v !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  return arr.filter((v) => v !== 0).concat(Array(gridSize).fill(0)).slice(0, gridSize);
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i])).reverse();
}

function move(direction) {
  let rotated = board;

  if (direction === "up") {
    rotated = rotateMatrix(board);
  } else if (direction === "down") {
    rotated = rotateMatrix(board).map((row) => row.reverse());
  } else if (direction === "right") {
    rotated = board.map((row) => row.reverse());
  }

  let changed = false;
  const newBoard = rotated.map((row, i) => {
    const newRow = slide(row);
    if (JSON.stringify(newRow) !== JSON.stringify(row)) changed = true;
    return newRow;
  });

  if (!changed) return;

  if (direction === "up") {
    board = rotateMatrix(newBoard).map((row) => row.reverse());
  } else if (direction === "down") {
    board = rotateMatrix(newBoard.reverse());
  } else if (direction === "right") {
    board = newBoard.map((row) => row.reverse());
  } else {
    board = newBoard;
  }

  addRandomTile();
  drawBoard();
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "w", "W"].includes(e.key)) move("up");
  else if (["ArrowDown", "s", "S"].includes(e.key)) move("down");
  else if (["ArrowLeft", "a", "A"].includes(e.key)) move("left");
  else if (["ArrowRight", "d", "D"].includes(e.key)) move("right");
});

restartBtn.addEventListener("click", () => {
  initGame();
});

initGame();
