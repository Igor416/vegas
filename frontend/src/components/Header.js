import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite';
import Navbar from "./header/Navbar.js";
import Links from "./header/Links.js";
import Menu from "./header/Menu.js";
import CATEGORIES from "./header/LinksJson.js";

const menuStyles = StyleSheet.create({
  hide: {
    opacity: '0',
    height: '0%'
  },
  show: {
    opacity: '1',
    padding: '1rem 3rem',
    borderTop: '1px solid var(--bs-light)',
    height: '100%'
  }
})

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.inMenu = false
    this.state = {
      category: null
    };

    this.updateCategory = this.updateCategory.bind(this);
    this.updateInMenu = this.updateInMenu.bind(this);
  }
  
  updateCategory(category=null) {
    if (category) {
      this.setState({
        category: category
      })
      return
    }

    setTimeout(() => {
      this.setState({
        category: this.inMenu ? this.state.category : null
      })
    }, 50)
  }

  updateInMenu(inMenu=false) {
    this.inMenu = inMenu
    this.setState({
      category: inMenu ? this.state.category : null
    })
  }

  render() {
    let categories = CATEGORIES[this.props.lang];
    let category = this.state.category;

    return (
      <div className="container-fluid">
        <Navbar
          updateLang={this.props.updateLang}
          lang={this.props.lang}
          currency={this.props.currency}
        />
        <nav className="sticky-top bg-white">
          <Links
            updateCategory={this.updateCategory}
            categories={categories}
            category={category}
            lang={this.props.lang}
          />
          <div className={css(category ? menuStyles.show : menuStyles.hide) + " transition-s"}>
            <Menu
              updateInMenu={this.updateInMenu}
              categories={categories[category]}
              category={category}
            />
          </div>
        </nav>
      </div>
    );
  }
}
