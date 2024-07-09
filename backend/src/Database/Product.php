<?php

namespace Database;

class Product extends Model {
    public function getProductsByCategory($category) {
        $sql = 'SELECT * FROM products WHERE category_id = (SELECT id FROM categories WHERE name = :category)';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['category' => $category]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getProductById($id) {
        $stmt = $this->pdo->prepare('SELECT * FROM products WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
