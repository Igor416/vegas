import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocationListener from './reusables/LocationListener.js';
import SearchBar from "./header/SearchBar.js";
import { StyleSheet, css } from 'aphrodite';
import { langs as Langs } from './reusables/Globals.js';
import CustomLink from './reusables/CustomLink.js';

const burgerStyles = StyleSheet.create({
  sided: {
    top: '3.6vw',
    width: '0%',
    left: '50%',
  },
  top: {
    transform: 'rotate(45deg)',
  },
  bottom: {
    transform: 'rotate(-45deg)',
  }
})

const menuStyles = StyleSheet.create({
  hidden: {
    width: 0,
    opacity: 0
  },
  shown: {
    opacity: 1,
    width: '100vw'
  }
})

const CATEGORIES = require("./header/links.json");

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.inMenu = false;

    this.translations = {
      en: {
        order: 'Order now',
        home: 'HOME',
        shops: 'SHOPS',
        credit: 'Buy now,\npay later',
        cart: 'Cart'
      },
      ru: {
        order: 'Закажите сейчас',
        home: 'ГЛАВНАЯ',
        shops: 'МАГАЗИНЫ',
        credit: 'Купи сейчас,\nплати позже',
        cart: 'Корзина'
      },
      ro: {
        order: 'Comanda acum',
        home: 'ACASA',
        shops: 'MAGAZINE',
        credit: 'Cumpara acum,\nachita apoi',
        cart: 'Coş'
      }
    }

    this.state = {
      menuOpened: false,
      langs: () => {
        let langs = {...Langs};
        delete langs[this.props.lang];
        return langs
      },
      pathname: location.pathname,
      category: null,
      categoryEN: null,
      sub_category: null
    };
  }

  toggleMenu() {
    this.setState({
      menuOpened: !this.state.menuOpened
    }, () => {
      document.getElementsByTagName('body')[0].style.overflow = this.state.menuOpened ? 'hidden' : 'visible'
      if (!this.state.menuOpened) {
        this.setState({
          category: null,
          categoryEN: null,
          sub_category: null
        })
      }
    })
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

  getLink(sub_category, link=null) {
    let categories = CATEGORIES[this.props.lang][this.state.category]
    if (categories[sub_category].length == 0 || link) {
      let url = `/catalog/${sub_category.split(';')[1]}`
      if (link) {
        if (this.props.lang == 'en') {
          url += '/' + link
        }
        else {
          let keys = categories[sub_category]
          for (let link_id = 0; link_id < keys.length; link_id++) {
            if (keys[link_id] == link) {
              url += '/' + Object.values(CATEGORIES.en[this.state.categoryEN])[Object.keys(categories).indexOf(sub_category)][link_id]
            }
          }
        }
      }
      return url
    }
    return ''
  }

  render() {
    let lang_version = this.translations[this.props.lang];
    return (
      <div className="bg-white position-sticky sticky-top">
        <LocationListener locationChanged={(location) => this.setState({pathname: location.pathname})} />
        <div style={{boxShadow: '0 1rem 1.5rem -.5rem rgba(0, 0, 0, .25)'}} className="container-fluid row p-3 align-items-center m-0">
          <div className="d-flex col-3 justify-content-center align-items-center">
            <div
              onClick={() => this.toggleMenu()}
              style={{width: '12vw', height: '9vw'}}
              className="position-relative"
            >
              <div
                style={{top: 0, left: 0, width: '12vw',height: '1.8vw'}}
                className={css(this.state.menuOpened ? burgerStyles.sided : null) + " rounded-pill transition position-absolute bg-dark"}
              />
              <div
                style={{top: '3.6vw', left: 0, width: '12vw',height: '1.8vw'}}
                className={css(this.state.menuOpened ? burgerStyles.top: null) + " rounded-pill transition position-absolute bg-dark"}
              />
              <div
                style={{top: '3.6vw', left: 0, width: '12vw', height: '1.8vw'}}
                className={css(this.state.menuOpened ? burgerStyles.bottom : null) + " rounded-pill transition position-absolute bg-dark"}
              />
              <div
                style={{top: '7.2vw', left: 0, width: '12vw', height: '1.8vw'}}
                className={css(this.state.menuOpened ? burgerStyles.sided : null) + " rounded-pill transition position-absolute bg-dark"}
              />
            </div>
          </div>
          <div className="col-3 p-3">
            <img src="/static/images/logo.png"/>
          </div>
          <div className="col-2"></div>
          <div className="col-2 d-flex row-nowrap justify-content-around p-3">
          {Object.keys(this.state.langs()).map((lang, index) => {
          return (
            <Link key={index} to={this.state.pathname + '?lang=' + lang}>
              <button onClick={() => this.props.updateLang(lang)} className="p-2 bg-white border-0 outline-0 no-hover h4">
                <span className="border-bottom">{lang}</span> 
              </button>
            </Link>
          )})}
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <div
              style={{
                height: '9vw',
                width: '9vw',
                backgroundColor: 'var(--dark-cyan)'
              }}
              className="rounded-circle p-3 d-flex justify-content-center align-items-center"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title={`${lang_version.order}: 079 40-70-32`}
            >
              <FontAwesomeIcon icon='phone' color="white" />
            </div>
          </div>
        </div>
        <div style={{left: 0, opacity: 0, height: '100vh'}} className={css(this.state.menuOpened ? menuStyles.shown : menuStyles.hidden) + " position-absolute transition bg-white d-flex flex-column"}>
          <div className="d-flex flex-column">
            <div id="searchBar" style={{backgroundColor: 'var(--dark-cyan)'}} className="w-100 p-3">
              <SearchBar lang={this.props.lang} currency={this.props.currency} width='92.5%' />
            </div>
            <Link
              onClick={() => this.toggleMenu()}
              to={"/?lang=" + this.props.lang}
              className="w-100 p-3 border-bottom no-link no-hover"
            >
              <span>{lang_version.home}</span>
            </Link>
          {Object.keys(CATEGORIES[this.props.lang]).map((category, index) => {
          return (
            <div
              onClick={() => this.setState({category: category, categoryEN: this.getEnCategory(category)})}
              key={index}
              className="w-100 p-3 d-flex justify-content-between border-bottom"
            >
              <span>{category}</span>
              <FontAwesomeIcon icon='angle-right' color="var(--lime-green)" />
            </div>
          )})}
            <Link
              onClick={() => this.toggleMenu()}
              to={"/shops?lang=" + this.props.lang}
              className="w-100 p-3 border-bottom no-link no-hover"
            >
              <span>{lang_version.shops}</span>
            </Link>
          </div>
          <div style={{backgroundColor: 'var(--dark-grey)'}} className="flex-grow-1 w-100 d-flex row-nowrap text-white">
            <div className="w-50 pt-3 px-0 border-end text-center">
              <span>
                <FontAwesomeIcon icon='hand-holding-usd' />
              </span>
              <br />
              <span className="h6" style={{whiteSpace: "pre-line"}}>{lang_version.credit}</span>
            </div>
            <Link
              onClick={() => this.toggleMenu()}
              to={"/cart?lang=" + this.props.lang}
              className="w-50 pt-3 px-0 flex-column text-center no-link no-hover"
            >
              <span>
                <FontAwesomeIcon icon='shopping-cart' color="white" />
              </span>
              <br />
              <span style={{color: 'white'}} className="h6">{lang_version.cart} <br/> {this.props.total} ({this.props.currency})</span>
            </Link>
          </div>
          <div style={{left: 0, opacity: 0, height: '100vh'}} className={css(this.state.category ? menuStyles.shown : menuStyles.hidden) + " position-absolute transition bg-white d-flex flex-column"}>
            <div className="d-flex flex-column">
              <div
                onClick={() => this.setState({category: null, categoryEN: null})}
                style={{backgroundColor: 'var(--dark-cyan)'}}
                className="w-100 p-3 d-flex justify-content-between align-items-center border-bottom text-white"
              >
                <FontAwesomeIcon icon='angle-left' color="white" />
                <span>{this.state.category}</span>
              </div>
            {this.state.category && Object.keys(CATEGORIES[this.props.lang][this.state.category]).map((sub_category, index) => {
            return (
              <div
                onClick={() => {
                  if (this.getLink(sub_category) == '') {
                    this.setState({sub_category: sub_category})
                  }
                  else {
                    this.toggleMenu()
                  }
                }}
                key={index}
                className="w-100 p-3 d-flex justify-content-between border-bottom"
              >
                <CustomLink to={this.getLink(sub_category)} text={sub_category.split(';')[0]} />
                <FontAwesomeIcon icon='angle-right' color="var(--lime-green)" />
              </div>
            )})}
            </div>
          </div>
          <div style={{left: 0, opacity: 0, height: '100vh'}} className={css(this.state.sub_category ? menuStyles.shown : menuStyles.hidden) + " position-absolute transition bg-white d-flex flex-column"}>
            <div className="d-flex flex-column">
              <div
                onClick={() => this.setState({sub_category: null})}
                style={{backgroundColor: 'var(--dark-cyan)'}}
                className="w-100 p-3 d-flex justify-content-between align-items-center border-bottom text-white"
              >
                <FontAwesomeIcon icon='angle-left' color="white" />
                <span>{this.state.sub_category?.split(';')[0]}</span>
              </div>
            {this.state.sub_category && CATEGORIES[this.props.lang][this.state.category][this.state.sub_category].map((link, index) => {
            return (
              <div key={index} className="w-100 p-3 d-flex justify-content-between border-bottom">
                <CustomLink to={this.getLink(this.state.sub_category, link)} text={link}/>
              </div>
            )})}
            </div>
          </div>
        </div>
      </div>
    );
  }
}