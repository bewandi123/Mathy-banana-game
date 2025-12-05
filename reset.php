<?php
session_start();
$conn = new mysqli("localhost", "root", "", "new_new");
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$passwordRaw = isset($_POST['password']) ? $_POST['password'] : '';

if ($email === '' || $passwordRaw === '') {
  echo "error: missing fields";
  $conn->close();
  exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
  echo "error: user not found";
  $check->close();
  $conn->close();
  exit;
}
$check->close();

$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

$update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$update->bind_param("ss", $password, $email);

if ($update->execute()) {
  echo "success";
} else {
  echo "error: " . $update->error;
}

$update->close();
$conn->close();
