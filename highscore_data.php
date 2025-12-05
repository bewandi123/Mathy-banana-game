<?php
header('Content-Type: application/json');
include 'db.php';

$query = "
  SELECT 
    COALESCE(u.email, 'guest') AS username,
    SUM(s.score) AS total_score
  FROM scores s
  LEFT JOIN users u ON s.user_id = u.id
  GROUP BY username
  ORDER BY total_score DESC
  LIMIT 20
";

try {
  $stmt = $pdo->query($query);
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($rows);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
