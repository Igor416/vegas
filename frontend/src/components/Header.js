import React, { Component } from "react";
import Navbar from "./header/Navbar.js";
import Links from "./header/Links.js";
import Menu from "./header/Menu.js";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.links = ["МАТРАСЫ", "ПОДУШКИ", "НАМАТРАСНИКИ", "АКСЕССУАРЫ", "ДЕТЯМ", "МЕБЕЛЬ", "ОСНОВАНИЯ", "МАГАЗИНЫ"]
    this.inMenu = false;
    this.state = {
      toggle: this.links.map(link => false), //[false, false, false ...]
      active: null
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  onMouseEnter(inMenu, index) {
    let toggle = this.state.toggle
    let active = this.state.active
    if (!inMenu) {
      active = this.links[index]
      toggle = this.links.map((link, i) => {return i == index})
    }
    this.setState({
      toggle: toggle,
      active: active
    }, () => {this.inMenu = inMenu})
  }
  
  onMouseLeave(inMenu, index) {
    this.inMenu = false
    setTimeout(() => {
      if (!this.inMenu) {
        let toggle = this.state.toggle
        toggle[this.links.indexOf(this.state.active)] = false
        this.setState({
          toggle: toggle,
          active: null
        })
      }
    }, 20)
  }

  render() {
    return (
      <div className="container-fluid">
        <Navbar></Navbar>
        <nav className="sticky-top bg-white">
          <Links onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} state={this.state} links={this.links}></Links>
          <Menu onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} state={this.state}></Menu>
        </nav>
      </div>
    );
  }
}
