import React, { Component } from "react";
import Navbar from "./header/Navbar.js";
import Links from "./header/Links.js";
import Menu from "./header/Menu.js";
import { CATEGORIES } from "./header/LinksJson.js";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.categories = Object.keys(CATEGORIES)
    this.inMenu = false;
    this.state = {
      category: null,
      sub_category: null,
      actual_link: null
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  onMouseEnter(inMenu, category, sub_category=null, inActualLinks=false, actual_link=null) {
    let category_temp = this.state.category
    let sub_category_temp = this.state.sub_category
    let actual_link_temp = this.state.actual_link
    if (!inMenu) {
      category_temp = category
    }
    else {
      if (actual_link) {
        actual_link_temp = actual_link
      }
      else if (sub_category) {
        sub_category_temp = sub_category
      }
    }
    this.setState({
      category: category_temp,
      sub_category: sub_category_temp,
      actual_link: actual_link_temp
    }, () => {this.inMenu = inMenu; this.inActualLinks = inActualLinks})
  }
  
  onMouseLeave(inSubCategories=false, sub_category=null, inActualLinks=false, actual_link=null) {
    this.inMenu = inSubCategories
    this.inActualLinks = inActualLinks
    if (actual_link) {
      this.setState({
        actual_link: null
      })
    }
    if (inActualLinks ^ Boolean(actual_link)) {
      this.setState({
        sub_category: null
      })
    }
    setTimeout(() => {
      if ((inSubCategories ^ Boolean(sub_category)) && !this.inActualLinks) {
        this.setState({
          sub_category: null
        })
      }
      if (!this.inMenu) {
        this.setState({
          category: null,
          sub_category: null,
          actual_link: null
        })
      }
    }, 20)
  }

  render() {
    let props = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      state: this.state
    }
    return (
      <div className="container-fluid">
        <Navbar></Navbar>
        <nav className="sticky-top bg-white">
          <Links categories={this.categories} props={props}></Links>
          <Menu categories={CATEGORIES} props={props}></Menu>
        </nav>
      </div>
    );
  }
}
