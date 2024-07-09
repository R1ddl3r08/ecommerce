import React, { Component } from 'react';
import { CartContext } from "../store/shopping-cart-context";
import { groupAttributesBySet } from '../utilities/attributeUtils';
import AttributeSet from './AttributeSet';
import parse from 'html-react-parser';
import CartModal from './CartModal.js';

class Product extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: 0
    };
    this.modal = React.createRef();
  }

  handleOpenCartClick = () => {
    this.modal.current.open();
  };

  handleNextImage = () => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex + 1) % this.props.product.images.length
    }));
  };

  handlePrevImage = () => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex - 1 + this.props.product.images.length) % this.props.product.images.length
    }));
  };

  render() {
    const { product } = this.props;
    const { addItemToCart, handleCheckboxChange, allAttributesSelected, selectedAttributes } = this.context;
    const { currentImageIndex } = this.state;

    if (!product) {
      return <div>Loading...</div>;
    }

    const groupedAttributes = groupAttributesBySet(product.attributes) || {};
    const isAddToCartDisabled = !allAttributesSelected(groupedAttributes) || !product.inStock;

    return (
      <div id="product">
        <div className="gallery" data-testid={`product-gallery`}>
          <div className="all-images">
            {product.images && product.images.map((image, index) => (
              <img key={index} src={image.image_url} alt={`${product.name} ${index + 1}`} onClick={() => this.setState({ currentImageIndex: index })} />
            ))}
          </div>
          <div className="main-image">
            <img src={product.images[currentImageIndex].image_url} alt={`${product.name} main`} />
            <button className="prev-arrow" onClick={this.handlePrevImage}>&#9664;</button>
            <button className="next-arrow" onClick={this.handleNextImage}>&#9654;</button>
          </div>
        </div>
        <div className="other-details">
          <h3>{product.name}</h3>
          <p data-testid={`product-description`}>{parse(product.description)}</p>
          {Object.entries(groupedAttributes).map(([setName, attributes]) => (
            <AttributeSet
              key={setName}
              setName={setName}
              attributes={attributes}
              selectedAttributes={selectedAttributes}
              handleCheckboxChange={handleCheckboxChange}
              testIdPrefix="product-attribute"
            />
          ))}
          <p className="price">Price: <br /><span>{product.price.currency.symbol}{product.price.amount.toFixed(2)}</span></p>
          <button className="add-to-cart-button" data-testid={`add-to-cart`} disabled={isAddToCartDisabled} onClick={() => {addItemToCart(product, selectedAttributes); this.handleOpenCartClick();}} >{product.inStock ? 'Add to cart' : 'Out of Stock'}</button>
        </div>
        <CartModal ref={this.modal} />
      </div>
    );
  }
}

export default Product;
