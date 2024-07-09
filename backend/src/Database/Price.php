<?php

namespace Database;

class Price extends Model {
    public function getPriceForProduct($productId)
    {
        $stmt = $this->pdo->prepare('SELECT * FROM prices WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
