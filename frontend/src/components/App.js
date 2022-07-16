import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.js"
import SectionImage from "./SectionImage.js"
import Footer from "./Footer.js"

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <SectionImage />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              <Outlet />
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}