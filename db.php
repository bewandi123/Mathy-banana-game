<?php
$host = "localhost";
$db   = "new_new"; // change if your DB name differs
$user = "root";        // default XAMPP user
$pass = "";            // default XAMPP password is empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(["status" => "error", "message" => "DB connection failed: " . $e->getMessage()]));
}
