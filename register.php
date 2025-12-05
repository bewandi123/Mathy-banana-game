<?php
session_start();
$conn = new mysqli("localhost", "root", "", "new_new");
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
  echo "already registered"; // ✅ clear message for frontend
  exit;
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $password);

if ($stmt->execute()) {
  $_SESSION['user_id'] = $stmt->insert_id;
  $_SESSION['email'] = $email;
  echo "success";
} else {
  echo "Registration failed: " . $stmt->error;
}

$conn->close();
?>
