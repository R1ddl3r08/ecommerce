import React, { Component } from 'react';
import { groupAttributesBySet } from '../utilities/attributeUtils';
import AttributeSet from './AttributeSet';
import { CartContext } from '../store/shopping-cart-context';

class CartItem extends Component {
  static contextType = CartContext;

  render() {
    const { item } = this.props;
    const { handleCheckboxChange, updateItemQuantity } = this.context;
    const groupedAttributes = groupAttributesBySet(item.attributes);

    return (
      <div className="cart-item">
        <div className="item-details">
          <p className="item-name">{item.name}</p>
          <p className="item-price">{item.price.currency.symbol}{item.price.amount}</p>
          <div className="item-attributes">
            {Object.entries(groupedAttributes).map(([setName, attributes]) => (
              <AttributeSet
                key={setName}
                setName={setName}
                attributes={attributes}
                selectedAttributes={item.selectedAttributes}
                handleCheckboxChange={handleCheckboxChange}
                testIdPrefix="cart-item-attribute"
              />
            ))}
          </div>
        </div>
        <div className="cart-item-actions">
          <button onClick={() => updateItemQuantity(item.id, item.selectedAttributes, -1)} data-testid={`cart-item-amount-decrease`}>-</button>
          <p data-testid={`cart-item-amount`}>{item.quantity}</p>
          <button onClick={() => updateItemQuantity(item.id, item.selectedAttributes, +1)} data-testid={`cart-item-amount-increase`}>+</button>
        </div>
        <div className="image">
          <img src={item.images[0].image_url} alt={item.name} />
        </div>
      </div>
    );
  }
}

export default CartItem;
