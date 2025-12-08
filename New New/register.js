document.getElementById("registerBtn").addEventListener("click", async () => {
  const name = regName.value;
  const email = regEmail.value;
  const pass = regPassword.value;
  const confirm = regConfirm.value;

  if (pass !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", pass);

  const res = await fetch("register.php", { method: "POST", body: formData });
  const text = await res.text();

  if (text === "success") {
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    alert("Error: " + text);
  }
});
