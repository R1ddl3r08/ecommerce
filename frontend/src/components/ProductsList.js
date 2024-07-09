import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../store/shopping-cart-context';
import { groupAttributesBySet } from '../utilities/attributeUtils';
import { toKebabCase } from '../utilities/toKebabCase';

class ProductsList extends Component {
  static contextType = CartContext;

  handleQuickShop = (product) => {
    const { addItemToCart } = this.context;
    const defaultAttributes = {};
    const groupedAttributes = groupAttributesBySet(product.attributes);

    Object.entries(groupedAttributes).forEach(([setName, attributes]) => {
      if (attributes.length > 0) {
        const firstAttribute = attributes[0];
        defaultAttributes[setName] = firstAttribute.id;
      }
    });

    addItemToCart(product, defaultAttributes);
  };

  render() {
    const { products } = this.props;

    return (
      <div className="products-container">
        {products.map((product) => (
          <div className="product" key={product.id} data-testid={`product-${toKebabCase(product.name)}`}>
            <div className={`inner-product ${!product.inStock ? 'not-in-stock' : ''}`}>
              <Link to={`${product.id}`}>
                <div className="image-container">
                  <img src={product.images[0].image_url} alt={`${product.name}`} />
                </div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">{product.price.currency.symbol}{product.price.amount.toFixed(2)}</p>
                </div>
              </Link>
              {product.inStock && (
                <button className="quick-shop" onClick={() => this.handleQuickShop(product)}>
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ProductsList;
