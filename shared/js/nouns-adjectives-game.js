const squares = [
  { label: "START", type: "start", action: "All players begin here." },
  { label: "What is a noun?", type: "question" },
  { label: "Give two common nouns.", type: "question" },
  { label: "What is an adjective?", type: "question" },
  { label: "Give two descriptive adjectives.", type: "question" },
  { label: "Roll again!", type: "special" },
  { label: "What is a verb?", type: "question" },
  { label: "What is a common noun?", type: "question" },
  { label: "Swap places with another player.", type: "special" },
  { label: "What is to describe?", type: "question" },
  { label: "What is an abstract noun?", type: "question" },
  { label: "Name one collective noun for people.", type: "question" },
  { label: "Give two proper nouns.", type: "question" },
  { label: "Give one noun for a place and one for a person.", type: "question" },
  { label: "Is happiness an abstract noun? Why?", type: "question" },
  { label: "Is team a collective noun?", type: "question" },
  { label: "Change this common noun into a proper noun: city.", type: "question" },
  { label: "Find a noun that starts with the letter B.", type: "question" },
  { label: "What does an adjective describe?", type: "question" },
  { label: "Give two descriptive adjectives.", type: "question" },
  { label: "Give one colour adjective.", type: "question" },
  { label: "Give one size adjective.", type: "question" },
  { label: "Give one number adjective.", type: "question" },
  { label: "Give one feeling adjective.", type: "question" },
  { label: "Give one possessive adjective.", type: "question" },
  { label: "Give one demonstrative adjective.", type: "question" },
  { label: "Give one comparative adjective.", type: "question" },
  { label: "Give one superlative adjective.", type: "question" },
  { label: "Describe a dog using two adjectives.", type: "question" },
  { label: "Describe your school bag using two adjectives.", type: "question" },
  { label: "Choose an adjective for a rainy day.", type: "question" },
  { label: "Change this adjective to comparative form: big.", type: "question" },
  { label: "Change this adjective to superlative form: happy.", type: "question" },
  { label: "What is a pronoun?", type: "question" },
  { label: "What is a proper noun?", type: "question" },
  { label: "Give one pronoun for many people.", type: "question" },
  { label: "Give one possessive pronoun.", type: "question" },
  { label: "Replace the noun with a pronoun: The boy ran.", type: "question" },
  { label: "Name two pronouns.", type: "question" },
  { label: "FINISH", type: "finish", action: "You win if you land here first." }
];

const players = [
  { name: "Player 1", position: 0, className: "p1" },
  { name: "Player 2", position: 0, className: "p2" }
];

let currentPlayer = 0;

const board = document.getElementById("board");
const turnText = document.getElementById("turnText");
const diceText = document.getElementById("diceText");
const questionText = document.getElementById("questionText");
const statusBox = document.getElementById("statusBox");

const rollBtn = document.getElementById("rollBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const correctBtn = document.getElementById("correctBtn");
const wrongBtn = document.getElementById("wrongBtn");

function squareClass(type) {
  if (type === "start") return "square start";
  if (type === "special") return "square special";
  if (type === "finish") return "square finish";
  return "square question";
}

function renderBoard() {
  board.innerHTML = "";

  squares.forEach((square, index) => {
    const cell = document.createElement("div");
    cell.className = squareClass(square.type);

    const num = document.createElement("div");
    num.className = "square-num";
    num.textContent =
      index === 0 ? "START" :
      index === squares.length - 1 ? "FINISH" :
      `Square ${index}`;

    const text = document.createElement("div");
    text.className = "square-text";
    text.textContent = square.label;

    cell.appendChild(num);
    cell.appendChild(text);

    players.forEach((player) => {
      if (player.position === index) {
        const token = document.createElement("div");
        token.className = `token ${player.className}`;
        token.textContent = player.name.replace("Player ", "P");
        cell.appendChild(token);
      }
    });

    board.appendChild(cell);
  });

  turnText.textContent = players[currentPlayer].name;
}

function setCurrentSquareText() {
  const player = players[currentPlayer];
  const square = squares[player.position];
  questionText.textContent = square.action || square.label;
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  const player = players[currentPlayer];

  diceText.textContent = `${player.name} rolled a ${roll}.`;

  player.position += roll;
  if (player.position >= squares.length - 1) {
    player.position = squares.length - 1;
  }

  const landed = squares[player.position];
  questionText.textContent = landed.action || landed.label;

  if (landed.type === "finish") {
    statusBox.textContent = `${player.name} wins the game!`;
  } else if (landed.label.toLowerCase().includes("roll again")) {
    statusBox.textContent = `${player.name} landed on "Roll again!"`;
  } else if (landed.label.toLowerCase().includes("swap places")) {
    statusBox.textContent = `${player.name} landed on a swap square. Swap tokens manually or build that rule later.`;
  } else {
    statusBox.textContent = `${player.name} moved to square ${player.position}. Answer the question aloud.`;
  }

  renderBoard();
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % players.length;
  turnText.textContent = players[currentPlayer].name;
  setCurrentSquareText();
  statusBox.textContent = `${players[currentPlayer].name}'s turn.`;
}

function markWrong() {
  const player = players[currentPlayer];
  if (player.position > 0) {
    player.position -= 1;
  }
  renderBoard();
  setCurrentSquareText();
  statusBox.textContent = `${player.name} moves back one square.`;
}

function markCorrect() {
  const player = players[currentPlayer];
  statusBox.textContent = `${player.name} answered correctly and stays on the square.`;
}

function resetGame() {
  players.forEach((player) => {
    player.position = 0;
  });
  currentPlayer = 0;
  diceText.textContent = "Roll to begin";
  questionText.textContent = "The question for the current square will appear here.";
  statusBox.textContent = "Ready to play.";
  renderBoard();
}

rollBtn.addEventListener("click", rollDice);
nextBtn.addEventListener("click", nextPlayer);
wrongBtn.addEventListener("click", markWrong);
correctBtn.addEventListener("click", markCorrect);
resetBtn.addEventListener("click", resetGame);

renderBoard();
setCurrentSquareText();
