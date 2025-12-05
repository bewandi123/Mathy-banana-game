document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const otpArea = document.getElementById("otpArea");

  const forgotLink = document.getElementById("forgotLink");
  const resetArea = document.getElementById("resetArea");
  const resetSendBtn = document.getElementById("resetSendBtn");
  const resetOtpBox = document.getElementById("resetOtpBox");
  const resetSubmitBtn = document.getElementById("resetSubmitBtn");

  // Login
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;

    if (!email || !pass) {
      alert("Enter email and password");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", pass);

    try {
      const res = await fetch("login.php", { method: "POST", body: formData });
      const text = (await res.text()).trim();

      if (text === "success") {
        const otp = Math.floor(100000 + Math.random() * 900000);
        alert("Your OTP is: " + otp);
        sessionStorage.setItem("otp", String(otp));
        sessionStorage.setItem("loginEmail", email);
        otpArea.style.display = "block";
      } else {
        alert("Login failed: " + text);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Try again.");
    }
  });

  // OTP verify
  verifyBtn.addEventListener("click", () => {
    const input = document.getElementById("otpInput").value.trim();
    const savedOtp = sessionStorage.getItem("otp");

    if (input && savedOtp && input === savedOtp) {
      alert("Login successful!");
      setUser(sessionStorage.getItem("loginEmail")); // resets score locally
      resetScore(); // frontend reset
      goTo("levels.html");
    } else {
      alert("Wrong OTP");
    }
  });

  // Forgot password: show section
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    resetArea.style.display = "block";
  });

  // Send reset OTP
  resetSendBtn.addEventListener("click", () => {
    const email = document.getElementById("resetEmail").value.trim();
    if (!email) {
      alert("Enter your email");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    alert("Your reset OTP is: " + otp);
    sessionStorage.setItem("resetOtp", String(otp));
    sessionStorage.setItem("resetEmail", email);
    resetOtpBox.style.display = "block";
  });

  // Submit new password
  resetSubmitBtn.addEventListener("click", async () => {
    const inputOtp = document.getElementById("resetOtpInput").value.trim();
    const savedOtp = sessionStorage.getItem("resetOtp");
    const email = sessionStorage.getItem("resetEmail");
    const password = document.getElementById("newPassword").value;

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
      const text = (await res.text()).trim();

      if (text === "success") {
        alert("Password reset successful! Please log in.");
        resetArea.style.display = "none";
        resetOtpBox.style.display = "none";
        document.getElementById("resetEmail").value = "";
        document.getElementById("resetOtpInput").value = "";
        document.getElementById("newPassword").value = "";
      } else {
        alert("Reset failed: " + text);
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Reset failed. Try again.");
    }
  });
});
