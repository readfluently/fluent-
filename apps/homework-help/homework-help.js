const instructionInput = document.getElementById("instructionInput");
const questionInput = document.getElementById("questionInput");
const taskType = document.getElementById("taskType");
const learnerAnswer = document.getElementById("learnerAnswer");

const taskHelp = document.getElementById("taskHelp");
const modelAnswer = document.getElementById("modelAnswer");
const statusText = document.getElementById("statusText");

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-ZA";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function detectType(text) {
  text = text.toLowerCase();
  if (text.includes("explain")) return "explain";
  if (text.includes("describe")) return "describe";
  if (text.includes("list")) return "list";
  if (text.includes("compare")) return "compare";
  return "paragraph";
}

function explainTask() {
  let type = taskType.value;
  const combined = instructionInput.value + " " + questionInput.value;

  if (type === "auto") {
    type = detectType(combined);
  }

  let text = "";

  if (type === "explain") {
    text = "Explain = say how or why something happens.\n\nStart → explain → end.";
  }

  if (type === "describe") {
    text = "Describe = give details.\n\nWhat it is → what it looks like → features.";
  }

  if (type === "list") {
    text = "List = short points.\n\nOne idea per line.";
  }

  if (type === "compare") {
    text = "Compare = same + different.\n\nUse 'both' and 'however'.";
  }

  if (type === "paragraph") {
    text = "Paragraph = full sentences.\n\nStart → details → ending.";
  }

  taskHelp.textContent = text;
  statusText.textContent = "Task explained.";
}

function buildModel() {
  const q = questionInput.value.toLowerCase();

  if (q.includes("plants")) {
    return "Plants make food using sunlight, water, and air. This process helps them grow and survive.";
  }

  if (q.includes("water cycle")) {
    return "Water evaporates, forms clouds, and falls as rain. This is the water cycle.";
  }

  return "Start with a clear answer. Add details. End clearly.";
}

document.getElementById("explainBtn").onclick = explainTask;

document.getElementById("readTaskBtn").onclick = () => {
  speak(instructionInput.value + " " + questionInput.value);
};

document.getElementById("submitAttemptBtn").onclick = () => {
  if (!learnerAnswer.value) {
    statusText.textContent = "Try first.";
    return;
  }

  modelAnswer.textContent = buildModel();
  statusText.textContent = "Now compare your answer.";
};

document.getElementById("readMyAnswerBtn").onclick = () => {
  speak(learnerAnswer.value);
};

document.getElementById("readModelBtn").onclick = () => {
  speak(modelAnswer.textContent);
};

document.getElementById("clearBtn").onclick = () => {
  instructionInput.value = "";
  questionInput.value = "";
  learnerAnswer.value = "";
  taskHelp.textContent = "Click Explain Task";
  modelAnswer.textContent = "Model answer will appear after attempt.";
};