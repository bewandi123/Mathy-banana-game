function goTo(page) {
  window.location.href = page;
}

// Auth
function setUser(email) {
  if (!email) {
    // Guest user
    sessionStorage.setItem("user", "guest");
    resetScore();
    // Reset backend guest score
    fetch("save_score.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "reset=true"
    });
  } else {
    // Registered user
    sessionStorage.setItem("user", email);
    resetScore();
  }
}
function getUser() {
  return sessionStorage.getItem("user") || "guest";
}
function setUserId(id) {
  sessionStorage.setItem("user_id", id);
}
function getUserId() {
  return parseInt(sessionStorage.getItem("user_id")) || 0;
}
function isGuest() {
  return getUser() === "guest";
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
function clearScore() {
  localStorage.removeItem("bananaScore");
}
function resetScore() {
  localStorage.setItem("bananaScore", "0");
}

// Level + index
function setLevel(level) {
  sessionStorage.setItem("level", level);
}
function getLevel() {
  return sessionStorage.getItem("level") || "1";
}
function setGameIndex(idx) {
  sessionStorage.setItem("gameIndex", idx);
}
function getGameIndex() {
  return parseInt(sessionStorage.getItem("gameIndex")) || 1;
}

// Reset all
function resetAll() {
  clearScore();
  sessionStorage.removeItem("gameIndex");
  sessionStorage.removeItem("level");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("user_id");
}

// Show score if present
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("score");
  if (el) el.textContent = getScore();
});

// Expose
window.goTo = goTo;
window.setUser = setUser;
window.getUser = getUser;
window.setUserId = setUserId;
window.getUserId = getUserId;
window.isGuest = isGuest;
window.getScore = getScore;
window.setScore = setScore;
window.addScore = addScore;
window.clearScore = clearScore;
window.resetScore = resetScore;
window.setLevel = setLevel;
window.getLevel = getLevel;
window.setGameIndex = setGameIndex;
window.getGameIndex = getGameIndex;
window.resetAll = resetAll;
