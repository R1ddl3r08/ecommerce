import React, { Component } from 'react';
import { CartContext } from '../store/shopping-cart-context';
import CartItem from './CartItem';

class Cart extends Component {
  static contextType = CartContext;

  render() {
    const { items } = this.context;

    if (items.length === 0) {
      return <div>Your cart is empty</div>;
    }

    const totalPrice = items.reduce(
      (acc, item) => acc + item.price.amount * item.quantity,
      0
    );

    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    const currency = items[0].price.currency.symbol;

    let title = 'My Bag';
    if (totalQuantity === 1) {
      title += ', 1 item';
    } else if (totalQuantity > 1) {
      title += `, ${totalQuantity} items`;
    }

    return (
      <div className="cart">
        <h2>{title}</h2>
        {items.map(item => (
          <CartItem key={item.id + JSON.stringify(item.selectedAttributes)} item={item} />
        ))}
        <p id="cart-total-price" data-testid={`cart-total`}>
          Cart Total: <strong>{currency}{totalPrice.toFixed(2)}</strong>
        </p>
      </div>
    );
  }
}

export default Cart;
