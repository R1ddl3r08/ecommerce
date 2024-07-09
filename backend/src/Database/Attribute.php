<?php

namespace Database;

class Attribute extends Model {
    public function getAttributesForProduct($productId)
    {
        $stmt = $this->pdo->prepare('
            SELECT a.* 
            FROM attributes a
            JOIN items i ON a.id = i.attribute_id
            WHERE i.product_id = :product_id
        ');
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>
