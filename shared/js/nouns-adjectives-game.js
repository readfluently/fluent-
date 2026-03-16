const squares = [
  { label: "Start", type: "start", action: "All players begin here." },
  { label: "What is a noun?", type: "question" },
  { label: "Give two examples of common nouns", type: "question" },
  { label: "What is an adjective", type: "question" },
  { label: "Give two examples of descriptive adjectives", type: "question" },
  { label: "What is a verb?", type: "question" },
  { label: "What is a common noun?", type: "question" },
  { label: "Roll again!", type: "special" },
  { label: "Swap places with another player", type: "special" },
  { label: "What is to describe?", type: "question" },
  { label: "What is an abstract noun?", type: "question" },
  { label: "Name one collective noun for people", type: "question" },
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
  { label: "Give one demonstrative adjective", type: "question" },
  { label: "Give one comparative adjective.", type: "question" },
  { label: "Give one superlative adjective.", type: "question" },
  { label: "Describe a dog using two adjectives.", type: "question" },
  { label: "Describe your school bag using two adjectives.", type: "question" },
  { label: "Choose an adjective for a rainy day.", type: "question" },
  { label: "Change this adjective to comparative form: big", type: "question" },
  { label: "Change this adjective to superlative form: happy", type: "question" },
  { label: "What is a pronoun?", type: "question" },
  { label: "What is a proper noun", type: "question" },
  { label: "Give one pronoun for many people.", type: "question" },
  { label: "Give one possessive pronoun.", type: "question" },
  { label: "Replace the noun with a pronoun: The boy ran.", type: "question" },
  { label: "Name two pronouns.", type: "question" },
  { label: "Finish", type: "finish", action: "You win if you land here first." }
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
const readQuestionBtn = document.getElementById("readQuestionBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const correctBtn = document.getElementById("correctBtn");
const wrongBtn = document.getElementById("wrongBtn");

const recordBtnP1 = document.getElementById("recordBtnP1");
const stopRecordBtnP1 = document.getElementById("stopRecordBtnP1");
const playRecordingBtnP1 = document.getElementById("playRecordingBtnP1");
const downloadRecordingBtnP1 = document.getElementById("downloadRecordingBtnP1");
const playerPlaybackP1 = document.getElementById("playerPlaybackP1");

const recordBtnP2 = document.getElementById("recordBtnP2");
const stopRecordBtnP2 = document.getElementById("stopRecordBtnP2");
const playRecordingBtnP2 = document.getElementById("playRecordingBtnP2");
const downloadRecordingBtnP2 = document.getElementById("downloadRecordingBtnP2");
const playerPlaybackP2 = document.getElementById("playerPlaybackP2");

let availableVoices = [];

const recordings = {
  p1: { mediaRecorder: null, chunks: [], blob: null, url: "" },
  p2: { mediaRecorder: null, chunks: [], blob: null, url: "" }
};

function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const englishVoice = availableVoices.find(v => v.lang.toLowerCase().includes("en"));
  if (englishVoice) utterance.voice = englishVoice;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function squareClass(type, index) {
  if (type === "start") return "square start";
  if (type === "special") return "square special";
  if (type === "finish") return "square finish";
  return index % 2 === 0 ? "square question-a" : "square question-b";
}

function renderBoard() {
  board.innerHTML = "";

  squares.forEach((square, index) => {
    const cell = document.createElement("div");
    cell.className = squareClass(square.type, index);

    const text = document.createElement("div");
    text.className = "square-text";
    text.textContent = square.label;

    cell.appendChild(text);

    players.forEach((player) => {
      if (player.position === index) {
        const token = document.createElement("div");
        token.className = `token ${player.className}`;
        token.textContent = player.name === "Player 1" ? "P1" : "P2";
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

function readCurrentSquare() {
  const player = players[currentPlayer];
  const square = squares[player.position];
  const text = square.action || square.label;
  speakText(text);
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
    statusBox.textContent = `${player.name} landed on a swap square. Swap manually for now.`;
  } else {
    statusBox.textContent = `${player.name} moved to a new square. Listen and answer aloud.`;
  }

  renderBoard();
  readCurrentSquare();
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

function setupRecorder(playerKey, recordBtn, stopBtn, playBtn, downloadBtn, audioEl, label) {
  recordBtn.addEventListener("click", async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      statusBox.textContent = "Recording is not supported in this browser.";
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      recordings[playerKey].chunks = [];
      recordings[playerKey].blob = null;

      if (recordings[playerKey].url) {
        URL.revokeObjectURL(recordings[playerKey].url);
        recordings[playerKey].url = "";
      }

      const recorder = new MediaRecorder(stream);
      recordings[playerKey].mediaRecorder = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordings[playerKey].chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        recordings[playerKey].blob = new Blob(recordings[playerKey].chunks, {
          type: recorder.mimeType || "audio/webm"
        });

        recordings[playerKey].url = URL.createObjectURL(recordings[playerKey].blob);
        audioEl.src = recordings[playerKey].url;
        audioEl.hidden = false;

        playBtn.disabled = false;
        downloadBtn.disabled = false;
        stopBtn.disabled = true;
        recordBtn.disabled = false;

        statusBox.textContent = `${label} recording saved.`;
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      recordBtn.disabled = true;
      stopBtn.disabled = false;
      playBtn.disabled = true;
      downloadBtn.disabled = true;

      statusBox.textContent = `${label} is recording...`;
    } catch (error) {
      statusBox.textContent = `Microphone access for ${label} was denied or unavailable.`;
    }
  });

  stopBtn.addEventListener("click", () => {
    const recorder = recordings[playerKey].mediaRecorder;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      statusBox.textContent = `Stopping ${label} recording...`;
    }
  });

  playBtn.addEventListener("click", () => {
    if (!recordings[playerKey].url) {
      statusBox.textContent = `There is no saved recording for ${label} yet.`;
      return;
    }
    audioEl.hidden = false;
    audioEl.play();
    statusBox.textContent = `Playing ${label} recording.`;
  });

  downloadBtn.addEventListener("click", () => {
    if (!recordings[playerKey].blob || !recordings[playerKey].url) {
      statusBox.textContent = `There is no recording to download for ${label}.`;
      return;
    }

    const link = document.createElement("a");
    link.href = recordings[playerKey].url;
    link.download = `${label.toLowerCase().replace(" ", "-")}-answer.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    statusBox.textContent = `${label} recording download has started.`;
  });
}

rollBtn.addEventListener("click", rollDice);
readQuestionBtn.addEventListener("click", readCurrentSquare);
nextBtn.addEventListener("click", nextPlayer);
wrongBtn.addEventListener("click", markWrong);
correctBtn.addEventListener("click", markCorrect);
resetBtn.addEventListener("click", resetGame);

setupRecorder("p1", recordBtnP1, stopRecordBtnP1, playRecordingBtnP1, downloadRecordingBtnP1, playerPlaybackP1, "Player 1");
setupRecorder("p2", recordBtnP2, stopRecordBtnP2, playRecordingBtnP2, downloadRecordingBtnP2, playerPlaybackP2, "Player 2");

loadVoices();
if ("onvoiceschanged" in window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

renderBoard();
setCurrentSquareText();
