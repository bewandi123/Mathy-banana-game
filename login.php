<?php
session_start();

$conn = new mysqli("localhost", "root", "", "new_new");
if ($conn->connect_error) {
  http_response_code(500);
  echo "error: db connection";
  exit;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if ($email === '' || $password === '') {
  echo "error: missing fields";
  $conn->close();
  exit;
}

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
  echo "error: user not found";
  $stmt->close();
  $conn->close();
  exit;
}

$stmt->bind_result($userId, $hashedPassword);
$stmt->fetch();
$stmt->close();

if (!password_verify($password, $hashedPassword)) {
  echo "error: wrong password";
  $conn->close();
  exit;
}

// Success: set session
$_SESSION['user_id'] = $userId;
$_SESSION['email'] = $email;

// Reset score in DB at login
$conn->query("DELETE FROM scores WHERE user_id = $userId");
$conn->query("INSERT INTO scores (user_id, score) VALUES ($userId, 0)");

echo "success";
$conn->close();
