let grid, scoreDisplay, message;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let tiles = [];

function init() {
    grid = document.getElementById("grid");
    scoreDisplay = document.getElementById("score");
    message = document.getElementById("message");
    grid.innerHTML = '';
    tiles = Array(16).fill(0);
    score = 0;
    scoreDisplay.textContent = score;
    document.getElementById("highScore").textContent = highScore;
    message.textContent = '';
    addRandomTile();
    addRandomTile();
    drawTiles();
}

function drawTiles() {
    grid.innerHTML = '';
    tiles.forEach((val, i) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = val !== 0 ? val : '';
        tile.style.background = val === 0 ? "#cdc1b4" :
                                val === 2 ? "#eee4da" :
                                val === 4 ? "#ede0c8" :
                                val === 8 ? "#f2b179" :
                                val === 16 ? "#f59563" :
                                val === 32 ? "#f67c5f" :
                                val === 64 ? "#f65e3b" :
                                val === 128 ? "#edcf72" :
                                val === 256 ? "#edcc61" :
                                val === 512 ? "#edc850" :
                                val === 1024 ? "#edc53f" :
                                val === 2048 ? "#edc22e" : "#3c3a32";
        tile.style.color = val <= 4 ? "#776e65" : "#f9f6f2";
        grid.appendChild(tile);
    });
}

function addRandomTile() {
    let empty = tiles.map((val, i) => val === 0 ? i : -1).filter(i => i !== -1);
    if (empty.length === 0) return;
    let idx = empty[Math.floor(Math.random() * empty.length)];
    tiles[idx] = Math.random() < 0.9 ? 2 : 4;
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
    return arr.filter(val => val).concat(Array(4 - arr.filter(val => val).length).fill(0));
}

function move(direction) {
    let moved = false;
    let newTiles = [...tiles];

    for (let i = 0; i < 4; i++) {
        let line = [];
        for (let j = 0; j < 4; j++) {
            let idx = direction === 'left' ? i * 4 + j :
                      direction === 'right' ? i * 4 + (3 - j) :
                      direction === 'up' ? j * 4 + i :
                      direction === 'down' ? (3 - j) * 4 + i : 0;
            line.push(tiles[idx]);
        }
        let slided = slide(line);
        for (let j = 0; j < 4; j++) {
            let idx = direction === 'left' ? i * 4 + j :
                      direction === 'right' ? i * 4 + (3 - j) :
                      direction === 'up' ? j * 4 + i :
                      direction === 'down' ? (3 - j) * 4 + i : 0;
            if (tiles[idx] !== slided[j]) moved = true;
            newTiles[idx] = slided[j];
        }
    }

    if (moved) {
        tiles = newTiles;
        addRandomTile();
        drawTiles();
        scoreDisplay.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").textContent = highScore;
        }

        if (tiles.includes(2048)) message.textContent = "🎉 You win!";
        if (!tiles.includes(0) && !canMove()) message.textContent = "💀 Game Over!";
    }
}

function canMove() {
    for (let i = 0; i < 16; i++) {
        if (i % 4 !== 3 && tiles[i] === tiles[i + 1]) return true;
        if (i < 12 && tiles[i] === tiles[i + 4]) return true;
    }
    return false;
}

document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // ✅ 阻止页面滚动
        if (e.key === "ArrowUp") move("up");
        else if (e.key === "ArrowDown") move("down");
        else if (e.key === "ArrowLeft") move("left");
        else if (e.key === "ArrowRight") move("right");
    }
});

// Profile Card Logic
const profileForm = document.getElementById("profileForm");
const profileDisplay = document.getElementById("profileDisplay");
const displayName = document.getElementById("displayName");
const displayDesc = document.getElementById("displayDesc");
const displayImage = document.getElementById("displayImage");

profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const desc = document.getElementById("description").value.trim();
    const imgFile = document.getElementById("imageUpload").files[0];
    if (name && desc && imgFile) {
        const reader = new FileReader();
        reader.onload = () => {
            displayName.textContent = name;
            displayDesc.textContent = desc;
            displayImage.src = reader.result;
            profileForm.classList.add("hidden");
            profileDisplay.classList.remove("hidden");
            localStorage.setItem("profileData", JSON.stringify({ name, desc, img: reader.result }));
        };
        reader.readAsDataURL(imgFile);
    }
});

function editProfile() {
    profileForm.classList.remove("hidden");
    profileDisplay.classList.add("hidden");
}

const saved = localStorage.getItem("profileData");
if (saved) {
    const { name, desc, img } = JSON.parse(saved);
    displayName.textContent = name;
    displayDesc.textContent = desc;
    displayImage.src = img;
    profileForm.classList.add("hidden");
    profileDisplay.classList.remove("hidden");
}

init();
