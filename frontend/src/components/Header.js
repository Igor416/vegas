import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie'
import { withTranslation } from "react-i18next";

import LocationListener from './reusables/LocationListener.js';
import { getBestProducts, getMattressColectionsPrice, sendForm } from "./reusables/APICallPoints.js";
import { langs as Langs } from './reusables/Globals.js';
import SearchBar from "./reusables/SearchBar.js";
import Hoverable from './reusables/Hoverable.js';
import CustomLink from './reusables/CustomLink.js';
import CustomButton from './reusables/CustomButton.js';
import CustomPhoneInput from './reusables/CustomPhoneInput.js';

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
      sub_category: null,
      mattressColectionsPrice: [],
      ordered: false,
      form: {
        error: false,
        name: '',
        phone: ''
      }
    };

    this.updateBestProducts = this.updateBestProducts.bind(this);
    this.submitForm = this.submitForm.bind(this);
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
  
  updateBestProducts(location) {
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
    if (this.state.categoryEN == 'BASISES') {
      return `/product/Basis/${Object.keys(categories).indexOf(sub_category) + 1}`
    }
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

  updateForm(key, value) {
    let changedForm = {...this.state.form}
    changedForm[key] = value
    this.setState({
      form: changedForm
    })
  }

  submitForm() {
    let r = sendForm({
      'name': this.state.form.name,
      'phone': this.state.form.phone
    }, Cookies.get('csrftoken'), true)

    if (r == 'error: empty') {
      this.updateForm('error', true)
    }
    else {
      $(function () {
        $('#modal').modal('toggle');
     });
    }
  }

  render() {
    const t = this.props.t
    return (
      <div className="bg-white">
      <LocationListener locationChanged={this.updateBestProducts} />
        <div className="container-fluid d-flex align-items-center row px-5 pt-4">
          <div className="col-1"></div>
          <div className="col-1">
            <Link to={"/?lang=" + this.props.lang}>
              <img style={{ maxWidth: '80%' }} src="/static/images/logo.png"/>
            </Link>
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
            <FontAwesomeIcon icon='phone' />
            <br />
            <span className="h6">{t('order')}: <br/>079 40-70-32</span>
          </div>
          <div className="col-2 text-center border-end" data-bs-toggle="modal" data-bs-target="#modalHelp">
            <FontAwesomeIcon icon='hand-holding-usd' />
            <br />
            <span className="h6" style={{whiteSpace: "pre-line"}}>{t('credit')}</span>
          </div>
          <div className="col-1 text-center">
            <Link to={'/cart' + location.search} className="h6 no-link no-hover">
              <FontAwesomeIcon icon='shopping-cart' />
              <br />
              <span>{t('cart')} <br/> {this.props.total} ({this.props.currency})</span>
            </Link>
          </div>
          <div className="col-1"></div>
        </div>
        <nav style={{zIndex: 1000}} className="container-fluid position-absolute bg-white px-5 pt-4">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10 h6 m-0">
              <div className="d-flex flex-inline justify-content-between transition">
                <div>
                  <CustomLink to="/sales" text={t('sales')} />
                </div>
                <div>
                  <CustomLink to="/stock" text={t('stock')} />
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
                    &nbsp;
                    <FontAwesomeIcon className={(this.state.category == category ? "angle-active" : "angle-unactive") + " transition"} icon='angle-down' /> 
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
            className={(this.state.category ? "menu-show" : "menu-hide") + " d-flex flex-column transition"}
          >
            <div className="row border-top py-2">
              <div className="col-2"></div>
              <div
                className="col-2"
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
                className="col-4 border-start"
                onMouseEnter={() => this.state.sub_category && this.onMouseEnter(true, this.state.category, this.state.sub_category, true)}
                onMouseLeave={() => this.state.sub_category && this.onMouseLeave(true, this.state.sub_category, true)}
              >
                {this.state.sub_category && CATEGORIES[this.props.lang][this.state.category][this.state.sub_category].map((link, index) => {
                if (this.state.sub_category.endsWith(';Mattress/collection')) {
                  return (
                    <div className="d-flex pb-2" key={index}>
                      <CustomLink to={this.getLink(this.state.sub_category, link)} text={`${link}    ${t('from')}: ${this.state.mattressColectionsPrice[link]['price' + this.props.currency]} (${this.props.currency})`}/>
                    </div>
                  )
                }
                return (
                  <div
                    className={"d-flex pb-2"}
                    key={index}
                  >
                    <CustomLink to={this.getLink(this.state.sub_category, link)} text={link}/>
                  </div>
                )})}
              </div>
              <div className="col-2">
              </div>
            </div>
            {this.state.category &&
            <div className="row py-2">
              <div className="col-6"></div>
              <div className="col-2 d-flex align-items-end justify-content-center">
                <span style={{color: 'var(--dark-cyan)'}} className="h4">Hit Sales</span>
              </div>
            </div>
            }
            <div className="row">
              <div className={this.state.categoryEN == "MATTRESSES" ? "col-2" : "col-4"}></div>
              {this.state.category && this.state.bestProducts[this.state.categoryEN].map((product, index) => {
              return (
              <div key={index} className={(index != 0 ? "border-start" : "") + " col-2 p-2"}>
                <Link className="no-hover no-link text-end" to={`/product/${product.category}/${product.id}?lang=` + this.props.lang}>
                  <span className="h6">{product.category_name} {product.name}</span>
                  <div className="text-start" style={{color: 'gold'}}>
                    <FontAwesomeIcon icon="fa-star"/>
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
              <div className="col-2"></div>
            </div>
          </div>
        </nav>
        <div className="modal fade" id="modalHelp" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <span className="h3">{t('credit')}</span>
                  <br/>
                  <span>({t('procent')})</span>
                </div>
                <button onClick={() => this.setState({ordered: false}, () => this.updateForm('error', false))} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body h6">
                <ol>
                  <li>Maib - LiberCard (6 {t('months')})</li>
                  <li>Start Credit (4-6 {t('months')})</li>
                </ol>
                <span className="h6 text-danger">{this.state.form.error ? t('error') : ''}</span>
                <form style={{display: this.state.ordered ? 'block' : 'none'}} className="mt-3">
                  <label htmlFor="name">{t('name')}</label>
                  <br/>
                  <input
                    style={{border: 'none', borderBottom: '1px solid var(--dark-cyan)'}}
                    className="outline-0 no-hover w-100 px-0 mb-3"
                    type="text"
                    name="name"
                    placeholder="..."
                    value={this.state.form.name}
                    onChange={e => this.updateForm('name', e.target.value)}
                  />
                  <CustomPhoneInput
                    lang={this.props.lang}
                    color="dark-cyan" 
                    value={this.state.form.phone}
                    setPhone={phone => this.updateForm('phone', phone)}
                  />
                </form>
              </div>
              <div className="d-flex justify-content-between modal-footer">
                <div onClick={() => this.setState({ordered: false}, () => this.updateForm('error', false))} data-bs-dismiss="modal">
                  <CustomButton color="lime-green" text={t('close')} />
                </div>
                {this.state.ordered
                ?
                <div onClick={this.submitForm}>
                  <CustomButton color="deep-sky-blue" text={t('submit')} />
                </div>
                :
                <div onClick={() => this.setState({ordered: true})}>
                  <CustomButton color="deep-sky-blue" text={t('call')} />
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('header')(Header)