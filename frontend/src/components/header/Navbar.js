import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from "./SearchBar.js";

export default function Navbar(props) {
  let langs = {
    en: 'english',
    ru: 'russian',
    ro: 'romanian'
  }

  langs = {...langs};
  delete langs[props.lang];

  const translations = {
    en: {
      search: 'Search products...',
      order: 'Order now',
      credit1: 'Buy now,',
      credit2: 'pay later',
      cart: 'Cart'
    },
    ru: {
      search: 'Искать товары...',
      order: 'Закажите сейчас',
      credit1: 'Купи сейчас,',
      credit2: 'плати позже',
      cart: 'Корзина'
    },
    ro: {
      search: 'Cauta bunuri...',
      order: 'Comanda acum',
      credit1: 'Cumpara acum,',
      credit2: 'achita apoi',
      cart: 'Coş'
    }
  }

  let start = 0
  let sum = props.cart.products.reduce((prev, curr) =>
    prev + (curr.size['price' + props.currency] * (100 - curr.discount) / 100 * curr.quantity),
  start)

  console.log(sum);
  let lang_version = translations[props.lang];
  return (
    <div className="d-flex align-items-center row px-5 pt-4">
      <div className="col-1"></div>
      <div className="col-1">
        <img style={{ maxWidth: '80%' }} src="/static/images/logo.png"/>
      </div>
      <div className="col-3 ps-0">
        <SearchBar search={lang_version.search} />
      </div>
      <div className="col-1 d-flex flex-column align-items-center">
        {Object.keys(langs).map((lang, index) => {
        return (
          <Link key={index} to={location.pathname + '?lang=' + lang}>
            <button
              onClick={() => props.updateLang(lang)}
              className="p-2 bg-white border-0 outline-0 no-hover">
              <img className="border border-1" style={{ width: "2.5vw" }} src={"/static/images/" + langs[lang] + ".png"}/>
            </button>
          </Link>
        )})}
      </div>
      <div className="col-2 text-center border-1 border-start border-end">
        <span>
          <FontAwesomeIcon icon='phone' />
        </span>
        <br />
        <span className="h6">{lang_version.order}: <br/>079 40-70-32</span>
      </div>
      <div className="col-2 text-center border-end">
        <span>
          <FontAwesomeIcon icon='hand-holding-usd' />
        </span>
        <br />
        <span className="h6">{lang_version.credit1} <br/> {lang_version.credit2} </span>
      </div>
      <div className="col-1 text-center">
        <span>
          <FontAwesomeIcon icon='shopping-cart' />
        </span>
        <br />
        <span className="h6">{lang_version.cart} <br/> {sum} ({props.currency})</span>
      </div>
      <div className="col-1"></div>
    </div>
  );
}
