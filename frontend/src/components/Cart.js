import React, { Component } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from 'js-cookie'
import { getCategory, getProduct, sendForm } from "./reusables/APICallPoints.js";
import { currencies } from "./reusables/Globals.js";
import LocationListener from "./reusables/LocationListener.js";
import Table from "./cart/Table.js";
import Form from "./cart/Form.js";

function withParams(Component) {
  return props => <Component {...props} context={useOutletContext()} />;
}

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.context.lang,
      currency: this.props.context.currency,
      raw_products: this.props.context.cart.products,
      products: [],
      error: false
    }
    this.updateProducts = this.updateProducts.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateProducts(path) {
    let lang = path.search.replace('?lang=', '');

    this.setState({
      lang: lang,
      products: []
    }, () => {
      let products = this.state.products;
      for (let raw_product of this.state.raw_products) {
        let product, category;
        getCategory(raw_product.category).then((data) => {
          category = data;
          getProduct(raw_product.category, raw_product.id).then((data) => {
            product = Object.assign({
              category: category,
              quantity: raw_product.quantity,
              size: this.extractSize(data.sizes, raw_product.size)
            }, data);
            for (let currency of currencies) {
              product['sum' + currency] = raw_product['sum' + currency]
            }
            products.push(product)
            
            this.setState({
              products: products
            })
          })
        })
      }
    })
  }

  extractSize(sizes, dimensions) {
    let [width, length] = dimensions.split(' x ')

    for (let size of sizes) {
      if (size.width == width && size.length == length) {
        return size
      }
    }
  }

  updateQuantity(category, id, quantity) {
    this.props.context.updateQuantity(category.name, id, quantity)

    let products = this.state.products
    let product = products.filter(pr => pr.category.name == category.name && pr.id == id)[0]
    for (let currency of currencies) {
      product['sum' + currency] = product['sum' + currency] * quantity / product.quantity
    }
    product.quantity = quantity
    products[products.indexOf(product)] == product

    this.setState({
      products: products
    })
  }

  submitForm(data) {
    let r = sendForm(Object.assign({
      products: this.state.raw_products,
      total: this.props.context.cart.total + ` (${this.state.currency})`
    }, data), Cookies.get('csrftoken'))

    if (r == 'error: empty') {
      this.setState({
        error: true
      })
    }
  }

  deleteProduct(category, product, size) {
    size = size.width + ' x ' + size.length
    let products = this.state.raw_products

    this.setState({
      raw_products: products.filter(pr => !(pr.id == product.id && pr.category == category && pr.size == size))
    }, () => this.updateProducts(location))

    this.props.context.deleteProduct(category, product.id, size)
  }

  render() {
    return (
      <div>
        <LocationListener locationChanged={this.updateProducts} />
        <div className="container-fluid mt-5">
          <div className="row px-5 py-4 mt-5 border-top">
            <div className="col-1"></div>
            {this.state.products[0] &&
            <div className="col-10 pt-5">
              <Table
                lang={this.state.lang}
                total={this.props.context.cart.total}
                products={this.state.products}
                currency={this.state.currency}
                deleteProduct={this.deleteProduct}
                updateQuantity={this.updateQuantity}
              />
              <Form lang={this.state.lang} currency={this.state.currency} error={this.state.error} submitForm={this.submitForm} />
            </div>
            }
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Cart);
