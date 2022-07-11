import React, { Component } from "react";
import SearchBar from "./SearchBar.js";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row px-5 pt-4">
        <div className="col-1"></div>
        <div className="col-2">
          <img style={{ maxWidth: '80%' }} src="/static/images/logo_menu.svg"/>
        </div>
        <div className="col-3 ps-0">
          <SearchBar />
        </div>
        <div className="col-1 text-center border-1 border-end">
          <span>
            <i className="h4 fal fa-arrow-circle-right"></i>
          </span>
          <br />
          <span className="h6">К оплате</span>
        </div>
        <div className="col-1 d-flex justify-content-center border-1 border-end">
          <button className="p-2 bg-white border-0 outline-0 no-hover">
            <img className="border border-1" style={{ width: "3vw" }}src="/static/images/romanian.png"/>
          </button>
          <button className="p-2 bg-white border-0 no-hover">
            <img className="border border-1" style={{ width: "3vw" }} src="/static/images/russian.png"/>
          </button>
        </div>
        <div className="col-2 text-center">
          <span>
            <i className="h4 fal fa-phone"></i>
          </span>
          <br />
          <span className="h6">Закажите сейчас: 079 40-70-32</span>
        </div>
        <div className="col-1 text-center text-primary">
          <button type="button" className="p-0 bg-white border-0 outline-0 no-hover" data-bs-toggle="offcanvas" data-bs-target="#sideBar">
            <span>
              <i className="h4 fal fa-shopping-cart"></i>
            </span>
            <br />
            <span id="priceAmount" className="h6">0.00 MDL (0)</span>
          </button>
        </div>
        <div className="col-1"></div>
      </div>
    );
  }
}
