<?php

namespace Database;
require_once __DIR__ . '/../autoload.php';

abstract class Model {
    protected $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function findById($id, $tableName)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM $tableName WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAll($tableName)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM $tableName");
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findByProductId($productId, $tableName)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM $tableName WHERE product_id = :product_id");
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>