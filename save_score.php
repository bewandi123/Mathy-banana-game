<?php
header('Content-Type: application/json');
include 'db.php';
session_start();

$user_id = $_SESSION['user_id'] ?? 0;

// Reset score
if (isset($_POST['reset']) && $_POST['reset'] === "true") {
    try {
        $stmt = $pdo->prepare("UPDATE scores SET score = 0 WHERE user_id = ?");
        $stmt->execute([$user_id]);

        if ($stmt->rowCount() === 0) {
            $stmt = $pdo->prepare("INSERT INTO scores (user_id, score) VALUES (?, 0)");
            $stmt->execute([$user_id]);
        }

        echo json_encode(["status" => "success", "message" => "Score reset to 0", "total" => 0]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

// Add points
$points = isset($_POST['score']) ? intval($_POST['score']) : 0;

try {
    $stmt = $pdo->prepare("UPDATE scores SET score = score + ? WHERE user_id = ?");
    $stmt->execute([$points, $user_id]);

    if ($stmt->rowCount() === 0) {
        $stmt = $pdo->prepare("INSERT INTO scores (user_id, score) VALUES (?, ?)");
        $stmt->execute([$user_id, $points]);
        $newTotal = $points;
    } else {
        $stmt = $pdo->prepare("SELECT score FROM scores WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $row = $stmt->fetch();
        $newTotal = $row['score'] ?? 0;
    }

    echo json_encode(["status" => "success", "message" => "Score updated", "total" => $newTotal]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
