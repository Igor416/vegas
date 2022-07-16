import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Sorting from "./catalog/Sorting.js";
import LayoutManager from "./catalog/LayoutManager.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isGrid: true
    }

    this.product = this.props.params.product;
    this.category = this.props.params.category
    this.filter = this.props.params.filter

    this.changeLayout = this.changeLayout.bind(this);
    this.getProducts()
  }

  getProducts() {
    let url = `/api/products/${this.product}/${this.category}/`
    if (this.filter) {
      url += this.filter + '/'
    }
    console.log(url)

    fetch(url).then((response) => response.json()).then((data) => {
      this.setState({
        products: data
      });
    });
  }

  changeLayout() {
    this.setState({
      isGrid: !this.state.isGrid
    })
  }

  render() {
    return (
      <div>
        <Sorting changeLayout={this.changeLayout} isGrid={this.state.isGrid} />
        <LayoutManager product={this.product} products={this.state.products} isGrid={this.state.isGrid}/>
      </div>
    );
  }
}

export default withParams(Catalog);
