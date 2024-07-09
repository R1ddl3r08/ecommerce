import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../store/shopping-cart-context.js';
import CartModal from './CartModal.js';

class MainNavigation extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
  }

  static contextType = CartContext;

  handleOpenCartClick = () => {
    this.modal.current.open();
  };

  render() {
    const { items } = this.context;
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <>
        <header>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/clothes"
                  end
                >
                  {({ isActive }) => (
                    <span
                      className={isActive ? 'active' : undefined}
                      data-testid={isActive ? 'active-category-link' : 'category-link'}
                    >
                      Clothes
                    </span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tech"
                >
                  {({ isActive }) => (
                    <span
                      className={isActive ? 'active' : undefined}
                      data-testid={isActive ? 'active-category-link' : 'category-link'}
                    >
                      Tech
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
            <button id="cart" data-testid='cart-btn' onClick={this.handleOpenCartClick}>
              <i className="fa-solid fa-cart-shopping"></i>
              {totalQuantity >= 1 && totalQuantity}
            </button>
            <CartModal ref={this.modal} />
          </nav>
        </header>
        <div id="modal-root"></div>
      </>
    );
  }
}

export default MainNavigation;
