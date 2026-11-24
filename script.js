// ─────────────────────────────────────────────
// DATOS DEL QUIZ (basado en JSON)
// ─────────────────────────────────────────────
const quizData = {
  timePerQuestion: 60,
  questions: [
    {
      game: "Gears of War",
      question: "¿Cuál es el nombre del protagonista principal de Gears of War?",
      options: ["Marcus Fenix", "Dom Santiago", "Cole Train", "Baird"],
      correctAnswer: 0
    },
    {
      game: "Gears of War",
      question: "¿Cómo se llama el enemigo principal en Gears of War?",
      options: ["Covenant", "Locust Horde", "Flood", "Tyranids"],
      correctAnswer: 1
    },
    {
      game: "Halo",
      question: "¿Cómo se llama el protagonista de la saga Halo?",
      options: ["jefe maestro", "Sgt. Johnson", "Arbiter", "Noble Six"],
      correctAnswer: 0
    },
    {
      game: "Halo",
      question: "¿Cuál es el nombre de la IA compañera de jefe maestro?",
      options: ["Cortana", "Siri", "Aurora", "Aris"],
      correctAnswer: 0
    },
    {
      game: "Fortnite",
      question: "¿Cuántos jugadores hay en una partida estándar de Battle Royale?",
      options: ["50", "75", "100", "150"],
      correctAnswer: 2
    },
    {
      game: "Fortnite",
      question: "¿Qué compañía desarrolló Fortnite?",
      options: ["Epic Games", "Riot Games", "Activision", "Ubisoft"],
      correctAnswer: 0
    },
    {
      game: "GTA 5",
      question: "¿Cuántos protagonistas jugables tiene GTA 5 en su modo historia?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2
    },
    {
      game: "GTA 5",
      question: "¿En qué ciudad ficticia se desarrolla GTA 5?",
      options: ["Liberty City", "Los Santos", "Vice City", "San Fierro"],
      correctAnswer: 1
    },
    {
      game: "GTA 5",
      question: "¿Cómo se llama el perro de Franklin en GTA 5?",
      options: ["Chop", "Rex", "Buddy", "Max"],
      correctAnswer: 0
    },
    {
      game: "GTA 6",
      question: "¿En qué estado ficticio se ambienta GTA 6 según los tráilers?",
      options: ["San Andreas", "Leonida", "Liberty", "Alderney"],
      correctAnswer: 1
    },
    {
      game: "GTA 6",
      question: "¿Cómo se llama la protagonista femenina confirmada de GTA 6?",
      options: ["Lucia", "Catalina", "Maria", "Rosa"],
      correctAnswer: 0
    },
    {
      game: "Call of Duty",
      question: "¿Qué subtítulo tiene el primer Modern Warfare de 2007?",
      options: ["Modern Warfare", "Black Ops", "Ghosts", "Advanced Warfare"],
      correctAnswer: 0
    },
    {
      game: "Minecraft",
      question: "¿Cuál es el material más resistente para herramientas en Minecraft?",
      options: ["Diamante", "Netherite", "Hierro", "Oro"],
      correctAnswer: 1
    },
    {
      game: "The Legend of Zelda",
      question: "¿Cómo se llama el protagonista de la saga Zelda?",
      options: ["Zelda", "Link", "Ganon", "Navi"],
      correctAnswer: 1
    },
    {
      game: "God of War",
      question: "¿En qué mitología se basa God of War (2018)?",
      options: ["Griega", "Nórdica", "Egipcia", "Romana"],
      correctAnswer: 1
    }
  ]
};

// ─────────────────────────────────────────────
// ESTADO
// ─────────────────────────────────────────────
let currentIndex = 0;
let score = 0;
let answers = [];
let isAnswered = false;
let timeLeft = quizData.timePerQuestion;
let timerInterval = null;

// ─────────────────────────────────────────────
// REFERENCIAS AL DOM
// ─────────────────────────────────────────────
const startScreen   = document.getElementById("start-screen");
const quizScreen    = document.getElementById("quiz-screen");
const resultScreen  = document.getElementById("result-screen");

const startBtn      = document.getElementById("start-btn");
const nextBtn       = document.getElementById("next-btn");
const restartBtn    = document.getElementById("restart-btn");

const questionCounter = document.getElementById("question-counter");
const gameBadge       = document.getElementById("game-badge");
const progressFill    = document.getElementById("progress-fill");
const timerText       = document.getElementById("timer-text");
const questionText    = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedback        = document.getElementById("feedback");

const finalScore   = document.getElementById("final-score");
const correctCount = document.getElementById("correct-count");
const accuracy     = document.getElementById("accuracy");
const resultMessage = document.getElementById("result-message");
const summaryList  = document.getElementById("summary-list");

// ─────────────────────────────────────────────
// INICIO
// ─────────────────────────────────────────────
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);

function startQuiz() {
  currentIndex = 0;
  score = 0;
  answers = [];
  isAnswered = false;

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestion();
}

// ─────────────────────────────────────────────
// CARGAR PREGUNTA
// ─────────────────────────────────────────────
function loadQuestion() {
  isAnswered = false;
  const q = quizData.questions[currentIndex];
  const total = quizData.questions.length;

  // Progreso
  questionCounter.textContent = `Pregunta ${currentIndex + 1} / ${total}`;
  gameBadge.textContent = q.game;
  progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;

  // Pregunta
  questionText.textContent = q.question;

  // Opciones
  optionsContainer.innerHTML = "";
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.addEventListener("click", () => selectAnswer(index));
    optionsContainer.appendChild(btn);
  });

  // Feedback y botón siguiente
  feedback.classList.add("hidden");
  feedback.className = "feedback hidden";
  nextBtn.classList.add("hidden");

  // Timer
  resetTimer();
}

// ─────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────
function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = quizData.timePerQuestion;
  updateTimerText();

  timerInterval = setInterval(() => {
    if (isAnswered) return;
    timeLeft--;
    updateTimerText();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeOut();
    }
  }, 1000);
}

function updateTimerText() {
  timerText.textContent = `${timeLeft}s`;
  timerText.classList.toggle("low", timeLeft <= 10);
}

// ─────────────────────────────────────────────
// RESPONDER
// ─────────────────────────────────────────────
function selectAnswer(index) {
  if (isAnswered) return;
  isAnswered = true;
  clearInterval(timerInterval);

  const q = quizData.questions[currentIndex];
  const isCorrect = index === q.correctAnswer;

  if (isCorrect) score++;

  answers.push({
    question: q.question,
    selected: index,
    correct: q.correctAnswer,
    isCorrect,
    timedOut: false
  });

  paintOptions(index);
  showFeedback(isCorrect, q);

  nextBtn.classList.remove("hidden");
  nextBtn.textContent =
    currentIndex >= quizData.questions.length - 1
      ? "Ver Resultados 🏁"
      : "Siguiente Pregunta →";
}

// ─────────────────────────────────────────────
// TIEMPO AGOTADO
// ─────────────────────────────────────────────
function timeOut() {
  if (isAnswered) return;
  isAnswered = true;

  const q = quizData.questions[currentIndex];
  score--; // penalización

  answers.push({
    question: q.question,
    selected: null,
    correct: q.correctAnswer,
    isCorrect: false,
    timedOut: true
  });

  paintOptions(null);

  feedback.textContent = `⏰ ¡Tiempo agotado! La respuesta correcta es: ${q.options[q.correctAnswer]}`;
  feedback.className = "feedback error";

  nextBtn.classList.remove("hidden");
  nextBtn.textContent =
    currentIndex >= quizData.questions.length - 1
      ? "Ver Resultados 🏁"
      : "Siguiente Pregunta →";
}

// ─────────────────────────────────────────────
// PINTAR OPCIONES
// ─────────────────────────────────────────────
function paintOptions(selectedIndex) {
  const q = quizData.questions[currentIndex];
  const buttons = optionsContainer.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctAnswer) {
      btn.classList.add("correct");
    } else if (i === selectedIndex) {
      btn.classList.add("wrong");
    } else {
      btn.classList.add("dimmed");
    }
  });
}

// ─────────────────────────────────────────────
// FEEDBACK
// ─────────────────────────────────────────────
function showFeedback(isCorrect, q) {
  if (isCorrect) {
    feedback.textContent = "🎉 ¡Correcto! +1 punto";
    feedback.className = "feedback success";
  } else {
    feedback.textContent = `❌ Incorrecto. La respuesta correcta es: ${q.options[q.correctAnswer]}`;
    feedback.className = "feedback error";
  }
}

// ─────────────────────────────────────────────
// SIGUIENTE PREGUNTA
// ─────────────────────────────────────────────
function nextQuestion() {
  if (currentIndex >= quizData.questions.length - 1) {
    showResults();
  } else {
    currentIndex++;
    loadQuestion();
  }
}

// ─────────────────────────────────────────────
// RESULTADOS
// ─────────────────────────────────────────────
function showResults() {
  clearInterval(timerInterval);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const total = quizData.questions.length;
  const corrects = answers.filter(a => a.isCorrect).length;
  const percentage = Math.max(0, Math.round((score / total) * 100));

  finalScore.textContent = score;
  correctCount.textContent = corrects;
  accuracy.textContent = `${percentage}%`;

  if (percentage >= 90) {
    resultMessage.textContent = "¡LEYENDA GAMER! 🏆";
    resultMessage.style.color = "#facc15";
  } else if (percentage >= 70) {
    resultMessage.textContent = "¡Gran Jugador! 🎮";
    resultMessage.style.color = "#4ade80";
  } else if (percentage >= 50) {
    resultMessage.textContent = "No está mal, sigue practicando 💪";
    resultMessage.style.color = "#22d3ee";
  } else {
    resultMessage.textContent = "Necesitas más horas de juego 😅";
    resultMessage.style.color = "#f87171";
  }

  // Resumen
  summaryList.innerHTML = "";
  answers.forEach((ans, i) => {
    const item = document.createElement("div");
    item.className = `summary-item ${ans.isCorrect ? "correct" : "wrong"}`;

    let html = `<p><strong>${i + 1}. ${ans.question}</strong></p>`;

    if (ans.timedOut) {
      html += `<p><span class="label">Tu respuesta:</span> ⏰ Tiempo agotado</p>`;
    } else {
      const yourAnswer = quizData.questions[i].options[ans.selected];
      html += `<p><span class="label">Tu respuesta:</span> ${yourAnswer}</p>`;
    }

    if (!ans.isCorrect) {
      const correctAnswer = quizData.questions[i].options[ans.correct];
      html += `<p><span class="label">Correcta:</span> ${correctAnswer}</p>`;
    }

    item.innerHTML = html;
    summaryList.appendChild(item);
  });
}