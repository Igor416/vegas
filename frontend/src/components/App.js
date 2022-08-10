import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Cookies from 'js-cookie';
import { currencies } from './reusables/Globals.js';
import Header from "./Header.js";
import Footer from "./Footer.js";

export default class App extends Component {
  constructor(props) {
    super(props);
    let lang;
    let search = location.search
    if (search) {
      lang = search.split('?lang=')[1];
    }
    else {
      lang = navigator.language;
      if (lang.includes('-')) {
        lang = lang.split('-')[0]
      }
      location.replace(location.pathname + `?lang=${lang}`)
    }
    this.state = {
      lang: lang,
      currency: currencies[0],
      cart: {
        products: this.decodeProducts(Cookies.get('products')),
        total: 0
      }
    }

    this.updateLang = this.updateLang.bind(this)
    this.updateCurrency = this.updateCurrency.bind(this)
    this.addProduct = this.addProduct.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)
    this.updateQuantity = this.updateQuantity.bind(this)
  }

  componentDidMount() {
    this.setTotal()
  }

  setTotal() {
    let start = 0
    let sum = this.state.cart.products.reduce((prev, curr) => prev + (curr['sum' + this.state.currency]), start)
    this.setState({
      cart: {
        products: this.state.cart.products,
        total: sum
      }
    })
  }

  updateLang(lang) {
    history.pushState(location.pathname.replace(`?lang=${lang}`, `?lang=${this.state.lang}`), '')
    this.setState({
      lang: lang
    })
  }

  updateCurrency(currency) {
    this.setState({
      currency: currency
    }, () => this.setTotal())
  }

  addProduct(category, product, size, quantity) {
    let products = this.state.cart.products
    let contains
    for (let pr of products) {
      if (pr.id == product.id && pr.category == category && pr.size == size.width + ' x ' + size.length) {
        contains = true
        if (pr.quantity == product.quantity) {
          return
        }
        else {
          pr.quantity += product.quantity
        }
      }
    }
    if (contains) {
      this.setState({
        cart: {
          products: products,
          total: 0
        } 
      }, () => {this.setTotal(); Cookies.set('products', this.encodeProducts(this.state.cart.products))})
      return
    }

    let newProduct = {
      category: category,
      name: product.name,
      id: product.id,
      discount: product.discount,
      size: size.width + ' x ' + size.length,
      quantity: quantity
    }

    for (let currency of currencies) {
      newProduct['price' + currency] = size['price' + currency]
      newProduct['sum' + currency] = size['price' + currency] * (100 - product.discount) / 100 * quantity
    }

    products.push(newProduct)
    this.setState({
      cart: {
        products: products,
        total: 0
      } 
    }, () => {this.setTotal(); Cookies.set('products', this.encodeProducts(this.state.cart.products))})
  }

  deleteProduct(category, id, size) {
    let products = this.state.cart.products
    products = products.filter(pr => !(pr.id == id && pr.category == category && pr.size == size))
    this.setState({
      cart: {
        products: products,
        total: 0
      }
    }, () => {this.setTotal(); Cookies.set('products', this.encodeProducts(this.state.cart.products))})
  }

  encodeProducts(products) {
    let s = ''
    for (let product of products) {
      for (let key in product) {
        s += `${key}=${product[key]};`
      }
      s += '/'
    }
    
    return s
  }

  decodeProducts(s) {
    let products = []
    if (s == undefined) {
      return products
    }

    for (let productDec of s.split('/')) {
      let productEnc = {}
      if (productDec != '') {
        for (let pair of productDec.split(';')) {
          if (pair != '') {
            let [key, value] = pair.split('=')
            if (key.includes('price') || key.includes('sum')|| key == 'id' || key == 'discount' || key == 'quantity') {
              value = Number(value)
            }
            productEnc[key] = value
          }
        }
        products.push(productEnc)
      }
    }
    
    return products
  }

  updateQuantity(category, id, quantity) {
    let products = this.state.cart.products
    let product = products.filter(pr => pr.category == category && pr.id == id)[0]
    for (let currency of currencies) {
      product['sum' + currency] = product['sum' + currency] * quantity / product.quantity
    }
    product.quantity = quantity
    products[products.indexOf(product)] == product
    this.setState({
      cart: {
        products: products,
        total: 0
      }
    }, () => {this.setTotal(); Cookies.set('products', this.encodeProducts(this.state.cart.products))})
  }

  render() {
    return (
      <div>
        <Header updateLang={this.updateLang} lang={this.state.lang} currency={this.state.currency} total={this.state.cart.total}/>
        <Outlet context={Object.assign(this.state, {
          updateCurrency: this.updateCurrency,
          addProduct: this.addProduct,
          deleteProduct: this.deleteProduct,
          updateQuantity: this.updateQuantity
        })}/>
        <Footer />
      </div>
    );
  }
}