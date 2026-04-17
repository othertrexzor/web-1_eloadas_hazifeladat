<?php
//Adatbázishoz csatlakozás
$host = "localhost";
$dbname = "nb1";
$username = "nb1";
$password = "A123.B456";

try{
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8",$username,$password);
    //Hibakezelés
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e){
    die("Database error: " . $e->getMessage());
}

?>