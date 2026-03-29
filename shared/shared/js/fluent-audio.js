const FluentAudio = (() => {
  let currentAudio = null;
  let currentUtterance = null;

  function stopAll() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    currentUtterance = null;
  }

  function playFile(src) {
    return new Promise((resolve, reject) => {
      stopAll();

      const audio = new Audio(src);
      currentAudio = audio;

      audio.addEventListener("ended", () => {
        resolve();
      });

      audio.addEventListener("error", (err) => {
        reject(err);
      });

      audio.play().catch(reject);
    });
  }

  function speakText(text, options = {}) {
    return new Promise((resolve, reject) => {
      stopAll();

      if (!("speechSynthesis" in window)) {
        reject(new Error("Speech synthesis not supported."));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 0.92;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.lang = options.lang ?? "en-ZA";

      currentUtterance = utterance;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      window.speechSynthesis.speak(utterance);
    });
  }

  async function playWithFallback(fileSrc, fallbackText, options = {}) {
    try {
      await playFile(fileSrc);
    } catch (err) {
      if (fallbackText) {
        try {
          await speakText(fallbackText, options);
        } catch (ttsErr) {
          console.warn("Audio file and TTS both failed.", ttsErr);
        }
      }
    }
  }

  return {
    stopAll,
    playFile,
    speakText,
    playWithFallback
  };
})();