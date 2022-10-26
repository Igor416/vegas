import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from "react-i18next";

import LocationListener from './reusables/LocationListener.js';
import { getBestProducts, getMattressColectionsPrice } from "./reusables/APICallPoints.js";
import { langs as Langs } from './reusables/Globals.js';
import SearchBar from "./reusables/SearchBar.js";
import CustomLink from './reusables/CustomLink.js';

const CATEGORIES = require("../links.json");

class MobileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bestProducts: null,
      menuOpened: false,
      langs: () => {
        let langs = {...Langs};
        delete langs[this.props.lang];
        return langs
      },
      pathname: location.pathname,
      category: null,
      categoryEN: null,
      sub_category: null,
      mattressColectionsPrice: []
    };

    this.updateBestProducts = this.updateBestProducts.bind(this);
  }

  componentDidMount() {
    getMattressColectionsPrice().then(data => {
      let sorted_data = {}
      for (let el of data) {
        sorted_data[Object.keys(el)] = Object.values(el)[0]
      }
      
      this.setState({
        mattressColectionsPrice: sorted_data
      })
    })
  }

  updateBestProducts(location, locChanged) {
    if (locChanged && this.state.menuOpened) {
      this.toggleMenu();
      $('html, body').animate({
        scrollTop: 0
    }, 0);
    }
    this.setState({
      pathname: location.pathname
    }, () => {
      getBestProducts().then(data => {
        this.setState({
          bestProducts: data
        })
      })
    })
  }

  toggleMenu() {
    this.setState({
      menuOpened: !this.state.menuOpened
    }, () => {
      document.getElementById('header').classList.toggle('sticky-top')
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
    const t = this.props.t
    return (
      <div id="header" style={{zIndex: 1200}} className="bg-white">
        <LocationListener locationChanged={this.updateBestProducts} />
        <div style={{boxShadow: '0 1rem 1.5rem -.5rem rgba(0, 0, 0, .25)'}} className="container-fluid row p-3 align-items-center m-0">
          <div className="d-flex col-3 justify-content-center align-items-center">
            <div
              onClick={() => this.toggleMenu()}
              style={{width: '12vw', height: '9vw'}}
              className="position-relative burger"
            >
              <div
                style={{top: 0}}
                className={(this.state.menuOpened ? "burger-sided" : "") + " rounded-pill transition position-absolute bg-dark"}
              />
              <div
                style={{top: '3.6vw'}}
                className={(this.state.menuOpened ? "burger-top": "") + " rounded-pill transition position-absolute bg-dark"}
              />
              <div
                style={{top: '3.6vw'}}
                className={(this.state.menuOpened ? "burger-bottom" : "") + " rounded-pill transition position-absolute bg-dark"}
              />
              <div
                style={{top: '7.2vw'}}
                className={(this.state.menuOpened ? "burger-sided" : "") + " rounded-pill transition position-absolute bg-dark"}
              />
            </div>
          </div>
          <div className="col-4">
            <Link to={"/?lang=" + this.props.lang}>
              <img src="/static/images/logo.png"/>
            </Link>
          </div>
          <div className="col-1"></div>
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
              title={`${t('order')}: 079 40-70-32`}
            >
              <FontAwesomeIcon icon='phone' color="white" />
            </div>
          </div>
        </div>
        <div style={{left: 0, opacity: 0, height: '100vh'}} className={(this.state.menuOpened ? "menu-show" : "menu-hide") + " position-absolute transition bg-white d-flex flex-column overflow-scroll"}>
          <div className="d-flex flex-column">
            <div id="searchBar" style={{backgroundColor: 'var(--dark-cyan)'}} className="w-100 p-3">
              <SearchBar lang={this.props.lang} currency={this.props.currency} width='92.5%' />
            </div>
            <Link
              onClick={() => this.toggleMenu()}
              to={"/sales?lang=" + this.props.lang}
              className="w-100 p-3 border-bottom no-link no-hover"
            >
              <span>{t('sales')}</span>
            </Link>
            <Link
              onClick={() => this.toggleMenu()}
              to={"/stock?lang=" + this.props.lang}
              className="w-100 p-3 border-bottom no-link no-hover"
            >
              <span>{t('stock')}</span>
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
              className="w-100 p-3 no-link no-hover"
            >
              <span>{t('shops')}</span>
            </Link>
          </div>
          <div style={{backgroundColor: 'var(--milk)'}} className="flex-grow-1 w-100 d-flex row-nowrap">
            <div className="w-50 pt-3 text-center">
              <span>
                <FontAwesomeIcon icon='phone' />
              </span>
              <br/>
              <span className="h6">{t('order')}: <br/>079 40-70-32</span>
            </div>
            <Link
              onClick={() => this.toggleMenu()}
              to={"/cart?lang=" + this.props.lang}
              className="w-50 pt-3 text-center no-link no-hover"
            >
              <span>
                <FontAwesomeIcon icon='shopping-cart' />
              </span>
              <br/>
              <span className="h6">{t('cart')} <br/> {this.props.total} ({this.props.currency})</span>
            </Link>
          </div>
          <div style={{left: 0, opacity: 0, height: '100vh'}} className={(this.state.category ? "menu-show" : "menu-hide") + " position-absolute transition bg-white d-flex flex-column"}>
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
            <div className="d-flex align-items-end justify-content-center">
              <span style={{color: 'var(--dark-cyan)'}} className="h4">Hit Sales</span>
            </div>
            {this.state.category && this.state.bestProducts[this.state.categoryEN].map((product, index) => {
              return (
              <div key={index} className={(index != 0 ? "border-top" : "") + " p-2"}>
                <Link className="no-hover no-link text-end" to={`/product/${product.category}/${product.id}?lang=` + this.props.lang}>
                  <span className="h6">{product.category_name} {product.name}</span>
                  <div className="text-start h4" style={{color: 'gold'}}>
                    <FontAwesomeIcon icon="fa-star"/>
                    {product.discount != 0 &&
                    <span className="ms-2 ms-sm-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                      -{product.discount}%
                    </span>
                    }
                  </div>
                  <img src={product.shortcut} />
                  {product.discount != 0
                  ?
                  <div className="d-flex flex-column">
                    <div style={{textDecoration: 'line-through'}}>
                      <span>
                        {`${t('from')} ${product.size['price' + this.props.currency]} (${this.props.currency})`}
                      </span>
                    </div>
                    <div>
                      <span>
                        {`${t('from')} `}
                      </span>
                      <span style={{color: 'var(--lime-green)'}} className="h6">
                        {product.size['price' + this.props.currency] * (100 - product.discount) / 100}
                      </span>
                      <span>
                        {` (${this.props.currency})`}
                      </span>
                    </div>
                  </div>
                  :
                  <div className="d-flex flex-column">
                    <div>
                      <span>
                        {`${t('from')} ${product.size['price' + this.props.currency]} (${this.props.currency})`}
                      </span>
                    </div>
                  </div>
                  }
                </Link>
              </div>
              )})}
              <div style={{height: '20vh'}} className="w-100"></div>
            </div>
          </div>
          <div style={{left: 0, opacity: 0, height: '100vh'}} className={(this.state.sub_category ? "menu-show" : "menu-hide") + " position-absolute transition bg-white d-flex flex-column"}>
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
            if (this.state.sub_category.endsWith(';Mattress/collection')) {
              return (
                <div key={index} className="w-100 p-3 d-flex justify-content-between border-bottom">
                  <CustomLink to={this.getLink(this.state.sub_category, link)} text={link}/>
                  <span>{`${t('from')}: ${this.state.mattressColectionsPrice[link]['price' + this.props.currency]} (${this.props.currency})`}</span>
                </div>
              )
            }
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

export default withTranslation('header')(MobileHeader)