const speechText = document.getElementById("speechText");
const textFile = document.getElementById("textFile");

const voiceSelect = document.getElementById("voiceSelect");
const rateRange = document.getElementById("rateRange");
const pitchRange = document.getElementById("pitchRange");

const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");

const readBtn = document.getElementById("readBtn");
const selectionBtn = document.getElementById("selectionBtn");
const sentenceBtn = document.getElementById("sentenceBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const clearTextBtn = document.getElementById("clearTextBtn");

const statusBox = document.getElementById("statusBox");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");

let availableVoices = [];
let currentUtterance = null;

let savedSelectionStart = 0;
let savedSelectionEnd = 0;
let savedSelectedText = "";
let mediaRecorder = null;
let recordedChunks = [];
let recordedBlob = null;
let recordedAudioUrl = "";

function setStatus(message) {
  statusBox.textContent = message;
}

function updateCounts() {
  const text = speechText.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = speechText.value.length;

  wordCount.textContent = `${words} word${words === 1 ? "" : "s"}`;
  charCount.textContent = `${chars} character${chars === 1 ? "" : "s"}`;
}

function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  if (!availableVoices.length) {
    const option = document.createElement("option");
    option.textContent = "No voices available";
    option.value = "";
    voiceSelect.appendChild(option);
    return;
  }

  availableVoices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  const preferredIndex = availableVoices.findIndex(
    (voice) =>
      voice.lang.toLowerCase().includes("en") &&
      (
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("aria") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("google")
      )
  );

  if (preferredIndex >= 0) {
    voiceSelect.value = preferredIndex;
  }
}

function stopSpeech() {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

function speakContent(text, statusMessage = "Reading aloud...") {
  const cleanText = text.trim();

  if (!cleanText) {
    setStatus("There is no text to read.");
    return;
  }

  if (!("speechSynthesis" in window)) {
    setStatus("Sorry, text-to-speech is not supported in this browser.");
    return;
  }

  stopSpeech();

  currentUtterance = new SpeechSynthesisUtterance(cleanText);

  const selectedVoice = availableVoices[Number(voiceSelect.value)];
  if (selectedVoice) {
    currentUtterance.voice = selectedVoice;
  }

  currentUtterance.rate = Number(rateRange.value);
  currentUtterance.pitch = Number(pitchRange.value);
  currentUtterance.volume = 1;

  currentUtterance.onstart = () => {
    setStatus(statusMessage);
  };

  currentUtterance.onend = () => {
    setStatus("Finished reading.");
  };

  currentUtterance.onerror = () => {
    setStatus("Something went wrong while trying to read the text.");
  };

  window.speechSynthesis.speak(currentUtterance);
}

function rememberSelection() {
  savedSelectionStart = speechText.selectionStart || 0;
  savedSelectionEnd = speechText.selectionEnd || 0;
  savedSelectedText = speechText.value.substring(savedSelectionStart, savedSelectionEnd).trim();
}

function speakText() {
  speakContent(speechText.value, "Reading full text...");
}

function speakSelection() {
  const selectedNow = speechText.value
    .substring(speechText.selectionStart || 0, speechText.selectionEnd || 0)
    .trim();

  const textToRead = selectedNow || savedSelectedText;

  if (!textToRead) {
    setStatus("Please highlight a word or phrase first.");
    speechText.focus();
    return;
  }

  speakContent(textToRead, "Pronouncing selected text...");
}

function speakCurrentSentence() {
  const text = speechText.value;

  if (!text.trim()) {
    setStatus("Please type, paste, or upload some text first.");
    speechText.focus();
    return;
  }

  const cursorPos = savedSelectionStart || speechText.selectionStart || 0;

  let sentenceStart = 0;
  let sentenceEnd = text.length;

  for (let i = cursorPos - 1; i >= 0; i--) {
    if (/[.!?]/.test(text[i])) {
      sentenceStart = i + 1;
      break;
    }
  }

  for (let i = cursorPos; i < text.length; i++) {
    if (/[.!?]/.test(text[i])) {
      sentenceEnd = i + 1;
      break;
    }
  }

  const sentence = text.slice(sentenceStart, sentenceEnd).trim();

  if (!sentence) {
    setStatus("Could not find a sentence to read.");
    return;
  }

  speakContent(sentence, "Reading current sentence...");
}

textFile.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const isTextFile =
    file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");

  if (!isTextFile) {
    setStatus("Please upload a plain .txt file.");
    textFile.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    speechText.value = e.target.result || "";
    updateCounts();
    setStatus(`Loaded file: ${file.name}`);
  };

  reader.onerror = () => {
    setStatus("The file could not be read.");
  };

  reader.readAsText(file);
});

speechText.addEventListener("input", updateCounts);
speechText.addEventListener("select", rememberSelection);
speechText.addEventListener("click", rememberSelection);
speechText.addEventListener("keyup", rememberSelection);
speechText.addEventListener("mouseup", rememberSelection);
speechText.addEventListener("touchend", rememberSelection);

rateRange.addEventListener("input", () => {
  rateValue.textContent = `${Number(rateRange.value).toFixed(1)}x`;
});

pitchRange.addEventListener("input", () => {
  pitchValue.textContent = Number(pitchRange.value).toFixed(1);
});

readBtn.addEventListener("click", speakText);
selectionBtn.addEventListener("click", speakSelection);
sentenceBtn.addEventListener("click", speakCurrentSentence);

pauseBtn.addEventListener("click", () => {
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    setStatus("Reading paused.");
  }
});

resumeBtn.addEventListener("click", () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    setStatus("Resumed reading.");
  }
});

stopBtn.addEventListener("click", () => {
  stopSpeech();
  setStatus("Reading stopped.");
});

clearTextBtn.addEventListener("click", () => {
  stopSpeech();
  speechText.value = "";
  textFile.value = "";
  savedSelectionStart = 0;
  savedSelectionEnd = 0;
  savedSelectedText = "";
  updateCounts();
  setStatus("Text cleared. Ready for new practice.");
});

updateCounts();
loadVoices();

if ("onvoiceschanged" in window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
