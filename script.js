const profileView = document.getElementById("profile-view");
const profileEdit = document.getElementById("profile-edit");
const nameInput = document.getElementById("name-input");
const descriptionInput = document.getElementById("description-input");
const imageUpload = document.getElementById("image-upload");
const nameDisplay = document.getElementById("name-display");
const descriptionDisplay = document.getElementById("description-display");
const profilePictureDisplay = document.getElementById("profile-picture-display");

function saveProfile() {
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const image = imageUpload.files[0];

  if (name) localStorage.setItem("name", name);
  if (description) localStorage.setItem("description", description);

  if (image) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("image", e.target.result);
      loadProfile();
    };
    reader.readAsDataURL(image);
  } else {
    loadProfile();
  }
}

function loadProfile() {
  const name = localStorage.getItem("name");
  const description = localStorage.getItem("description");
  const image = localStorage.getItem("image");

  if (name || description || image) {
    profileEdit.classList.add("hidden");
    profileView.classList.remove("hidden");
    nameDisplay.textContent = name || "";
    descriptionDisplay.textContent = description || "";
    if (image) profilePictureDisplay.src = image;
  }
}

document.getElementById("save-button").addEventListener("click", saveProfile);
document.getElementById("edit-button").addEventListener("click", () => {
  profileView.classList.add("hidden");
  profileEdit.classList.remove("hidden");
});

window.addEventListener("load", loadProfile);

// 2048 game logic
let grid = [];
let score = 0;
let isGameActive = false;

function initGrid() {
  grid = [];
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.textContent = "";
    gridEl.appendChild(tile);
    grid.push(tile);
  }
  score = 0;
  updateScore();
  addNumber();
  addNumber();
}

function addNumber() {
  const emptyTiles = grid.filter(tile => !tile.textContent);
  if (emptyTiles.length === 0) return;
  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  randomTile.textContent = Math.random() > 0.5 ? "2" : "4";
}

function move(direction) {
  if (!isGameActive) return;

  const size = 4;
  let moved = false;

  const get = (r, c) => grid[r * size + c];
  const set = (r, c, val) => (grid[r * size + c].textContent = val);

  for (let i = 0; i < size; i++) {
    let values = [];
    for (let j = 0; j < size; j++) {
      let val = direction === "left" || direction === "right"
        ? get(i, j).textContent
        : get(j, i).textContent;
      if (val) values.push(Number(val));
    }

    if (direction === "right" || direction === "down") values.reverse();

    for (let k = 0; k < values.length - 1; k++) {
      if (values[k] === values[k + 1]) {
        values[k] *= 2;
        score += values[k];
        values.splice(k + 1, 1);
      }
    }

    while (values.length < size) values.push("");

    if (direction === "right" || direction === "down") values.reverse();

    for (let j = 0; j < size; j++) {
      let currentVal = direction === "left" || direction === "right"
        ? get(i, j).textContent
        : get(j, i).textContent;
      let newVal = values[j] || "";
      if (currentVal !== newVal) moved = true;
      if (direction === "left" || direction === "right") set(i, j, newVal);
      else set(j, i, newVal);
    }
  }

  if (moved) {
    updateScore();
    addNumber();
  }
}

function updateScore() {
  document.getElementById("score-display").textContent = "Score: " + score;
}

document.addEventListener("keydown", e => {
  if (!isGameActive || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

  switch (e.key.toLowerCase()) {
    case "arrowup":
    case "w": move("up"); break;
    case "arrowdown":
    case "s": move("down"); break;
    case "arrowleft":
    case "a": move("left"); break;
    case "arrowright":
    case "d": move("right"); break;
  }
});

document.getElementById("start-game").addEventListener("click", () => {
  isGameActive = true;
  initGrid();
});

document.getElementById("restart").addEventListener("click", () => {
  if (isGameActive) initGrid();
});
