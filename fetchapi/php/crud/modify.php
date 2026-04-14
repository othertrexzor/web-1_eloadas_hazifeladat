<?php
require "../connect/connect.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['poszt-id']) ? trim($_POST['poszt-id']) : '';
    $nev = isset($_POST['poszt-name']) ? trim($_POST['poszt-name']) : '';
}

try {
    $sql = "UPDATE poszt SET nev = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nev, $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Record updated successfully'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
