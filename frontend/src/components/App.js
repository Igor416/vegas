import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.js"
import Footer from "./Footer.js"

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
      currency: 'MDL'
    }

    this.updateLang = this.updateLang.bind(this)
    this.updateCurrency = this.updateCurrency.bind(this)
  }

  updateLang(lang) {
    history.pushState(location.pathname.replace(`?lang=${lang}`, `?lang=%{this.state.lang}`), '')
    this.setState({
      lang: lang
    })
  }

  updateCurrency(currency) {
    this.setState({
      currency: currency
    })
  }

  render() {
    return (
      <div>
        <Header updateLang={this.updateLang} lang={this.state.lang} currency={this.state.currency}/>
        <Outlet context={Object.assign(this.state, {updateCurrency: this.updateCurrency })}/>
        <Footer />
      </div>
    );
  }
}