document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const resultDisplay = document.getElementById("result");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    let squares = [];
    let width = 4;
    let score = 0;
    let gameRunning = false;

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.innerHTML = 0;
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        updateColors();
    }

    function startGame() {
        gameRunning = true;
        squares.forEach(square => square.innerHTML = 0);
        score = 0;
        scoreDisplay.innerHTML = score;
        generate();
        generate();
        updateColors();
    }

    function generate() {
        let empty = squares.filter(sq => sq.innerHTML == 0);
        if (empty.length === 0) return;
        let randomSquare = empty[Math.floor(Math.random() * empty.length)];
        randomSquare.innerHTML = 2;
        checkGameOver();
        updateColors();
    }

    function move(direction) {
        if (!gameRunning) return;
        direction();
        combine(direction === moveLeft || direction === moveRight ? combineRow : combineCol);
        direction();
        generate();
    }

    function moveRight() {
        for (let i = 0; i < 16; i += 4) {
            let row = squares.slice(i, i + 4).map(s => +s.innerHTML).filter(n => n);
            while (row.length < 4) row.unshift(0);
            row.forEach((val, idx) => squares[i + idx].innerHTML = val);
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i += 4) {
            let row = squares.slice(i, i + 4).map(s => +s.innerHTML).filter(n => n);
            while (row.length < 4) row.push(0);
            row.forEach((val, idx) => squares[i + idx].innerHTML = val);
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let col = [0, 1, 2, 3].map(j => +squares[i + j * 4].innerHTML).filter(n => n);
            while (col.length < 4) col.push(0);
            col.forEach((val, j) => squares[i + j * 4].innerHTML = val);
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let col = [0, 1, 2, 3].map(j => +squares[i + j * 4].innerHTML).filter(n => n);
            while (col.length < 4) col.unshift(0);
            col.forEach((val, j) => squares[i + j * 4].innerHTML = val);
        }
    }

    function combine(fn) {
        fn();
        updateColors();
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
                let val = +squares[i].innerHTML * 2;
                squares[i].innerHTML = val;
                squares[i + 1].innerHTML = 0;
                score += val;
                scoreDisplay.innerHTML = score;
            }
        }
    }

    function combineCol() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let val = +squares[i].innerHTML * 2;
                squares[i].innerHTML = val;
                squares[i + width].innerHTML = 0;
                score += val;
                scoreDisplay.innerHTML = score;
            }
        }
    }

    function updateColors() {
        const colorMap = {
            0: "#afa192",
            2: "#eee4da",
            4: "#ede0c8",
            8: "#f2b179",
            16: "#ffcea4",
            32: "#e8c064",
            64: "#ffab6e",
            128: "#fd9982",
            256: "#ead79c",
            512: "#76daff",
            1024: "#beeaa5",
            2048: "#d7d4f0"
        };
        squares.forEach(square => {
            square.style.backgroundColor = colorMap[square.innerHTML] || "#afa192";
        });
    }

    function checkGameOver() {
        if ([...squares].every(sq => sq.innerHTML != 0)) {
            resultDisplay.innerHTML = "Game Over!";
            gameRunning = false;
        }
    }

    document.addEventListener("keydown", e => {
        if (!gameRunning || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
        if (e.key === "ArrowLeft" || e.key === "a") move(moveLeft);
        if (e.key === "ArrowRight" || e.key === "d") move(moveRight);
        if (e.key === "ArrowUp" || e.key === "w") move(moveUp);
        if (e.key === "ArrowDown" || e.key === "s") move(moveDown);
    });

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);

    // profile edit
    const editBtn = document.getElementById("editBtn");
    const editForm = document.getElementById("editForm");
    const nameInput = document.getElementById("nameInput");
    const bioInput = document.getElementById("bioInput");
    const saveBtn = document.getElementById("saveBtn");

    editBtn.addEventListener("click", () => {
        editForm.classList.toggle("hidden");
    });

    saveBtn.addEventListener("click", () => {
        const newName = nameInput.value;
        const newBio = bioInput.value;
        if (newName) document.querySelector(".name").innerText = newName;
        if (newBio) document.querySelector(".bio").innerText = newBio;
        editForm.classList.add("hidden");
    });

    createBoard();
});
