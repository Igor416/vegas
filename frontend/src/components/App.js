import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.js"
import Footer from "./Footer.js"
import { currencies } from './reusables/Globals.js';

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
        products: []
      }
    }

    this.updateLang = this.updateLang.bind(this)
    this.updateCurrency = this.updateCurrency.bind(this)
    this.addProduct = this.addProduct.bind(this)
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
    })
  }

  addProduct(category, product, size, quantity) {
    let cart = this.state.cart
    let newProduct = {
      category: category,
      id: product.id,
      discount: product.discount,
      size: size,
      quantity: quantity
    }

    cart.products.push(newProduct)
    this.setState({
      cart: cart
    })
  }

  render() {
    return (
      <div>
        <Header updateLang={this.updateLang} lang={this.state.lang} currency={this.state.currency} cart={this.state.cart}/>
        <Outlet context={Object.assign(this.state, {updateCurrency: this.updateCurrency, addProduct: this.addProduct})}/>
        <Footer />
      </div>
    );
  }
}