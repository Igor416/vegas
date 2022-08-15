import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import SearchBar from "./reusables/SearchBar.js";
import { getBestProducts } from "./reusables/APICallPoints.js";
import LocationListener from './reusables/LocationListener.js';
import { langs as Langs } from './reusables/Globals.js';
import Hoverable from './reusables/Hoverable.js';
import CustomLink from './reusables/CustomLink.js';

const angleStyles = StyleSheet.create({
  hide: {
    transform: 'rotate(0deg)'
  },
  show: {
    transform: 'rotate(180deg)'
  }
})

const menuStyles = StyleSheet.create({
  hide: {
    opacity: '0',
    height: '0%'
  },
  show: {
    opacity: '1',
    padding: '1rem 3rem',
    height: '100%'
  },
})

const CATEGORIES = require("../links.json");

class Header extends Component {
  constructor(props) {
    super(props);
    this.inMenu = false;
    this.state = {
      bestProducts: null,
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
  
  componentDidMount() {
    getBestProducts().then(data => {
      this.setState({
        bestProducts: data
      })
    })
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
      <div className="bg-white">
      <LocationListener locationChanged={(location) => this.setState({pathname: location.pathname})} />
        <div className="container-fluid d-flex align-items-center row px-5 pt-4">
          <div className="col-1"></div>
          <div className="col-1">
            <img style={{ maxWidth: '80%' }} src="/static/images/logo.png"/>
          </div>
          <div id="searchBar" className="col-3 ps-0">
            <SearchBar width={document.getElementById('searchBar')?.offsetWidth} currency={this.props.currency} lang={this.props.lang} />
          </div>
          <div className="col-1 d-flex flex-column align-items-center">
          {Object.keys(this.state.langs()).map((lang, index) => {
          return (
            <Link key={index} to={this.state.pathname + '?lang=' + lang}>
              <button
                onClick={() => this.props.updateLang(lang)}
                className="p-2 bg-white border-0 outline-0 no-hover">
                <img className="border" style={{ width: "2.5vw" }} src={"/static/images/" + this.state.langs()[lang] + ".png"}/>
              </button>
            </Link>
          )})}
          </div>
          <div className="col-2 text-center border-start border-end">
            <span>
              <FontAwesomeIcon icon='phone' />
            </span>
            <br />
            <span className="h6">{t('order')}: <br/>079 40-70-32</span>
          </div>
          <div className="col-2 text-center border-end">
            <span>
              <FontAwesomeIcon icon='hand-holding-usd' />
            </span>
            <br />
            <span className="h6" style={{whiteSpace: "pre-line"}}>{t('credit')}</span>
          </div>
          <div className="col-1 text-center">
            <Link to={'/cart' + location.search} className="h6 no-link no-hover">
              <span>
                <FontAwesomeIcon icon='shopping-cart' />
              </span>
              <br />
              <span>{t('cart')} <br/> {this.props.total} ({this.props.currency})</span>
            </Link>
          </div>
          <div className="col-1"></div>
        </div>
        <nav style={{zIndex: 1100}} className="container-fluid position-absolute bg-white px-5 pt-4">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10 h6 m-0">
              <div className="d-flex flex-inline justify-content-between transition">
                <div>
                  <CustomLink to="/" text={t('home')} />
                </div>
                {Object.keys(CATEGORIES[this.props.lang]).map((category, index) => {
                return (
                  <div
                    className="d-flex flex-row pb-2"
                    key={index}
                    onMouseEnter={() => this.onMouseEnter(false, category)}
                    onMouseLeave={() => this.onMouseLeave()}
                  >
                    <Hoverable text={category} />
                    <div>
                      <span>
                        &nbsp;
                        <FontAwesomeIcon className={css(this.state.category == category ? angleStyles.show : angleStyles.hide) + " transition"} icon='angle-down' /> 
                      </span>
                    </div>
                  </div>
                )})}
                <div>
                  <CustomLink to='/shops' text={t('shops')} />
                </div>
              </div>
            </div>
            <div className="col-1"></div>
          </div>
          <div
            onMouseEnter={() => this.onMouseEnter(true)}
            onMouseLeave={() => this.onMouseLeave()}
            className={css(this.state.category ? menuStyles.show : menuStyles.hide) + " row border-top row transition"}
          >
            <div className="col-2"></div>
            <div
              className="col-2 border-start"
              onMouseLeave={() => this.state.category && this.onMouseLeave(true)}
            >
              {this.state.category && Object.keys(CATEGORIES[this.props.lang][this.state.category]).map((sub_category, index) => {
              return (
                <div
                  className="d-flex pb-2"
                  key={index}
                  onMouseEnter={() => this.onMouseEnter(true, this.state.category, sub_category)}
                  onMouseLeave={() => this.onMouseLeave(true, sub_category)}
                >
                  <CustomLink to={this.getLink(sub_category)} text={sub_category.split(';')[0]} />
                </div>
              )})}
            </div>
            <div
              className="col-2 border-start"
              onMouseEnter={() => this.state.sub_category && this.onMouseEnter(true, this.state.category, this.state.sub_category, true)}
              onMouseLeave={() => this.state.sub_category && this.onMouseLeave(true, this.state.sub_category, true)}
            >
              {this.state.sub_category && CATEGORIES[this.props.lang][this.state.category][this.state.sub_category].map((link, index) => {
              return (
                <div
                  className={"d-flex pb-2"}
                  key={index}
                >
                  <CustomLink to={this.getLink(this.state.sub_category, link)} text={link}/>
                </div>
              )})}
            </div>
            {this.state.category && this.state.bestProducts[this.state.categoryEN].map((product, index) => {
            return (
            <div key={index} className="col-2 border-start p-2">
              <Link className="no-hover no-link text-end" to={`/product/${product.category}/${product.id}?lang=` + this.props.lang}>
                <span className="h6">{product.name}</span>
                <img src={product.shortcut} />
                {product.discount != 0
                ?
                <div className="d-flex flex-column">
                  <div style={{textDecoration: 'line-through'}}>
                    <span>
                      {`${t('from')} ${product.sizes[0]['price' + this.props.currency]} (${this.props.currency})`}
                    </span>
                  </div>
                  <div>
                    <span>
                      {`${t('from')} `}
                    </span>
                    <span style={{color: 'var(--lime-green)'}} className="h6">
                      {product.sizes[0]['price' + this.props.currency] * (100 - product.discount) / 100}
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
                      {`${t('from')} ${product.sizes[0]['price' + this.props.currency]} (${this.props.currency})`}
                    </span>
                  </div>
                </div>
                }
              </Link>
            </div>
            )})}
            <div className="col-2 border-start"></div>
          </div>
        </nav>
      </div>
    );
  }
}

export default withTranslation('header')(Header)