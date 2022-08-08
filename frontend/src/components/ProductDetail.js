import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getCategory, getProduct } from "./reusables/APICallPoints.js";
import LocationListener from "./reusables/LocationListener.js";
import CustomLink from "./reusables/CustomLink.js";
import SectionImage from "./reusables/SectionImage.js";
import SlideShow from "./product_detail/SlideShow.js";
import SizesView from "./product_detail/SizesView.js";
import Info from "./product_detail/Info.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.context.lang,
      currency: this.props.context.currency,
      product: null,
      size: null,
      category: {
        name: this.props.params.category
      },
      id: this.props.params.id
    }

    this.updateProduct = this.updateProduct.bind(this);
    this.updateCurrency = this.updateCurrency.bind(this);
  }

  updateProduct(path) {
    let lang = path.search.replace('?lang=', '');
    let [_, category, id] = path.pathname.slice(1).split('/') //['product', '<category>', '<id>']

    this.setState({
      lang: lang,
      category: {
        name: category
      },
      id: id
    }, () => {
      getCategory(category).then((data) => {
        this.setState({
          category: data
        })
      })
      getProduct(category, id).then((data) => {
        this.setState({
          product: data,
          size: data.sizes[0]
        })
      })
    })
  }

  updateCurrency(currency) {
    this.setState({
      currency: currency
    })
    this.props.context.updateCurrency(currency)
  }

  render() {
    return (
      <div>
        <LocationListener locationChanged={this.updateProduct} />
        <SectionImage category={this.state.category} />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1" />
            {this.state.product && 
            <div className="col-10">
              <div className="d-flex flex-column mb-5">
                <div className="d-flex row-nowrap h3">
                  <CustomLink to={`/catalog/${this.state.category.name}/all`} text={this.state.category.name_s}/>
                  <span>&nbsp;{this.state.product.name}</span>
                </div>
                <div className="d-flex mt-2 row-nowrap align-items-start">
                  <SlideShow product={this.state.product} />
                  <SizesView
                    updateCurrency={this.updateCurrency}
                    addProduct={this.props.context.addProduct}
                    lang={this.state.lang}
                    product={this.state.product}
                    category={this.state.category}
                    currency={this.state.currency}
                  />
                </div>
              </div>
              <Info lang={this.state.lang} product={this.state.product} />
            </div>
            }
            <div className="col-1" />
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(ProductDetail);
