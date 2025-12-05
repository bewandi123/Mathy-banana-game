<?php
header('Content-Type: application/json');
session_start();
include 'db.php';

// Always reset guest session
$_SESSION['user_id'] = 0;
$_SESSION['email'] = null;

try {
    // Delete old guest score and insert fresh 0
    $pdo->prepare("DELETE FROM scores WHERE user_id = 0")->execute();
    $pdo->prepare("INSERT INTO scores (user_id, score) VALUES (0, 0)")->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Guest session started, score reset to 0"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
