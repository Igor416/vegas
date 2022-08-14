import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { StyleSheet, css } from 'aphrodite';
import LocationListener from "./reusables/LocationListener.js";
import { getCategory, getProducts } from "./reusables/APICallPoints.js";
import Hoverable from './reusables/Hoverable.js';
import { currencies } from './reusables/Globals.js';
import SectionImage from "./reusables/SectionImage.js";
import Product from './reusables/Product.js'

const switchMenu = {
  padding: '0.5vw',
  width: '3vw',
  height: '3vw',
  backgroundColor: 'var(--dark-cyan)'
}

const switchStyles = StyleSheet.create({
  column: Object.assign({
    flexFlow: 'column nowrap',
    gap: '1vh'
  }, switchMenu),
  grid: Object.assign({
    flexFlow: 'row wrap',
    gap: '0.5vw'
  }, switchMenu)
})

const barStyles = StyleSheet.create({
  column: {
    height: '1vh',
    width: '2vw'
  },
  grid: {
    height: '0.75vw',
    width: '0.75vw'
  }
})
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
        }, () => {
          getProducts(category, sub_category, filter).then((data) => {
            let sorted_products = {};
            let filtering, remainder;
            
            for (let product of data) {
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

            this.setState({
              products: sorted_products
            })
          })
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

  changeLayout() {
    this.setState({
      isGrid: !this.state.isGrid
    })
  }

  render() {
    const t = this.props.t

    return (
      <div>
        <LocationListener locationChanged={this.updateProducts} />
        <SectionImage category={this.state.category} />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              <div className="d-flex flex-row justify-content-end align-items-center h6">
                <div className="d-flex flex-row me-5 align-items-center">
                  {currencies.map((currency, index) => {
                  return (
                    <div
                      onClick={() => this.updateCurrency(currency)}
                      className={"d-flex flex-row " + (currency != this.state.currency && "link")}
                      key={index}
                    >
                      <Hoverable text={currency} isActive={currency == this.state.currency}/>
                      <span>&nbsp;</span>
                    </div>
                  )})}
                </div>
                <div
                  onClick={this.changeLayout}
                  className={css(this.state.isGrid ? switchStyles.grid : switchStyles.column) + ' d-flex transition'}>
                  {[0, 1, 2].map((value) => {
                  return <div key={value} className={css(this.state.isGrid ? barStyles.grid : barStyles.column) + ' bg-white transition'} />
                  })}
                </div>
              </div>
              <div className="py-4">
              {this.state.products && Object.keys(this.state.products).map((filtering, index) => {
              return (
                <div key={index} className="d-flex my-5 flex-column">
                  <span className="h4">{this.state.category.default_filtering_lang} {filtering}</span>
                  <div className={css(this.state.isGrid ? sectionStyles.grid : sectionStyles.column) + " d-flex mt-3 justify-content-between"}>
                  {this.state.products[filtering].map((product, index) => {
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
