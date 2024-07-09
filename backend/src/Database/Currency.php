<?php

namespace Database;

class Currency extends Model {
    public function getCurrencyById($currencyId) {
        $stmt = $this->pdo->prepare('SELECT * FROM currencies WHERE id = :id');
        $stmt->execute(['id' => $currencyId]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
