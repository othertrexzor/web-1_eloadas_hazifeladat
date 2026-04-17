<?php
ob_clean();
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "connect.php";

$data_raw = file_get_contents("php://input");
$data = json_decode($data_raw, true);

if (!$data || !isset($data["id"])) {
    echo json_encode(["error" => "Hiányzó ID"]);
    exit;
}

$id = intval($data["id"]);

try {
    $stmt = $pdo->prepare("DELETE FROM klub WHERE id = :id");
    $stmt->execute([":id" => $id]);

    echo json_encode(["success" => true, "message" => "Sikeres törlés"]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
