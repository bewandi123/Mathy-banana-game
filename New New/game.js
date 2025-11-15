import { fetchBananaPuzzle } from "./api.js";

// Page elements
const imgEl = document.getElementById("bananaPuzzle");
const answerEl = document.getElementById("userAnswer");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

let solution = null;
let timeLeft = 45; 
let timerId = null;

// Load timer from URL: game.html?time=30
function getTimeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const t = parseInt(params.get("time"));
  return Number.isFinite(t) ? t : 45;
}

// Load puzzle
async function initPuzzle() {
  try {
    const data = await fetchBananaPuzzle();
    solution = parseInt(data.solution);
    imgEl.src = data.question;
    console.log("Puzzle loaded:", data);
  } catch (e) {
    resultEl.textContent = "⚠️ Failed to load puzzle. Check your internet.";
  }
}

// Timer
function startTimer() {
  timeLeft = getTimeFromQuery();
  timeEl.textContent = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      resultEl.textContent = "⏱️ Time's up!";
      // Optionally disable submit
      document.getElementById("submitBtn").disabled = true;
    }
  }, 1000);
}

// Answer check
window.checkAnswer = function checkAnswer() {
  const user = parseInt(answerEl.value);
  if (Number.isNaN(user)) {
    resultEl.textContent = "Please enter a number.";
    return;
  }
  if (solution === null) {
    resultEl.textContent = "Puzzle not ready. Try again.";
    return;
  }

  if (user === solution) {
    // Award based on remaining time to show event-driven logic
    const points = Math.max(5, Math.min(20, timeLeft));
    const current = parseInt(localStorage.getItem("bananaScore")) || 0;
    localStorage.setItem("bananaScore", current + points);

    scoreEl.textContent = localStorage.getItem("bananaScore");
    resultEl.textContent = `✅ Correct! +${points} points`;
  } else {
    resultEl.textContent = "❌ Wrong answer. Try again!";
  }
};

// Navigation controls wired globally
window.goBack = function goBack() {
  history.back();
};

window.goNext = function goNext() {
  // Current puzzle index
  const idx = parseInt(sessionStorage.getItem("gameIndex")) || 1;
  const nextIdx = idx + 1;
  sessionStorage.setItem("gameIndex", nextIdx);

  // Which level are we in?
  const level = sessionStorage.getItem("level") || "1";

  // Puzzle limits per level
  const limits = { "1": 3, "2": 5, "3": 8 };
  const limit = limits[level];

  if (nextIdx <= limit) {
    // Stay in game.html, reload with timer based on level
    const time = level === "1" ? 60 : level === "2" ? 45 : 30;
    window.location.href = `game.html?time=${time}`;
  } else {
    // Finished this level → move to next
    if (level === "1") {
      sessionStorage.setItem("level", "2");
      sessionStorage.setItem("gameIndex", 1);
      window.location.href = "level2.html";
    } else if (level === "2") {
      sessionStorage.setItem("level", "3");
      sessionStorage.setItem("gameIndex", 1);
      window.location.href = "level3.html";
    } else {
      // Finished Level 3 → go to highscore
      window.location.href = "highscore.html";
    }
  }
};


// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Ensure score shows
  const s = parseInt(localStorage.getItem("bananaScore")) || 0;
  if (scoreEl) scoreEl.textContent = s;

  await initPuzzle();
  startTimer();
});



//keyboard event
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// Image click event
imgEl.addEventListener("click", () => {
  resultEl.textContent = "🍌 Come on!....Play Well!....!";
  
});
