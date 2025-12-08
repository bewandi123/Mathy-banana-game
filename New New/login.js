document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = loginEmail.value;
  const pass = loginPassword.value;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", pass);

  const res = await fetch("login.php", { method: "POST", body: formData });
  const text = await res.text();

  if (text === "success") {
    alert("Login successful!");
    window.location.href = "levels.html";
  } else {
    alert("Login failed: " + text);
  }
});
