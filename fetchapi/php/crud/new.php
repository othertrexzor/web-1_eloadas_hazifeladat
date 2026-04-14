<?php
require "../connect/connect.php";

header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD']==='POST'){
    $id = isset($_POST['poszt-id'])? trim($_POST['poszt-id']) : '';
    $nev = isset($_POST['poszt-name'])? trim($_POST['poszt-name']) : '';
}
try {
    $sql = "INSERT INTO poszt (nev) VALUES (?)";
    $stmt =  $pdo->prepare($sql);
    $stmt -> execute([$nev]);

    echo json_encode([
        'success' =>true,
        'message' => 'Successfull!'
    ]);
} catch (PDOException $e){
    echo json_encode([
        'success' => false
    ]);
}

?>