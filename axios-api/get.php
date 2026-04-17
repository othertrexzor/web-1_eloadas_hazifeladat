<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

require "connect.php";

try {
    $stmt = $pdo->query("SELECT id, csapatnev FROM klub ORDER BY id ASC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
