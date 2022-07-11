import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.js"
import Footer from "./Footer.js"

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header></Header>
        <Outlet/>
        <Footer></Footer>
      </div>
    );
  }
}