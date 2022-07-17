import React, { Component } from "react";
import { useParams } from "react-router-dom";
import SectionImage from "./catalog/SectionImage.js"
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
    this.category = {
      name: this.props.params.category
    }
    this.sub_category = this.props.params.sub_category
    this.filter = this.props.params.filter;
    this.getCategory()
    this.getproducts();

    this.changeLayout = this.changeLayout.bind(this);
  }

  getCategory() {
    let url = `/api/category/${this.category.name}/`
    fetch(url).then((response) => response.json()).then((data) => {
      this.category.description = data.desc
    });
  }

  getproducts() {
    let url = `/api/products/${this.category.name}/${this.sub_category}/`
    if (this.filter) {
      url += this.filter + '/'
    }

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
        <SectionImage category={this.category}/>
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              <Sorting changeLayout={this.changeLayout} isGrid={this.state.isGrid} />
              <LayoutManager category={this.category.name} products={this.state.products} isGrid={this.state.isGrid}/>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Catalog);
