let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let aiBtn = document.querySelector("#ai-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnStatus = document.querySelector("#turn-status");
let timerDisplay = document.querySelector("#timer");
let turnO = true;
let playWithAI = false;
let timer = 10;
let timerInterval;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true;
    playWithAI = false;
    enableBoxes();
    msgContainer.classList.add("hide");
    updateTurnStatus();
    startTimer();
};

const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("player-o", "player-x");
    });
};

const showWinner = (winner) => {
    msg.innerText = winner === "Draw" ? "It's a Draw!" : `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    clearInterval(timerInterval);
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            showWinner(boxes[a].innerText);
            return;
        }
    }
    if ([...boxes].every((box) => box.disabled)) {
        showWinner("Draw");
    }
};

const aiMove = () => {
    let availableBoxes = [...boxes].filter((box) => box.innerText === "");
    if (availableBoxes.length === 0) return;
    let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
    randomBox.innerText = "X";
    randomBox.disabled = true;
    checkWinner();
    turnO = true;
    updateTurnStatus();
};

const updateTurnStatus = () => {
    turnStatus.innerText = `Player ${turnO ? "O" : "X"}'s Turn`;
};

const startTimer = () => {
    clearInterval(timerInterval);
    timer = 10;
    timerDisplay.innerText = `Time Left: ${timer}s`;

    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.innerText = `Time Left: ${timer}s`;
        if (timer === 0) {
            clearInterval(timerInterval);
            showWinner(turnO ? "X" : "O");
        }
    }, 1000);
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "") return;
        box.innerText = turnO ? "O" : "X";
        box.disabled = true;
        checkWinner();
        if (!msgContainer.classList.contains("hide")) return;
        turnO = !turnO;
        updateTurnStatus();
        if (playWithAI && !turnO) {
            setTimeout(aiMove, 500);
        }
    });
});

resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the game?")) resetGame();
});

newGameBtn.addEventListener("click", resetGame);

aiBtn.addEventListener("click", () => {
    playWithAI = true;
    resetGame();
});

startTimer();
