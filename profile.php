<?php
header('Content-Type: application/json');
session_start();
require 'db.php';

// Default values
$email = "guest";
$total_score = 0;

// If logged in, use session email
if (isset($_SESSION['email']) && $_SESSION['email']) {
    $email = $_SESSION['email'];
}

// Determine user_id (registered user or guest)
$user_id = $_SESSION['user_id'] ?? 0;

try {
    // Ensure a score row exists
    $stmt = $pdo->prepare("SELECT score FROM scores WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $row = $stmt->fetch();

    if ($row) {
        $total_score = intval($row['score']);
    } else {
        // Create a row if missing
        $ins = $pdo->prepare("INSERT INTO scores (user_id, score) VALUES (?, 0)");
        $ins->execute([$user_id]);
        $total_score = 0;
    }

    echo json_encode([
        "status" => "success",
        "email" => $email,
        "total_score" => $total_score
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "email" => $email,
        "total_score" => 0
    ]);
}
