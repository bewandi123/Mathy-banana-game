// Elements
const imgEl = document.getElementById("bananaPuzzle");
const answerEl = document.getElementById("userAnswer");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

// State
let solution = null;
let timeLeft = 45;
let timerId = null;
let answeredThisPuzzle = false; // requires submission before Next

// Query time from URL
function getTimeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const t = parseInt(params.get("time"));
  return Number.isFinite(t) ? t : 45;
}

// Banana API
async function fetchBananaPuzzle() {
  const res = await fetch("https://marcconrad.com/uob/banana/api.php");
  if (!res.ok) throw new Error("Failed to fetch Banana API");
  return await res.json();
}

// Load puzzle
async function initPuzzle() {
  try {
    const data = await fetchBananaPuzzle();
    solution = parseInt(data.solution);
    imgEl.src = data.question;
    answeredThisPuzzle = false; // new puzzle requires submission
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
      document.getElementById("submitBtn").disabled = true;
      // Allow navigation after time is up (still counts as a submission event)
      answeredThisPuzzle = true;
    }
  }, 1000);
}

// Save score to backend and sync running total
async function saveScore(points) {
  try {
    const response = await fetch("save_score.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `score=${encodeURIComponent(points)}`
    });
    const data = await response.json();
    console.log("Backend:", data);
    // If backend returns the new total, sync UI/local
    if (data.total !== undefined) {
      localStorage.setItem("bananaScore", data.total);
      scoreEl.textContent = data.total;
    }
  } catch (err) {
    console.log("save_score error:", err);
  }
}

// Check answer
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

  // Mark that the user submitted (required for Next)
  answeredThisPuzzle = true;

  if (user === solution) {
    const points = Math.max(5, Math.min(20, timeLeft));
    const current = parseInt(localStorage.getItem("bananaScore")) || 0;
    const newTotal = current + points;

    localStorage.setItem("bananaScore", newTotal);
    scoreEl.textContent = newTotal;
    resultEl.textContent = `✅ Correct! +${points} points (Total: ${newTotal})`;

    // Persist to backend running total
    saveScore(points);
  } else {
    resultEl.textContent = "❌ Wrong answer. Try again!";
  }
};

// Navigation
window.goBack = function goBack() {
  history.back();
};

window.goNext = function goNext() {
  // Require a submission before continuing
  if (!answeredThisPuzzle) {
    resultEl.textContent = "⚠️ Please submit your answer before moving on!";
    return;
  }

  const idx = parseInt(sessionStorage.getItem("gameIndex")) || 1;
  const nextIdx = idx + 1;
  sessionStorage.setItem("gameIndex", nextIdx);

  const level = sessionStorage.getItem("level") || "1";
  const limits = { "1": 3, "2": 5, "3": 8 };
  const limit = limits[level];

  if (nextIdx <= limit) {
    const time = level === "1" ? 60 : level === "2" ? 45 : 30;
    window.location.href = `game.html?time=${time}`;
  } else {
    if (level === "1") {
      sessionStorage.setItem("level", "2");
      sessionStorage.setItem("gameIndex", 1);
      window.location.href = "level2.html";
    } else if (level === "2") {
      sessionStorage.setItem("level", "3");
      sessionStorage.setItem("gameIndex", 1);
      window.location.href = "level3.html";
    } else {
      window.location.href = "highscore.html";
    }
  }
};

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  const level = sessionStorage.getItem("level") || "1";
  const gameIndex = parseInt(sessionStorage.getItem("gameIndex")) || 1;

  // Reset only once at the very beginning (Level 1, first puzzle), and mark it
  const resetFlag = sessionStorage.getItem("scoreReset") === "true";
  if (level === "1" && gameIndex === 1 && !resetFlag) {
    localStorage.setItem("bananaScore", 0);
    scoreEl.textContent = "0";
    sessionStorage.setItem("scoreReset", "true"); // prevent repeated resets

    try {
      await fetch("save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "reset=true"
      });
    } catch (e) {
      console.log("Backend reset failed:", e);
    }
  } else {
    const s = parseInt(localStorage.getItem("bananaScore")) || 0;
    scoreEl.textContent = s;
  }

  await initPuzzle();
  startTimer();
});

// Keyboard event
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// Image click fun
imgEl.addEventListener("click", () => {
  resultEl.textContent = "🍌 Come on!....Play Well!....!";
});
