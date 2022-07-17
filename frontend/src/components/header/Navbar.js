import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from "./SearchBar.js";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.langs = {
      en: 'english',
      ru: 'russian',
      ro: 'romanian'
    }

    this.translations = {
      en: {
        search: 'Search products...',
        order: 'Order now',
        credit: 'Buy via loan',
      },
      ru: {
        search: 'Искать товары...',
        order: 'Закажите сейчас',
        credit: 'Купи в кредит',
      },
      ro: {
        search: 'Cauta bunuri...',
        order: 'Comanda acum',
        credit: 'Cumpara pe credit',
      }
    }
  }

  render() {
    let langs = {...this.langs};
    let lang_version = this.translations[this.props.lang];
    delete langs[this.props.lang];
    return (
      <div className="d-flex align-items-center row px-5 pt-4">
        <div className="col-1"></div>
        <div className="col-2">
          <img style={{ maxWidth: '80%' }} src="/static/images/logo_menu.svg"/>
        </div>
        <div className="col-3 ps-0">
          <SearchBar search={lang_version.search}/>
        </div>
        <div className="col-1 d-flex flex-column justify-content-center">
          {Object.keys(langs).map((lang, index) => {
          return (
            <button
              onClick={() => this.props.updateGlobals(lang)}
              key={index}
              className="p-2 bg-white border-0 outline-0 no-hover">
              <img className="border border-1" style={{ width: "3vw" }} src={"/static/images/" + langs[lang] + ".png"}/>
            </button>
          )})}
        </div>
        <div className="col-2 text-center border-1 border-start border-end">
          <span>
            <FontAwesomeIcon icon='phone'/>
          </span>
          <br />
          <span className="h6">{lang_version.order}: <br/>079 40-70-32</span>
        </div>
        <div className="col-1 text-center">
          <span>
            <FontAwesomeIcon icon='hand-holding-usd'/>
          </span>
          <br />
          <span className="h6">{lang_version.credit}</span>
        </div>
        <div className="col-1 text-center text-primary">
          <button type="button" className="p-0 bg-white border-0 outline-0 no-hover" data-bs-toggle="offcanvas" data-bs-target="#sideBar">
            <span>
              <FontAwesomeIcon icon='cart-shopping'/>
            </span>
            <br />
            <span id="priceAmount" className="h6">0.00 MDL (0)</span>
          </button>
        </div>
        <div className="col-1"></div>
      </div>
    );
  }
}
