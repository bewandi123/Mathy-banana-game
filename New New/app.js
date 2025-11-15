// Simple navigation helper
function goTo(page) {
  window.location.href = page;
}

// Auth 
function setUser(user) {
  sessionStorage.setItem("user", user);
}
function getUser() {
  return sessionStorage.getItem("user") || "guest";
}

// Score 
function getScore() {
  return parseInt(localStorage.getItem("bananaScore")) || 0;
}
function setScore(val) {
  localStorage.setItem("bananaScore", parseInt(val));
}
function addScore(points) {
  setScore(getScore() + points);
}

// Level 
function setLevel(level) {
  sessionStorage.setItem("level", level); // "1" | "2" | "3"
}
function getLevel() {
  return sessionStorage.getItem("level") || "1";
}

// Game index within a level (1..n)
function setGameIndex(idx) {
  sessionStorage.setItem("gameIndex", idx);
}
function getGameIndex() {
  return parseInt(sessionStorage.getItem("gameIndex")) || 1;
}

// Reset everything (used on goodbye or new run)
function resetAll() {
  localStorage.removeItem("bananaScore");
  sessionStorage.removeItem("gameIndex");
  sessionStorage.removeItem("level");
}

// Show current score if the element exists
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("score");
  if (el) el.textContent = getScore();
});

// Increasing game puzzeles
function setLevel(level) {
  sessionStorage.setItem("level", level);
  sessionStorage.setItem("puzzleIndex", "1");
}

function getLevel() {
  return sessionStorage.getItem("level") || "1";
}

function getPuzzleIndex() {
  return parseInt(sessionStorage.getItem("puzzleIndex")) || 1;
}

function advancePuzzle() {
  let index = getPuzzleIndex();
  index++;
  sessionStorage.setItem("puzzleIndex", index);

  const level = getLevel();
  const max = level === "1" ? 3 : level === "2" ? 5 : 8;

  if (index > max) {
    window.location.href = "highscore.html";
  } else {
    window.location.href = "game.html";
  }
}
