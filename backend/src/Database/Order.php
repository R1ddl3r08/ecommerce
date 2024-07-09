<?php

namespace Database;

class Order extends Model {
    public function createOrder($input) {
        try {
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("INSERT INTO orders (total) VALUES (:total)");
            $stmt->execute(['total' => $input['total']]);
            $orderId = $this->pdo->lastInsertId();

            foreach ($input['items'] as $item) {
                $stmt = $this->pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:order_id, :product_id, :quantity, :price)");
                $stmt->execute([
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
                $orderItemId = $this->pdo->lastInsertId();

                if (!empty($item['attributes'])) {
                    foreach ($item['attributes'] as $attribute) {
                        $stmt = $this->pdo->prepare("INSERT INTO order_item_attributes (order_item_id, attribute_id) VALUES (:order_item_id, :attribute_id)");
                        $stmt->execute([
                            'order_item_id' => $orderItemId,
                            'attribute_id' => $attribute['attribute_id']
                        ]);
                    }
                }
            }

            $this->pdo->commit();

            return $this->getOrderById($orderId);

        } catch (\Exception $e) {
            $this->pdo->rollBack();
            error_log($e->getMessage());
            throw new \Exception("Internal server error");
        }
    }

    public function getOrderById($orderId) {
        $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->execute(['id' => $orderId]);
        $order = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($order) {
            $order['items'] = $this->getOrderItems($orderId);
        }

        return $order;
    }

    public function getOrderItems($orderId) {
        $stmt = $this->pdo->prepare('SELECT * FROM order_items WHERE order_id = :orderId');
        $stmt->execute(['orderId' => $orderId]);
        $items = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($items as &$item) {
            $item['attributes'] = $this->getOrderItemAttributes($item['id']);
        }

        return $items;
    }

    public function getOrderItemAttributes($orderItemId) {
        $stmt = $this->pdo->prepare('SELECT * FROM order_item_attributes WHERE order_item_id = :orderItemId');
        $stmt->execute(['orderItemId' => $orderItemId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>
