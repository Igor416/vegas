import React, { Component } from "react";
import SearchBar from "./SearchBar.js"

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="container-fluid row px-5 py-2 mt-3">
        <div className="col-1"></div>
        <div className="col-2">
          <img style={{ maxWidth: '80%' }} src="static/images/logo.png"/>
        </div>
        <div className="col-3">
          <SearchBar />
        </div>
        <div className="col-1 text-center border-dark border-1 border-end">
          <span>
            <i className="h4 fal fa-arrow-circle-right"></i>
          </span>
          <br />
          <span className="h6">К оплате</span>
        </div>
        <div className="col-1 d-flex justify-content-center border-dark border-1 border-end">
          <button className="p-2 bg-white border-0 outline-0 no-hover">
            <img className="border border-1" style={{ width: "3vw" }}src="static/images/romanian.png"/>
          </button>
          <button className="p-2 bg-white border-0 no-hover">
            <img className="border border-1" style={{ width: "3vw" }} src="static/images/russian.png"/>
          </button>
        </div>
        <div className="col-2 text-center">
          <span>
            <i className="h4 fal fa-phone"></i>
          </span>
          <br />
          <span className="h6">Закажите сейчас: 079 40-70-66</span>
        </div>
        <div className="col-1 text-center text-primary">
          <span>
            <i className="h4 fal fa-shopping-cart"></i>
          </span>
          <br />
          <span id="priceAmount" className="h6">0.00 MDL (0)</span>
        </div>
        <div className="col-1"></div>
      </header>
    );
  }
}
