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

function speakText() {
  const text = speechText.value.trim();

  if (!text) {
    setStatus("Please type, paste, or upload some text first.");
    speechText.focus();
    return;
  }

  if (!("speechSynthesis" in window)) {
    setStatus("Sorry, text-to-speech is not supported in this browser.");
    return;
  }

  stopSpeech();

  currentUtterance = new SpeechSynthesisUtterance(text);

  const selectedVoice = availableVoices[Number(voiceSelect.value)];
  if (selectedVoice) {
    currentUtterance.voice = selectedVoice;
  }

  currentUtterance.rate = Number(rateRange.value);
  currentUtterance.pitch = Number(pitchRange.value);
  currentUtterance.volume = 1;

  currentUtterance.onstart = () => {
    setStatus("Reading aloud...");
  };

  currentUtterance.onend = () => {
    setStatus("Finished reading.");
  };

  currentUtterance.onerror = () => {
    setStatus("Something went wrong while trying to read the text.");
  };

  window.speechSynthesis.speak(currentUtterance);
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

rateRange.addEventListener("input", () => {
  rateValue.textContent = `${Number(rateRange.value).toFixed(1)}x`;
});

pitchRange.addEventListener("input", () => {
  pitchValue.textContent = Number(pitchRange.value).toFixed(1);
});

readBtn.addEventListener("click", speakText);

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
  updateCounts();
  setStatus("Text cleared. Ready for new practice.");
});

updateCounts();
loadVoices();

if ("onvoiceschanged" in window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
