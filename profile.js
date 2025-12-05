// Load profile data from backend
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("profile.php");
    const data = await res.json();

    // Show email if logged in, otherwise "you"
    document.getElementById("fullName").textContent =
      (data.email && data.email !== "guest") ? data.email : "you";

    document.getElementById("totalScore").textContent = data.total_score || 0;
  } catch (err) {
    console.error("Failed to load profile:", err);
    document.getElementById("fullName").textContent = "you";
    document.getElementById("totalScore").textContent = "0";
  }
});

// Logout function
async function logoutUser() {
  try {
    const res = await fetch("logout.php");
    const data = await res.json();
    console.log(data);

    // Clear local/session storage
    resetAll();

    // Redirect to start page
    goTo('start.html');
  } catch (err) {
    console.error("Logout failed:", err);
    goTo('start.html'); // fallback
  }
}
