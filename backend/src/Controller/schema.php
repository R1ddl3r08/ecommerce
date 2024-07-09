<?php

require_once __DIR__ . '/../autoload.php';

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\InputObjectType;

use Database\Category;
use Database\Currency;
use Database\Price;
use Database\AttributeSet;
use Database\Attribute;
use Database\Gallery;
use Database\Product;
use Database\Order;

$category = new Category();
$currency = new Currency();
$price = new Price();
$attributeSet = new AttributeSet();
$attribute = new Attribute();
$gallery = new Gallery();
$product = new Product();
$order = new Order();

$categoryType = new ObjectType([
    'name' => 'Category',
    'fields' => [
        'id' => ['type' => Type::int()],
        'name' => ['type' => Type::string()],
    ],
]);

$currencyType = new ObjectType([
    'name' => 'Currency',
    'fields' => [
        'id' => ['type' => Type::int()],
        'label' => ['type' => Type::string()],
        'symbol' => ['type' => Type::string()]
    ]
]);

$priceType = new ObjectType([
    'name' => 'Price',
    'fields' => [
        'amount' => ['type' => Type::float()],
        'currency' => [
            'type' => $currencyType,
            'resolve' => function ($price) use ($currency) {
                return $currency->findById($price['currency_id'], 'currencies');
            },
        ],
    ],
]);

$attributeSetType = new ObjectType([
    'name' => 'AttributeSet',
    'fields' => [
        'id' => ['type' => Type::int()],
        'name' => ['type' => Type::string()],
        'type' => ['type' => Type::string()],
    ]
]);

$attributeType = new ObjectType([
    'name' => 'Attribute',
    'fields' => [
        'id' => ['type' => Type::int()],
        'display_value' => ['type' => Type::string()],
        'value' => ['type' => Type::string()],
        'attribute_set' => [
            'type' => $attributeSetType,
            'resolve' => function ($attribute) use ($attributeSet) {
                return $attributeSet->findById($attribute['attribute_set_id'], 'attribute_sets');
            }
        ],
    ],
]);

$galleryType = new ObjectType([
    'name' => 'Gallery',
    'fields' => [
        'id' => ['type' => Type::int()],
        'image_url' => ['type' => Type::string()],
    ]
]);

$productType = new ObjectType([
    'name' => 'Product',
    'fields' => [
        'id' => ['type' => Type::string()],
        'name' => ['type' => Type::string()],
        'inStock' => ['type' => Type::boolean()],
        'description' => ['type' => Type::string()],
        'brand' => ['type' => Type::string()],
        'price' => [
            'type' => $priceType,
            'resolve' => function ($product) use ($price) {
                return $price->getPriceForProduct($product['id']);
            },
        ],
        'attributes' => [
            'type' => Type::listOf($attributeType),
            'resolve' => function ($product) use ($attribute) {
                return $attribute->getAttributesForProduct($product['id']);
            },
        ],
        'category' => [
            'type' => $categoryType,
            'resolve' => function ($product) use ($category) {
                return $category->findById($product['category_id'], 'categories');
            },
        ],
        'images' => [
            'type' => Type::listOf($galleryType),
            'resolve' => function ($product) use ($gallery) {
                return $gallery->findByProductId($product['id'], 'galleries');
            },
        ],
    ],
]);

$orderItemAttributeType = new ObjectType([
    'name' => 'OrderItemAttribute',
    'fields' => [
        'id' => ['type' => Type::int()],
        'order_item_id' => ['type' => Type::int()],
        'attribute_id' => ['type' => Type::int()],
    ],
]);

$orderItemType = new ObjectType([
    'name' => 'OrderItem',
    'fields' => [
        'id' => ['type' => Type::int()],
        'order_id' => ['type' => Type::int()],
        'product_id' => ['type' => Type::string()],
        'quantity' => ['type' => Type::int()],
        'price' => ['type' => Type::float()],
        'attributes' => [
            'type' => Type::listOf($orderItemAttributeType),
            'resolve' => function ($orderItem) use ($order) {
                return $order->getOrderItemAttributes($orderItem['id']);
            },
        ],
    ],
]);

$orderType = new ObjectType([
    'name' => 'Order',
    'fields' => [
        'id' => ['type' => Type::int()],
        'total' => ['type' => Type::float()],
        'items' => [
            'type' => Type::listOf($orderItemType),
            'resolve' => function ($parentOrder) use ($order) {
                return $order->getOrderItems($parentOrder['id']);
            },
        ],
    ],
]);

$orderItemAttributeInputType = new InputObjectType([
    'name' => 'OrderItemAttributeInput',
    'fields' => [
        'attribute_id' => ['type' => Type::int()],
    ],
]);

$orderItemInputType = new InputObjectType([
    'name' => 'OrderItemInput',
    'fields' => [
        'product_id' => ['type' => Type::string()],
        'quantity' => ['type' => Type::int()],
        'price' => ['type' => Type::float()],
        'attributes' => ['type' => Type::listOf($orderItemAttributeInputType)],
    ],
]);

$orderInputType = new InputObjectType([
    'name' => 'OrderInput',
    'fields' => [
        'total' => ['type' => Type::float()],
        'items' => ['type' => Type::listOf($orderItemInputType)],
    ],
]);

$mutationType = new ObjectType([
    'name' => 'Mutation',
    'fields' => [
        'createOrder' => [
            'type' => $orderType,
            'args' => [
                'input' => ['type' => Type::nonNull($orderInputType)],
            ],
            'resolve' => function ($root, $args, $context, $info) use ($order) {
                return $order->createOrder($args['input']);
            },
        ],
    ],
]);

$queryType = new ObjectType([
    'name' => 'Query',
    'fields' => [
        'products' => [
            'type' => Type::listOf($productType),
            'args' => [
                'category' => Type::string()
            ],
            'resolve' => function ($root, $args, $context, $info) use ($product) {
                return $product->getProductsByCategory($args['category']);
            }
        ],
        'categories' => [
            'type' => Type::listOf($categoryType),
            'resolve' => function ($root, $args, $context, $info) use ($category) {
                return $category->getAll('categories');
            }
        ],
        'product' => [
            'type' => $productType,
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => function ($root, $args, $context, $info) use ($product) {
                return $product->findById($args['id'], 'products');
            }
        ]
    ],
]);

$schema = new \GraphQL\Type\Schema([
    'query' => $queryType,
    'mutation' => $mutationType
]);


?>