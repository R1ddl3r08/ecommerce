import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { useParams } from 'react-router-dom';
import Product from '../components/Product';

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      description
      price {
        amount
        currency {
          symbol
        }
      }
      images {
        image_url
      }
      attributes {
        id
        value
        display_value
        attribute_set {
          name
        }
      }
    }
  }
`;

class ProductDetails extends Component {
  render() {
    const { productId } = this.props;

    return (
      <Query query={GET_PRODUCT_DETAILS} variables={{ id: productId }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error: {error.message}</div>;

          const { product } = data;

          return (
            <Product product={product} />
          );
        }}
      </Query>
    );
  }
}

const ProductDetailsWrapper = () => {
  const { productId } = useParams();
  return <ProductDetails productId={productId} />;
};

export default ProductDetailsWrapper;