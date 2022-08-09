import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { StyleSheet, css } from 'aphrodite';
import LocationListener from "./reusables/LocationListener.js";
import { getCategory, getProducts } from "./reusables/APICallPoints.js";
import SectionImage from "./reusables/SectionImage.js";
import Sorting from "./catalog/Sorting.js";
import Product from './reusables/Product.js'

const sectionStyles = StyleSheet.create({
  column: {
    flexFlow: 'column'
  },
  grid: {
    flexFlow: 'row wrap'
  }
})

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGrid: true,
      lang: this.props.context.lang,
      currency: this.props.context.currency,
      category: {
        name: this.props.params.category
      },
      sub_category: this.props.params.sub_category,
      filter: this.props.params.filter
    }

    this.updateProducts = this.updateProducts.bind(this);
    this.updateCurrency = this.updateCurrency.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
  }

  updateProducts(path) {
    let lang = path.search.replace('?lang=', '');
    let [_, category, sub_category, filter]  = path.pathname.slice(1).split('/')
    //['catalog', '<category>', '<sub_category>', '<?filter>']

    this.setState({
      lang: lang,
      category: {
        name: category
      },
      sub_category: sub_category,
      filter: filter || null
    }, () => {
      getCategory(category).then((data) => {
        this.setState({
          category: data
        })
      })
      getProducts(category, sub_category, filter).then((data) => {
        this.setState({
          products: data
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

  getSortedProducts() {
    let sorted_products = {};
    let filtering, remainder;
    
    for (let product of this.state.products) {
      filtering = product[this.state.category.default_filtering]
      if (filtering in sorted_products) {
        sorted_products[filtering].push(product)
      }
      else {
        sorted_products[filtering] = [product]
      }
    }
    
    for (let filtering in sorted_products) {
      remainder = sorted_products[filtering].length % 3 
      if (remainder != 0) {
        for (let i = 0; i < remainder + 1; i++) {
          sorted_products[filtering].push(null)
        }
      }
    }

    return sorted_products
  }

  changeLayout() {
    this.setState({
      isGrid: !this.state.isGrid
    })
  }

  render() {
    let sorted_products = this.state.products && this.getSortedProducts();

    return (
      <div>
        <LocationListener locationChanged={this.updateProducts} />
        <SectionImage category={this.state.category} />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              <Sorting
                updateCurrency={this.updateCurrency}
                changeLayout={this.changeLayout}
                currency={this.state.currency}
                isGrid={this.state.isGrid}
                lang={this.state.lang}
              />
              <div className="py-4">
              {this.state.products && Object.keys(sorted_products).map((filtering, index) => {
              return (
                <div key={index} className="d-flex my-5 flex-column">
                  <span className="h4">{this.state.category.default_filtering_lang} {filtering}</span>
                  <div className={css(this.state.isGrid ? sectionStyles.grid : sectionStyles.column) + " d-flex mt-3 justify-content-between"}>
                  {sorted_products[filtering].map((product, index) => {
                  return (
                    <div style={{flex: '1 1 0'}} key={index}>
                      <Product
                        product={product}
                        isGrid={this.state.isGrid}
                        category={this.state.category}
                        lang={this.state.lang}
                        currency={this.state.currency}
                      />
                    </div>
                  )})}
                  </div>
                </div>
              )})}
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Catalog);
