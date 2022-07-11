import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Sorting from "./catalog/Sorting.js"

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    }

    this.product = this.props.params.product;
    this.category = this.props.params.category
    this.filter = this.props.params.filtrer || null

    this.getProducts()
  }

  getProducts() {
    let url = `/api/products/${this.product}/${this.category}`
    if (this.filter) {
      url += this.filter + '/'
    }
    fetch(url).then((response) => response.json()).then((data) => {
      this.setState({products: data})
    });
  }

  render() {
    return (
      <div className="container-fluid px-5">
        <Sorting />
        {this.state.products.map((product, index) => {
          return (
            <div key={index}></div>
          )
        })}
      </div>
    );
  }
}

export default withParams(Catalog);
