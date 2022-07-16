import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            <FontAwesomeIcon icon='arrow-circle-right'/>
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
            <FontAwesomeIcon icon='phone'/>
          </span>
          <br />
          <span className="h6">Закажите сейчас: 079 40-70-32</span>
        </div>
        <div className="col-1 text-center text-primary">
          <button type="button" className="p-0 bg-white border-0 outline-0 no-hover" data-bs-toggle="offcanvas" data-bs-target="#sideBar">
            <span>
              <FontAwesomeIcon icon='cart-shopping'/>
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
