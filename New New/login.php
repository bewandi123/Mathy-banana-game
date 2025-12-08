<?php
$conn = new mysqli("localhost", "root", "", "New New");

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  if (password_verify($password, $row['password'])) {
    echo "success";
  } else {
    echo "wrong";
  }
} else {
  echo "notfound";
}

$conn->close();
?>
