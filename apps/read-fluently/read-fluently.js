const books = [
  {
    id: "red-hat",
    title: "The Red Hat",
    level: "Level 1",
    theme: "Everyday Life",
    icon: "🎩",
    description: "A very short beginner reader with simple words and short sentences.",
    sentences: [
      "The hat is red.",
      "Sam has the hat.",
      "Sam puts it on.",
      "The hat is big.",
      "Sam can run."
    ]
  },
  {
    id: "sam-cat",
    title: "Sam the Cat",
    level: "Level 1",
    theme: "Animals",
    icon: "🐱",
    description: "A simple patterned reader for early confidence and clear speaking.",
    sentences: [
      "Sam is a cat.",
      "Sam is fat.",
      "Sam sat on a mat.",
      "Sam can nap.",
      "Sam is happy."
    ]
  },
  {
    id: "big-dog",
    title: "The Big Dog",
    level: "Level 1",
    theme: "Animals",
    icon: "🐶",
    description: "A short animal reader with easy repeated sentence patterns.",
    sentences: [
      "The dog is big.",
      "The dog can run.",
      "The dog has a red ball.",
      "The dog can jump.",
      "The dog is fun."
    ]
  },
  {
    id: "fun-run",
    title: "The Fun Run",
    level: "Level 1",
    theme: "Play",
    icon: "🏃",
    description: "A beginner reading text about movement and play.",
    sentences: [
      "Tim can run.",
      "Pam can run too.",
      "They run to the tree.",
      "They clap and laugh.",
      "The run is fun."
    ]
  },
  {
    id: "lost-ball",
    title: "The Lost Ball",
    level: "Level 2",
    theme: "Play",
    icon: "⚽",
    description: "A short connected story with simple events.",
    sentences: [
      "Tom has a red ball.",
      "He plays in the yard.",
      "The ball rolls away.",
      "Tom runs to find it.",
      "He finds the ball in the grass.",
      "Tom is happy again."
    ]
  },
  {
    id: "park-day",
    title: "A Day at the Park",
    level: "Level 2",
    theme: "Community",
    icon: "🌳",
    description: "A simple reader about a happy trip to the park.",
    sentences: [
      "Lebo goes to the park.",
      "She sees a dog and a ball.",
      "The dog runs fast.",
      "Lebo laughs and plays.",
      "She sits under a tree.",
      "It is a happy day."
    ]
  },
  {
    id: "red-car",
    title: "The Red Car",
    level: "Level 2",
    theme: "Transport",
    icon: "🚗",
    description: "A simple transport story with short linked sentences.",
    sentences: [
      "Dad has a red car.",
      "The car is clean and bright.",
      "We drive to the shop.",
      "I look out of the window.",
      "I see buses and bikes.",
      "Then we drive home."
    ]
  },
  {
    id: "tim-frog",
    title: "Tim and the Frog",
    level: "Level 2",
    theme: "Animals",
    icon: "🐸",
    description: "A short reader that supports fluency through story sequence.",
    sentences: [
      "Tim walks near the pond.",
      "He sees a little frog.",
      "The frog jumps on a rock.",
      "Tim stops and looks.",
      "The frog jumps back in the water.",
      "Tim smiles and waves."
    ]
  },
  {
    id: "brave-dog",
    title: "The Brave Dog",
    level: "Level 3",
    theme: "Character",
    icon: "🐕",
    description: "A short paragraph-style story about courage and kindness.",
    sentences: [
      "Milo was a small dog with a loud bark.",
      "One windy day, the gate blew open.",
      "A tiny kitten stood outside in the cold.",
      "Milo barked until Grandma came to help.",
      "Grandma smiled and carried the kitten inside.",
      "That day, Milo felt brave and proud."
    ]
  },
  {
    id: "rainy-day",
    title: "The Rainy Day",
    level: "Level 3",
    theme: "Weather",
    icon: "🌧️",
    description: "A short story with richer sentences and clear meaning.",
    sentences: [
      "The sky turned dark before lunch.",
      "Soon, soft rain tapped on the roof.",
      "The children moved their game inside the house.",
      "They read books, built towers, and told funny stories.",
      "By the afternoon, the rain had stopped.",
      "A bright rainbow stretched across the sky."
    ]
  },
  {
    id: "new-friend",
    title: "The New Friend",
    level: "Level 4",
    theme: "Friendship",
    icon: "🤝",
    description: "A mini story with fuller ideas for stronger readers.",
    sentences: [
      "On Monday, a new learner joined the class.",
      "Her name was Amina, and she felt shy at first.",
      "At break time, Neo invited her to play a skipping game.",
      "Soon, Amina was smiling and talking with everyone.",
      "By the end of the day, she did not feel alone anymore.",
      "One kind invitation had turned into a new friendship."
    ]
  },
  {
    id: "busy-market",
    title: "The Busy Market",
    level: "Level 4",
    theme: "Community",
    icon: "🛒",
    description: "A mini story with clear descriptive details and sequence.",
    sentences: [
      "On Saturday morning, the market was full of colour and sound.",
      "People walked past fruit stalls, bread tables, and bright flowers.",
      "A boy helped his mother choose tomatoes and fresh spinach.",
      "Nearby, a woman called out the price of sweet oranges.",
      "The smell of warm bread floated through the air.",
      "When they left, their bags were full and their hearts were happy."
    ]
  }
];

const libraryView = document.getElementById("libraryView");
const readerView = document.getElementById("readerView");
const booksGrid = document.getElementById("booksGrid");
const filterChips = document.querySelectorAll(".filter-chip");

const backToLibraryBtn = document.getElementById("backToLibraryBtn");
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

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const CLAP_SOUND_PATH = "../../shared/assets/sounds/clap.mp3";
const clapAudio = new Audio(CLAP_SOUND_PATH);

let activeFilter = "all";
let currentBook = null;
let currentSentenceIndex = 0;
let currentWordIndex = 0;

let recognition = null;
let recognitionRunning = false;
let manualStop = false;
let isListeningMode = false;
let promptInProgress = false;

let silenceInterval = null;
let lastSpeechTime = 0;
let lastPromptTime = 0;
let autoAdvanceTimeout = null;

let assistanceCountThisSentence = 0;
let retryModeForSentence = false;

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[.,!?;:()"']/g, "")
    .trim();
}

function getCurrentSentence() {
  if (!currentBook) return "";
  return currentBook.sentences[currentSentenceIndex] || "";
}

function getCurrentSentenceWords() {
  return getCurrentSentence()
    .split(/\s+/)
    .map(word => word.trim())
    .filter(Boolean);
}

function getExpectedWord() {
  const words = getCurrentSentenceWords();
  return words[currentWordIndex] || "";
}

function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  return (
    voices.find(v => /en-za/i.test(v.lang)) ||
    voices.find(v => /en-gb/i.test(v.lang)) ||
    voices.find(v => /en-us/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    voices[0]
  );
}

function speakText(text, onEnd = null) {
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = getPreferredVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Speech synthesis failed:", error);
    if (onEnd) onEnd();
  }
}

function playClapSound() {
  try {
    clapAudio.currentTime = 0;
    clapAudio.play().catch(error => {
      console.error("Clap sound failed:", error);
    });
  } catch (error) {
    console.error("Clap sound failed:", error);
  }
}

function renderBooks() {
  booksGrid.innerHTML = "";

  const filteredBooks =
    activeFilter === "all"
      ? books
      : books.filter(book => book.level === activeFilter);

  filteredBooks.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-cover-wrap">
        <div class="book-cover">${book.icon}</div>
      </div>
      <div class="book-body">
        <div class="tags">
          <span class="tag">${book.level}</span>
          <span class="tag">${book.theme}</span>
        </div>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-desc">${book.description}</p>
        <p class="book-meta">${book.sentences.length} sentences</p>
        <button class="book-open-btn" data-book-id="${book.id}">
          Open Reader
        </button>
      </div>
    `;

    booksGrid.appendChild(card);
  });

  document.querySelectorAll(".book-open-btn").forEach(button => {
    button.addEventListener("click", () => {
      const bookId = button.getAttribute("data-book-id");
      const selectedBook = books.find(book => book.id === bookId);
      if (selectedBook) {
        openBook(selectedBook);
      }
    });
  });
}

function setActiveFilter(filterValue) {
  activeFilter = filterValue;

  filterChips.forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === filterValue);
  });

  renderBooks();
}

function showLibraryView() {
  stopListening();
  libraryView.classList.add("active");
  readerView.classList.remove("active");
}

function showReaderView() {
  libraryView.classList.remove("active");
  readerView.classList.add("active");
}

function openBook(book) {
  currentBook = book;
  currentSentenceIndex = 0;
  currentWordIndex = 0;
  assistanceCountThisSentence = 0;
  retryModeForSentence = false;

  readerBookCover.textContent = book.icon;
  readerLevelTag.textContent = book.level;
  readerThemeTag.textContent = book.theme;
  readerBookTitle.textContent = book.title;
  readerBookDescription.textContent = book.description;

  const bookNumber = books.findIndex(item => item.id === book.id) + 1;
  bookProgressLabel.textContent = `Book ${bookNumber} of ${books.length}`;

  renderSentence();
  statusText.textContent = "Press Start to begin listening.";
  showReaderView();
}

function renderSentence() {
  if (!currentBook) return;

  const sentence = currentBook.sentences[currentSentenceIndex];
  const words = sentence.split(/\s+/).filter(Boolean);

  sentenceDisplay.innerHTML = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word pending";
    span.textContent = word;
    if (index === 0) {
      span.classList.remove("pending");
      span.classList.add("active");
    }
    sentenceDisplay.appendChild(span);
  });

  sentenceLabel.textContent = `Sentence ${currentSentenceIndex + 1}`;
  progressText.textContent = `Sentence ${currentSentenceIndex + 1} of ${currentBook.sentences.length}`;
  currentWordIndex = 0;
}

function updateWordHighlights() {
  const wordElements = sentenceDisplay.querySelectorAll(".word");

  wordElements.forEach((wordEl, index) => {
    wordEl.classList.remove("active", "correct", "pending");

    if (index < currentWordIndex) {
      wordEl.classList.add("correct");
    } else if (index === currentWordIndex) {
      wordEl.classList.add("active");
    } else {
      wordEl.classList.add("pending");
    }
  });
}

function clearSilenceTimer() {
  if (silenceInterval) {
    clearInterval(silenceInterval);
    silenceInterval = null;
  }
}

function clearAutoAdvance() {
  if (autoAdvanceTimeout) {
    clearTimeout(autoAdvanceTimeout);
    autoAdvanceTimeout = null;
  }
}

function stopRecognitionOnly() {
  manualStop = true;

  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.error("Recognition stop failed:", error);
    }
  }

  recognitionRunning = false;
}

function startRecognitionOnly() {
  if (!recognition) return;

  manualStop = false;

  try {
    recognition.start();
  } catch (error) {
    console.error("Recognition start failed:", error);
  }
}

function promptNextWord() {
  const expectedWord = getExpectedWord();
  if (!expectedWord) return;

  assistanceCountThisSentence += 1;
  lastPromptTime = Date.now();
  promptInProgress = true;

  stopRecognitionOnly();
  statusText.textContent = `Try saying: "${expectedWord}"`;

  speakText(`Try saying ${expectedWord}`, () => {
    promptInProgress = false;
    if (isListeningMode) {
      startRecognitionOnly();
      lastSpeechTime = Date.now();
    }
  });
}

function startSilenceTimer() {
  clearSilenceTimer();
  lastSpeechTime = Date.now();
  lastPromptTime = 0;

  silenceInterval = setInterval(() => {
    if (!isListeningMode || !recognitionRunning || promptInProgress) return;
    if (!currentBook) return;
    if (currentWordIndex >= getCurrentSentenceWords().length) return;

    const now = Date.now();
    const silenceFor = now - lastSpeechTime;
    const sinceLastPrompt = now - lastPromptTime;

    if (silenceFor >= 4000 && sinceLastPrompt >= 4000) {
      promptNextWord();
    }
  }, 400);
}

function getTranscriptWordsFromEvent(event) {
  let transcript = "";

  for (let i = 0; i < event.results.length; i++) {
    transcript += ` ${event.results[i][0].transcript}`;
  }

  return transcript
    .trim()
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
}

function getMatchedPrefixCount(spokenWords, targetWords) {
  let matchCount = 0;

  for (let i = 0; i < Math.min(spokenWords.length, targetWords.length); i++) {
    if (spokenWords[i] === normalizeWord(targetWords[i])) {
      matchCount += 1;
    } else {
      break;
    }
  }

  return matchCount;
}

function maybeForceRetrySentence() {
  if (!retryModeForSentence) return false;

  stopRecognitionOnly();
  clearSilenceTimer();
  clearAutoAdvance();

  statusText.textContent = "Try again. Read the whole sentence.";

  speakText("Try again. Read the whole sentence.", () => {
    currentWordIndex = 0;
    assistanceCountThisSentence = 0;
    retryModeForSentence = false;
    renderSentence();
    updateWordHighlights();

    if (isListeningMode) {
      startRecognitionOnly();
      lastSpeechTime = Date.now();
      statusText.textContent = "Now read the whole sentence again.";
    }
  });

  return true;
}

function finishSentenceReading() {
  stopRecognitionOnly();
  updateWordHighlights();
  clearSilenceTimer();
  clearAutoAdvance();

  if (!currentBook) return;

  if (assistanceCountThisSentence >= 2 && !retryModeForSentence) {
    retryModeForSentence = true;
    maybeForceRetrySentence();
    return;
  }

  if (currentSentenceIndex === currentBook.sentences.length - 1) {
    statusText.textContent = "Excellent reading. You finished the book!";
    playClapSound();
    speakText(`Well done. You finished ${currentBook.title}`);
  } else {
    statusText.textContent = "Excellent reading. Moving to the next sentence...";
    autoAdvanceTimeout = setTimeout(() => {
      moveToNextSentenceAuto();
    }, 1200);
  }
}

function moveToNextSentenceAuto() {
  clearAutoAdvance();

  if (!currentBook) return;

  if (currentSentenceIndex < currentBook.sentences.length - 1) {
    currentSentenceIndex += 1;
    currentWordIndex = 0;
    assistanceCountThisSentence = 0;
    retryModeForSentence = false;
    renderSentence();
    updateWordHighlights();
    statusText.textContent = "Next sentence ready. Start reading.";
    startListening();
  } else {
    statusText.textContent = "Excellent reading. You finished the book!";
    playClapSound();
    speakText(`Well done. You finished ${currentBook.title}`);
  }
}

function handleRecognitionResult(event) {
  lastSpeechTime = Date.now();

  const targetWords = getCurrentSentenceWords();
  const spokenWords = getTranscriptWordsFromEvent(event);
  const matchedPrefix = getMatchedPrefixCount(spokenWords, targetWords);

  if (matchedPrefix > currentWordIndex) {
    currentWordIndex = matchedPrefix;
    updateWordHighlights();
    statusText.textContent = "Good reading. Keep going.";
  }

  if (currentWordIndex >= targetWords.length) {
    finishSentenceReading();
  }
}

function setupRecognition() {
  if (!SpeechRecognition) {
    statusText.textContent = "Speech recognition is not supported here. Use Chrome or Edge.";
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    recognitionRunning = true;
    statusText.textContent = "Listening...";
  };

  recognition.onresult = event => {
    if (!promptInProgress) {
      handleRecognitionResult(event);
    }
  };

  recognition.onerror = event => {
    console.error("Speech recognition error:", event.error);

    if (event.error === "not-allowed") {
      statusText.textContent = "Microphone permission was blocked.";
    } else if (event.error === "no-speech") {
      statusText.textContent = "I did not hear anything yet.";
    } else {
      statusText.textContent = "Listening issue. Please try again.";
    }
  };

  recognition.onend = () => {
    recognitionRunning = false;

    if (isListeningMode && !manualStop && !promptInProgress && currentBook) {
      try {
        recognition.start();
      } catch (error) {
        console.error("Recognition restart failed:", error);
      }
    }
  };

  return true;
}

function startListening() {
  if (!currentBook) return;

  clearAutoAdvance();

  if (!recognition && !setupRecognition()) {
    return;
  }

  stopRecognitionOnly();
  clearSilenceTimer();

  isListeningMode = true;
  promptInProgress = false;
  lastSpeechTime = Date.now();
  lastPromptTime = 0;

  updateWordHighlights();

  try {
    manualStop = false;
    recognition.start();
    startSilenceTimer();
    statusText.textContent = "Listening... Read the yellow word and continue.";
  } catch (error) {
    console.error("Recognition start failed:", error);
    statusText.textContent = "Could not start listening. Try again.";
  }
}

function stopListening() {
  isListeningMode = false;
  promptInProgress = false;
  clearAutoAdvance();
  stopRecognitionOnly();
  clearSilenceTimer();
  statusText.textContent = "Reading stopped.";
}

function restartSentence() {
  stopListening();
  currentWordIndex = 0;
  assistanceCountThisSentence = 0;
  retryModeForSentence = false;
  renderSentence();
  updateWordHighlights();
  statusText.textContent = "Sentence restarted. Press Start to begin again.";
}

function nextSentence() {
  if (!currentBook) return;

  stopListening();

  if (currentSentenceIndex < currentBook.sentences.length - 1) {
    currentSentenceIndex += 1;
    currentWordIndex = 0;
    assistanceCountThisSentence = 0;
    retryModeForSentence = false;
    renderSentence();
    updateWordHighlights();
    statusText.textContent = "Moved to the next sentence.";
  } else {
    statusText.textContent = "You finished this book. Choose another one or go back to the library.";
    playClapSound();
  }
}

startBtn.addEventListener("click", startListening);

stopBtn.addEventListener("click", () => {
  stopListening();
});

restartBtn.addEventListener("click", restartSentence);
nextBtn.addEventListener("click", nextSentence);
backToLibraryBtn.addEventListener("click", showLibraryView);

filterChips.forEach(chip => {
  chip.addEventListener("click", () => {
    setActiveFilter(chip.dataset.filter);
  });
});

window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

renderBooks();
showLibraryView();