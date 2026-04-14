<?php
require "../connect/connect.php";

header('Content-Type: application/json');

try {
    $sql = "SELECT id,nev FROM poszt ORDER BY id ASC";
    $stmt=$pdo->prepare($sql);
    $stmt->execute();
    $posztok = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'posztok' => $posztok
    ]);
} catch (PDOException $e){
    echo json_encode([
        'success' => false,
        'message' => 'Databse error : ' . $e->getMessage()
    ]);
}

?>