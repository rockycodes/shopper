import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const mapStateToProps = (state) => {
  return { products: state.products };
};

class ProductPage extends Component {



  render() {
    const productId = +this.props.match.params.productId;
    console.log("my product id is", productId);
    console.log(this.state)

    const products = this.props.products;
    console.log(products)
    let product = products.filter(oneProduct => {
      console.log("I am in my filter")
      return oneProduct.id == productId
    });
    product = product[0];
    console.log("my", product)
    return (
      product ?
      <div className="productPage">
        <div className="imgBox">
          {/* <img></img> */}
        </div>
        <div className="contentBox">
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>

      </div> : <div className="alert">No product to display</div>
    );
  }
}



export default connect(mapStateToProps)(ProductPage);