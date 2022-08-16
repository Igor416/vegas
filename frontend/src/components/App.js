import React, { Component } from "react";
import i18n from "i18next";
import { Outlet, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currencies } from './reusables/Globals.js';
import Header from "./Header.js";
import MobileHeader from "./MobileHeader.js";
import Footer from "./Footer.js";
import MobileFooter from "./MobileFooter.js";

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
    i18n.changeLanguage(lang);
    this.state = {
      lang: lang,
      currency: currencies[0],
      cart: {
        products: this.decodeProducts(Cookies.get('products')),
        total: 0
      }
    }
    this.isMobile = window.matchMedia("(max-width: 576px)").matches

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
    i18n.changeLanguage(lang);
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
    let contains, pr
    for (pr of products) {
      if (pr.id == product.id && pr.category == category && pr.size == size.width + ' x ' + size.length) {
        contains = true
        break
      }
    }
    if (contains) {
      this.updateQuantity(category, product.id, pr.quantity + quantity)
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
        {this.isMobile
        ?
        <MobileHeader
          updateLang={this.updateLang}
          lang={this.state.lang}
          currency={this.state.currency}
          total={this.state.cart.total}
        />
        :
        <Header
          updateLang={this.updateLang}
          lang={this.state.lang}
          currency={this.state.currency}
          total={this.state.cart.total}
        />
        }
        <Outlet context={Object.assign(this.state, {
          isMobile: this.isMobile,
          updateCurrency: this.updateCurrency,
          addProduct: this.addProduct,
          deleteProduct: this.deleteProduct,
          updateQuantity: this.updateQuantity
        })}/>
        {this.isMobile
        ?
        <MobileFooter />
        :
        <Footer />
        }
        <div
          id="cart"
          style={{
          bottom: '5vh',
          right: this.isMobile ? '5vw' : '2vw',
          width: document.getElementById('cart')?.offsetHeight,
          backgroundColor: 'var(--dark-cyan)'
          }}
          className="position-fixed d-flex justify-content-center align-items-center rounded-circle p-3"
        >
          <Link to={"/cart?lang=" + this.state.lang} className="no-link no-hover">
            <FontAwesomeIcon icon="shopping-cart" color="white"/>
          </Link>
        </div>
      </div>
    );
  }
}