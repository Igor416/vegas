import React, { Component } from "react";
import Navbar from "./header/Navbar.js";
import Links from "./header/Links.js";
import Menu from "./header/Menu.js";
import { Shops } from "./reusables/Globals.js"

const CATEGORIES = require("./header/links.json");

for (let lang of ['en', 'ru', 'ro']) {
  CATEGORIES[lang][Object.keys(CATEGORIES[lang]).slice(-1)[0]] = Shops
}

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.inMenu = false;
    this.state = {
      category: null,
      categoryEN: null,
      sub_category: null
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(inMenu, category, sub_category=null, inActualLinks=false) {
    let category_temp = this.state.category
    let sub_category_temp = this.state.sub_category

    if (!inMenu) {
      category_temp = category
    }
    else {
      if (sub_category) {
        sub_category_temp = sub_category
      }
    }
    this.setState({
      category: category_temp,
      categoryEN: this.getEnCategory(category_temp),
      sub_category: sub_category_temp
    }, () => {this.inMenu = inMenu; this.inActualLinks = inActualLinks})
  }
  
  onMouseLeave(inSubCategories=false, sub_category=null, inActualLinks=false) {
    this.inMenu = inSubCategories
    this.inActualLinks = inActualLinks
    if (inActualLinks) {
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
          categoriesEN: null,
          sub_category: null
        })
      }
    }, 20)
  }

  getEnCategory(category) {
    if (this.props.lang == 'en') {
      return category
    }

    let categories = CATEGORIES[this.props.lang]
    let keys = Object.keys(categories)
    let categoriesEn = CATEGORIES.en
    
    for (let i = 0; i < keys.length; i++) {
      if (category == keys[i]) {
        return Object.keys(categoriesEn)[i]
      }
    }
  }

  render() {
    return (
      <div className="bg-white">
        <div className="container-fluid">
          <Navbar
            updateLang={this.props.updateLang}
            lang={this.props.lang}
            currency={this.props.currency}
            total={this.props.total}
          />
        </div>
        <nav className="container-fluid position-absolute bg-white">
          <Links
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            categories={CATEGORIES[this.props.lang]}
            lang={this.props.lang}
            state={this.state}
          />
          <Menu
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            lang={this.props.lang}
            categoriesEn={CATEGORIES.en[this.state.categoryEN]}
            categories={CATEGORIES[this.props.lang][this.state.category]}
            state={this.state}
          />
        </nav>
      </div>
    );
  }
}
