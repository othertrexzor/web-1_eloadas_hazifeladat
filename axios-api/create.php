<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once "connect.php";

// A React JSON-t küld, ezért így olvassuk be:
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["csapatnev"]) || trim($data["csapatnev"]) === "") {
    echo json_encode(["error" => "A csapatnév kötelező"]);
    exit;
}

$csapatnev = trim($data["csapatnev"]);

try {
    $stmt = $pdo->prepare("INSERT INTO klub (csapatnev) VALUES (:csapatnev)");
    $stmt->execute([
        ":csapatnev" => $csapatnev
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Csapat sikeresen hozzáadva"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
