document.addEventListener("DOMContentLoaded", () => {
  const resetEmail = document.getElementById("resetEmail");
  const resetBtn = document.getElementById("resetBtn");
  const resetOtpArea = document.getElementById("resetOtpArea");
  const resetOtpInput = document.getElementById("resetOtpInput");
  const newPassword = document.getElementById("newPassword");
  const resetVerifyBtn = document.getElementById("resetVerifyBtn");

  resetBtn.addEventListener("click", () => {
    const email = resetEmail.value.trim();
    if (!email) {
      alert("Enter your email");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    alert("Your reset OTP is: " + otp);
    sessionStorage.setItem("resetOtp", String(otp));
    sessionStorage.setItem("resetEmail", email);
    resetOtpArea.style.display = "block";
  });

  resetVerifyBtn.addEventListener("click", async () => {
    const inputOtp = resetOtpInput.value.trim();
    const savedOtp = sessionStorage.getItem("resetOtp");
    const email = sessionStorage.getItem("resetEmail");
    const password = newPassword.value;

    if (inputOtp !== savedOtp) {
      alert("Wrong OTP");
      return;
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(password)) {
      alert("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("reset.php", { method: "POST", body: formData });
      const text = await res.text();

      if (text.trim() === "success") {
        alert("Password reset successful! Please log in.");
        window.location.href = "login.html";
      } else {
        alert("Reset failed: " + text);
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Reset failed. Try again.");
    }
  });
});
