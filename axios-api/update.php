<?php

ob_clean();
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "connect.php";

$data_raw = file_get_contents("php://input");
$data = json_decode($data_raw, true);

if (!$data || !isset($data["id"]) || !isset($data["csapatnev"])) {
    echo json_encode(["error" => "Hiányzó adatok", "received" => $data_raw]);
    exit;
}

$id = intval($data["id"]);
$csapatnev = trim($data["csapatnev"]);

try {
    $stmt = $pdo->prepare("UPDATE klub SET csapatnev = :csapatnev WHERE id = :id");
    $stmt->execute([
        ":csapatnev" => $csapatnev,
        ":id" => $id
    ]);

    echo json_encode(["success" => true, "message" => "Sikeres frissítés"]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
