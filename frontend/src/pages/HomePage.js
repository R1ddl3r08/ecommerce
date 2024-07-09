import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { useParams } from 'react-router-dom';

import ProductsList from '../components/ProductsList';

const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      description
      brand
      price {
        amount
        currency {
          label
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

class HomePage extends Component {
  render() {
    const { category } = this.props;

    return (
      <Query query={GET_PRODUCTS_BY_CATEGORY} variables={{ category }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error: {error.message}</div>;

          const { products } = data;

          return (
            <div id="homepage">
              <h2>{category}</h2>
              <ProductsList products={products} />
            </div>
          );
        }}
      </Query>
    );
  }
}

const HomePageWrapper = (props) => {
  const { category } = useParams();
  return <HomePage category={category} {...props} />;
};

export default HomePageWrapper;
