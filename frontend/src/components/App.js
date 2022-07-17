import React, { Component } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LocationListener from "./LocationListener.js";
import Header from "./Header.js"
import Footer from "./Footer.js"

export default class App extends Component {
  constructor(props) {
    super(props);
    let lang = navigator.language
    if (lang.includes('-')) {
      lang = lang.split('-')[0]
    }
    this.state = {
      lang: lang,
      currency: 'MDL'
    }

    this.updateState = this.updateState.bind(this)
  }

  updateState(lang=null, currency=null) {
    this.setState({
      lang: lang ? lang : this.state.lang,
      currency: currency ? currency : this.state.currency
    })
  }

  render() {
    return (
      <div>
        <LocationListener locationChanged={this.updateState}/>
        <Header updateGlobals={this.updateState} lang={this.state.lang} currency={this.state.currency}/>
        <Outlet />
        <Footer />
      </div>
    );
  }
}