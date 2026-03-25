const books = [
  {
    id: 1,
    title: "Sam and the Cat",
    level: "Level 1",
    theme: "Animals",
    cover: "🐱",
    description: "A very short beginner reader with simple repeated words.",
    sentences: [
      "Sam has a cat.",
      "The cat is big.",
      "Sam pats the cat.",
      "The cat sits on the mat.",
      "Sam and the cat nap."
    ]
  },
  {
    id: 2,
    title: "The Red Ball",
    level: "Level 1",
    theme: "Play",
    cover: "🔴",
    description: "Short sentences for new readers to practise clear speech.",
    sentences: [
      "I have a red ball.",
      "I toss the ball up.",
      "The ball drops down.",
      "I catch the ball.",
      "I smile and play."
    ]
  },
  {
    id: 3,
    title: "Fun at School",
    level: "Level 2",
    theme: "School",
    cover: "🏫",
    description: "A simple school story with familiar actions and people.",
    sentences: [
      "Lebo walks to school with her bag.",
      "She greets her teacher at the door.",
      "The class reads a short story together.",
      "Lebo writes neatly in her book.",
      "She feels proud of her work."
    ]
  },
  {
    id: 4,
    title: "A Rainy Day",
    level: "Level 2",
    theme: "Weather",
    cover: "🌧️",
    description: "A gentle weather reader with everyday vocabulary.",
    sentences: [
      "Dark clouds fill the sky.",
      "Soon the rain begins to fall.",
      "The children run inside the house.",
      "They watch the drops on the window.",
      "After a while the sun comes out."
    ]
  },
  {
    id: 5,
    title: "The Garden Surprise",
    level: "Level 3",
    theme: "Nature",
    cover: "🌱",
    description: "A slightly longer reader with richer vocabulary.",
    sentences: [
      "Musa watered the small garden every morning.",
      "One week later he noticed a bright green shoot.",
      "The plant grew taller each day in the warm sun.",
      "Soon a yellow flower opened its soft petals.",
      "Musa called his sister to see the surprise."
    ]
  },
  {
    id: 6,
    title: "The Lost Hat",
    level: "Level 3",
    theme: "Adventure",
    cover: "🎩",
    description: "A playful story with clear sentence flow and sequencing.",
    sentences: [
      "Ava looked for her hat before the wind carried it away.",
      "She searched near the gate and under the bench.",
      "Then she saw it hanging on a low tree branch.",
      "She laughed as she reached up to take it back.",
      "At last Ava placed the hat firmly on her head."
    ]
  },
  {
    id: 7,
    title: "The River Walk",
    level: "Level 4",
    theme: "Journey",
    cover: "🌊",
    description: "Longer sentences for learners building fluency and expression.",
    sentences: [
      "Early in the morning, the family followed the narrow path beside the river.",
      "They listened carefully to the birds singing in the tall reeds.",
      "When they reached a smooth flat rock, they sat down to rest and eat.",
      "Grandfather told a story about the river from his childhood.",
      "On the way home, everyone felt peaceful and full of wonder."
    ]
  },
  {
    id: 8,
    title: "The Class Play",
    level: "Level 4",
    theme: "Performance",
    cover: "🎭",
    description: "A richer oral reading text for confidence and pacing.",
    sentences: [
      "The learners stood quietly behind the curtain as the hall became silent.",
      "Each child remembered to speak loudly and clearly for the audience.",
      "When it was Nandi's turn, she smiled and said her lines with confidence.",
      "At the end of the play, the crowd clapped and cheered with joy.",
      "Their teacher thanked them for working hard and believing in themselves."
    ]
  }
];

const libraryView = document.getElementById("libraryView");
const readerView = document.getElementById("readerView");
const booksGrid = document.getElementById("booksGrid");

const readerBookCover = document.getElementById("readerBookCover");
const readerLevelTag = document.getElementById("readerLevelTag");
const readerThemeTag = document.getElementById("readerThemeTag");
const readerBookTitle = document.getElementById("readerBookTitle");
const readerBookDescription = document.getElementById("readerBookDescription");

const sentenceLabel = document.getElementById("sentenceLabel");
const bookProgressLabel = document.getElementById("bookProgressLabel");
const sentenceDisplay = document.getElementById("sentenceDisplay");
const progressText = document.getElementById("progressText");
const statusText = document.getElementById("statusText");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");
const nextBookBtn = document.getElementById("nextBookBtn");
const backToLibraryBtn = document.getElementById("backToLibraryBtn");

const filterButtons = document.querySelectorAll(".filter-chip");

let selectedFilter = "all";
let currentBookIndex = 0;
let currentSentenceIndex = 0;
let currentWordIndex = 0;
let currentSentenceWords = [];
let recognition = null;
let isListening = false;
let shouldRestartRecognition = false;

let encourageTimer = null;
let promptAfterPauseTimer = null;
let fullRetryTimer = null;

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[.,!?;:"“”'‘’()\-]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function wordsEquivalent(spoken, expected) {
  const a = normalizeWord(spoken);
  const b = normalizeWord(expected);

  if (!a || !b) return false;
  if (a === b) return true;

  const equivalents = {
    its: ["it's"],
    itss: ["it's"],
    a: ["uh"],
    the: ["thee", "duh"],
    to: ["too", "two"],
    too: ["to", "two"],
    two: ["to", "too"]
  };

  if (equivalents[a] && equivalents[a].includes(b)) return true;
  if (equivalents[b] && equivalents[b].includes(a)) return true;

  if (Math.abs(a.length - b.length) <= 1) {
    let mismatches = 0;
    const minLen = Math.min(a.length, b.length);
    for (let i = 0; i < minLen; i++) {
      if (a[i] !== b[i]) mismatches++;
    }
    mismatches += Math.abs(a.length - b.length);
    if (mismatches <= 1) return true;
  }

  return false;
}

function speakText(text, rate = 0.9) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.lang = "en-ZA";
  window.speechSynthesis.speak(utterance);
}

function clearTimers() {
  clearTimeout(encourageTimer);
  clearTimeout(promptAfterPauseTimer);
  clearTimeout(fullRetryTimer);
}

function setPauseSupportTimers() {
  clearTimers();

  encourageTimer = setTimeout(() => {
    if (!isListening) return;
    const currentWord = currentSentenceWords[currentWordIndex];
    if (!currentWord) return;

    statusText.textContent = `Try saying ${currentWord}`;
    speakText(`Try saying ${currentWord}`, 0.82);
    highlightWords();
  }, 4000);

  promptAfterPauseTimer = setTimeout(() => {
    if (!isListening) return;
    const currentWord = currentSentenceWords[currentWordIndex];
    if (!currentWord) return;

    statusText.textContent = `Continue with ${currentWord}`;
    highlightWords();
  }, 7000);

  fullRetryTimer = setTimeout(() => {
    if (!isListening) return;
    statusText.textContent = "Try the whole sentence again.";
    speakText("Try the whole sentence again.", 0.88);
  }, 11000);
}

function buildBooksGrid() {
  booksGrid.innerHTML = "";

  const filteredBooks =
    selectedFilter === "all"
      ? books
      : books.filter((book) => book.level === selectedFilter);

  filteredBooks.forEach((book) => {
    const actualIndex = books.findIndex((item) => item.id === book.id);

    const card = document.createElement("article");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-cover">${book.cover}</div>
      <div class="book-meta">
        <span class="book-pill">${book.level}</span>
        <span class="book-pill">${book.theme}</span>
      </div>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <button class="open-book-btn" data-index="${actualIndex}">Open Book</button>
    `;

    booksGrid.appendChild(card);
  });

  document.querySelectorAll(".open-book-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openBook(Number(btn.dataset.index));
    });
  });
}

function openBook(bookIndex) {
  currentBookIndex = bookIndex;
  currentSentenceIndex = 0;
  currentWordIndex = 0;

  const book = books[currentBookIndex];

  readerBookCover.textContent = book.cover;
  readerLevelTag.textContent = book.level;
  readerThemeTag.textContent = book.theme;
  readerBookTitle.textContent = book.title;
  readerBookDescription.textContent = book.description;

  libraryView.classList.remove("active");
  readerView.classList.add("active");

  renderSentence();
  statusText.textContent = "Press Start Reading when you are ready.";
}

function renderSentence() {
  stopListening();

  const book = books[currentBookIndex];
  const sentence = book.sentences[currentSentenceIndex];

  currentSentenceWords = sentence.split(/\s+/);
  currentWordIndex = 0;

  sentenceLabel.textContent = `Sentence ${currentSentenceIndex + 1}`;
  bookProgressLabel.textContent = `Book ${currentBookIndex + 1} of ${books.length}`;
  progressText.textContent = `Sentence ${currentSentenceIndex + 1} of ${book.sentences.length}`;

  sentenceDisplay.innerHTML = currentSentenceWords
    .map((word, index) => {
      const currentClass = index === 0 ? "current" : "";
      return `<span class="word ${currentClass}" data-index="${index}">${word}</span>`;
    })
    .join(" ");
}

function highlightWords() {
  const spans = sentenceDisplay.querySelectorAll(".word");

  spans.forEach((span, index) => {
    span.classList.remove("read", "current");

    if (index < currentWordIndex) {
      span.classList.add("read");
    } else if (index === currentWordIndex) {
      span.classList.add("current");
    }
  });
}

function processTranscript(transcript) {
  if (!currentSentenceWords.length || !transcript) return;

  const spokenWords = transcript
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (!spokenWords.length) return;

  let scanIndex = currentWordIndex;
  let matchedAny = false;

  for (let i = 0; i < spokenWords.length && scanIndex < currentSentenceWords.length; i++) {
    const spoken = spokenWords[i];
    const expected = currentSentenceWords[scanIndex];

    if (wordsEquivalent(spoken, expected)) {
      scanIndex++;
      matchedAny = true;
    }
  }

  if (matchedAny && scanIndex > currentWordIndex) {
    currentWordIndex = scanIndex;
    highlightWords();
    setPauseSupportTimers();

    if (currentWordIndex >= currentSentenceWords.length) {
      statusText.textContent = "Well done! You finished the sentence.";
      speakText("Well done.", 0.9);
      stopListening();
      return;
    }

    statusText.textContent = `Good. Next word: ${currentSentenceWords[currentWordIndex]}`;
  }
}

function setupRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    statusText.textContent =
      "Speech recognition is not supported in this browser. Please use Chrome or Edge.";
    return null;
  }

  const recog = new SpeechRecognition();
  recog.lang = "en-ZA";
  recog.continuous = true;
  recog.interimResults = true;
  recog.maxAlternatives = 1;

  recog.onstart = () => {
    isListening = true;
    statusText.textContent = "Listening... read the sentence aloud.";
    setPauseSupportTimers();
  };

  recog.onresult = (event) => {
    let fullTranscript = "";

    for (let i = 0; i < event.results.length; i++) {
      fullTranscript += event.results[i][0].transcript + " ";
    }

    processTranscript(fullTranscript);
  };

  recog.onerror = (event) => {
    if (event.error === "no-speech") {
      statusText.textContent = "I did not hear anything yet. Try reading the sentence.";
      return;
    }

    if (event.error === "aborted") return;

    statusText.textContent = `Listening error: ${event.error}`;
  };

  recog.onend = () => {
    isListening = false;

    if (shouldRestartRecognition) {
      try {
        recog.start();
      } catch (error) {
        console.log("Recognition restart blocked:", error);
      }
    }
  };

  return recog;
}

function startListening() {
  if (!currentSentenceWords.length) {
    statusText.textContent = "Open a book first.";
    return;
  }

  if (!recognition) {
    recognition = setupRecognition();
  }

  if (!recognition) return;

  window.speechSynthesis.cancel();
  shouldRestartRecognition = true;

  try {
    recognition.start();
    statusText.textContent = "Listening... read the sentence aloud.";
  } catch (error) {
    statusText.textContent = "Listening is already active. Please start reading.";
  }
}

function stopListening() {
  clearTimers();
  shouldRestartRecognition = false;
  isListening = false;

  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.log("Recognition stop issue:", error);
    }
  }
}

function restartSentence() {
  const book = books[currentBookIndex];
  if (!book) return;

  currentWordIndex = 0;
  renderSentence();
  statusText.textContent = "Sentence restarted. Press Start Reading.";
}

function nextSentence() {
  const book = books[currentBookIndex];
  if (!book) return;

  if (currentSentenceIndex < book.sentences.length - 1) {
    currentSentenceIndex += 1;
    renderSentence();
    statusText.textContent = "Next sentence ready. Press Start Reading.";
  } else {
    statusText.textContent = "You reached the last sentence in this book.";
    speakText("You finished this book. Great reading.", 0.88);
  }
}

function nextBook() {
  if (currentBookIndex < books.length - 1) {
    openBook(currentBookIndex + 1);
  } else {
    statusText.textContent = "You have reached the last book in the library.";
  }
}

function goBackToLibrary() {
  stopListening();
  readerView.classList.remove("active");
  libraryView.classList.add("active");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedFilter = button.dataset.filter;
    buildBooksGrid();
  });
});

startBtn.addEventListener("click", startListening);

stopBtn.addEventListener("click", () => {
  stopListening();
  statusText.textContent = "Listening stopped.";
});

restartBtn.addEventListener("click", restartSentence);
nextBtn.addEventListener("click", nextSentence);
nextBookBtn.addEventListener("click", nextBook);
backToLibraryBtn.addEventListener("click", goBackToLibrary);

buildBooksGrid();