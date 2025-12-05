document.addEventListener("DOMContentLoaded", async () => {
  const userEmail = sessionStorage.getItem("user") || "guest";
  const score = localStorage.getItem("bananaScore") || "0";

  document.getElementById("currentUser").textContent = userEmail === "guest" ? "you" : userEmail;
  document.getElementById("finalScore").textContent = score;

  try {
    const res = await fetch("highscore_data.php");
    const data = await res.json();

    const board = document.getElementById("leaderboard");
    board.innerHTML = "";

    const seen = new Set(); // ✅ Prevent duplicates

    data.forEach(entry => {
      const key = `${entry.username}-${entry.total_score}`;
      if (seen.has(key)) return;
      seen.add(key);

      const row = document.createElement("div");
      row.className = "winner-row";

      const nameBtn = document.createElement("button");
      nameBtn.className = "name-btn";
      nameBtn.textContent = entry.username;

      const scoreBtn = document.createElement("button");
      scoreBtn.className = "score-btn";
      scoreBtn.textContent = entry.total_score;

      row.appendChild(nameBtn);
      row.appendChild(scoreBtn);
      board.appendChild(row);
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    document.getElementById("leaderboard").textContent = "⚠️ Failed to load leaderboard.";
  }
});

// Navigation helper
function goTo(page) {
  window.location.href = page;
}
window.goTo = goTo;
