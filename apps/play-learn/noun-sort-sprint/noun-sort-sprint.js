const WORD_BANK = [
  { word: "boy", type: "common" },
  { word: "school", type: "common" },
  { word: "dog", type: "common" },
  { word: "book", type: "common" },
  { word: "city", type: "common" },

  { word: "Sipho", type: "proper" },
  { word: "Cape Town", type: "proper" },
  { word: "Monday", type: "proper" },
  { word: "Africa", type: "proper" },
  { word: "Netflix", type: "proper" },

  { word: "happiness", type: "abstract" },
  { word: "fear", type: "abstract" },
  { word: "honesty", type: "abstract" },
  { word: "courage", type: "abstract" },
  { word: "love", type: "abstract" },

  { word: "team", type: "collective" },
  { word: "class", type: "collective" },
  { word: "herd", type: "collective" },
  { word: "bunch", type: "collective" },
  { word: "pack", type: "collective" }
];

const TYPE_LABELS = {
  common: "Common Noun",
  proper: "Proper Noun",
  abstract: "Abstract Noun",
  collective: "Collective Noun"
};

const wordBox = document.getElementById("wordBox");
const roundText = document.getElementById("roundText");
const scoreText = document.getElementById("scoreText");
const feedbackMessage = document.getElementById("feedbackMessage");
const resultsSection = document.getElementById("resultsSection");
const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const reviewList = document.getElementById("reviewList");

const wordCountSelect = document.getElementById("wordCount");
const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const choiceButtons = document.querySelectorAll(".choice-btn");

let gameWords = [];
let currentIndex = 0;
let score = 0;
let gameActive = false;
let reviewData = [];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setChoicesDisabled(disabled) {
  choiceButtons.forEach(button => {
    button.disabled = disabled;
  });
}

function updateScoreUI() {
  scoreText.textContent = `Score: ${score}`;
}

function updateRoundUI() {
  roundText.textContent = `Word ${Math.min(currentIndex + 1, gameWords.length)} / ${gameWords.length}`;
}

function showCurrentWord() {
  if (!gameWords.length || currentIndex >= gameWords.length) {
    finishGame();
    return;
  }

  wordBox.textContent = gameWords[currentIndex].word;
  updateRoundUI();
}

function startGame() {
  const count = Number(wordCountSelect.value);
  gameWords = shuffle(WORD_BANK).slice(0, count);
  currentIndex = 0;
  score = 0;
  reviewData = [];
  gameActive = true;

  resultsSection.style.display = "none";
  reviewList.innerHTML = "";
  feedbackMessage.textContent = "Choose the correct noun type.";
  feedbackMessage.className = "feedback-message";
  updateScoreUI();
  setChoicesDisabled(false);
  showCurrentWord();
}

function finishGame() {
  gameActive = false;
  setChoicesDisabled(true);
  wordBox.textContent = "Finished!";
  roundText.textContent = `Word ${gameWords.length} / ${gameWords.length}`;
  finalScore.textContent = `Score: ${score} / ${gameWords.length}`;

  if (score === gameWords.length) {
    resultMessage.textContent = "Excellent! You sorted every noun correctly.";
  } else if (score >= Math.ceil(gameWords.length * 0.7)) {
    resultMessage.textContent = "Well done! You are getting strong at noun types.";
  } else {
    resultMessage.textContent = "Good try. Play again and beat your score.";
  }

  reviewList.innerHTML = "";

  reviewData.forEach(item => {
    const row = document.createElement("div");
    row.className = "review-row";
    row.innerHTML = `
      <div><strong>${item.word}</strong></div>
      <div>Correct type: ${TYPE_LABELS[item.correctType]}</div>
      <div class="badge ${item.isCorrect ? "badge-success" : "badge-error"}">
        ${item.isCorrect ? "⭐ Correct" : `You chose ${TYPE_LABELS[item.chosenType]}`}
      </div>
    `;
    reviewList.appendChild(row);
  });

  resultsSection.style.display = "block";
}

function handleChoice(chosenType) {
  if (!gameActive || currentIndex >= gameWords.length) return;

  const current = gameWords[currentIndex];
  const isCorrect = chosenType === current.type;

  if (isCorrect) {
    score += 1;
    feedbackMessage.textContent = `⭐ Correct! ${current.word} is a ${TYPE_LABELS[current.type]}.`;
    feedbackMessage.className = "feedback-message feedback-correct";
  } else {
    feedbackMessage.textContent = `Not quite. ${current.word} is a ${TYPE_LABELS[current.type]}.`;
    feedbackMessage.className = "feedback-message feedback-wrong";
  }

  reviewData.push({
    word: current.word,
    correctType: current.type,
    chosenType,
    isCorrect
  });

  updateScoreUI();
  currentIndex += 1;

  setTimeout(() => {
    if (currentIndex < gameWords.length) {
      showCurrentWord();
      feedbackMessage.textContent = "Choose the correct noun type.";
      feedbackMessage.className = "feedback-message";
    } else {
      finishGame();
    }
  }, 900);
}

choiceButtons.forEach(button => {
  button.addEventListener("click", () => {
    handleChoice(button.dataset.type);
  });
});

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

setChoicesDisabled(true);
updateScoreUI();
wordBox.textContent = "Ready?";
