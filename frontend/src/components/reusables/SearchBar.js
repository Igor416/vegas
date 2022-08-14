import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { StyleSheet, css } from 'aphrodite';
import { sendSearch } from "./APICallPoints.js"
import CustomLink from './CustomLink.js';

const resultsStyles = StyleSheet.create({
  hide: {
    opacity: '0',
    height: '0%'
  },
  show: {
    opacity: '1',
    height: 'auto'
  },
})

export default function SearchBar(props) {
  let [search, setSearch] = useState('')
  let [show, setShow] = useState(false)
  let [res, setRes] = useState({})
  
  const translations = {
    en: {
      search: 'Search products...',
      help: 'If you didn\'t find what you were looking for, try changing the language',
      categories: 'Categories',
      choices: 'Characteristics',
      products: 'Products',
      from: 'from',
    },
    ru: {
      search: 'Искать товары...',
      help: 'Если вы не нашли то, чего хотели, попробуйте сменить язык',
      categories: 'Категории',
      choices: 'Характеристики',
      products: 'Продукты',
      from: 'от',
    },
    ro: {
      search: 'Cauta bunuri...',
      help: 'Dacă nu ați găsit ceea ce căutați, încercați să schimbați limba',
      categories: 'Categorii',
      choices: 'Caracteristici',
      products: 'Produse',
      from: 'de la',
    }
  }
  
  let lang_version = translations[props.lang];

  let submitForm = () => {
    if (search.length > 1) {
      sendSearch(search, Cookies.get('csrftoken')).then(data => setRes(data))
      return
    }
    setRes({})
  }
  
  useEffect(submitForm, [search])

  return (
    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div className="input-group">
        <input
          className="form-control rounded-end rounded-pill bg-light h6 m-0 p-3 border-0 outline-0 no-hover"
          type="text"
          name="searchQueryInput"
          placeholder={lang_version.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="input-group-btn px-3 rounded-start rounded-pill mt-n5 bg-light border-0 outline-0 no-hover"
          type="submit"
          name="searchQuerySubmit"
        >
          <svg style={{ width: 24 }} viewBox="0 0 24 24">
            <path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
        </button>
      </div>
      {Object.keys(res).length != 0 &&
      <div
        style={{zIndex: 1200, width: props.width}}
        className={css(show ? resultsStyles.show : resultsStyles.hide) + " border bg-white transition position-absolute py-3 px-4 mt-4"}
      >
        <span className="mb-4">{lang_version.help}</span>
      {Object.keys(res).map((key, index) => {
      if (res[key].length != 0) {
      if (key == 'products') {
      return (
        <div key={index} className="w-100 d-flex flex-column border-bottom mt-3">
          <span className="h5 pb-2">{lang_version[key]}: </span>
          {res[key].map((item, index) => {
          return (
            <div key={index} className="d-flex row-nowrap justify-content-between text-end">
              <CustomLink className="link" to={item.link} text={item.text} />
              {item.discount != 0 && 
              <div style={{fontSize: '0.75em', textDecoration: 'line-through'}}>
                <span>
                  {`${lang_version.from} ${item.price[props.currency]} (${props.currency})`}
                </span>
              </div>
            }
              <div>
                <span>
                  {`${lang_version.from} `}
                </span>
                <span style={{color: 'var(--lime-green)'}} className="h6">
                  {item.price[props.currency] * (100 - item.discount) / 100}
                </span>
                <span>
                  {` (${props.currency})`}
                </span>
              </div>
            </div>
          )})}
        </div>
      )}
      else {
      return (
        <div key={index} className="w-100 d-flex flex-column border-bottom mt-3">
          <span className="h5 pb-2">{lang_version[key]}: </span>
          {res[key].map((item, index) => {
          return (
            <div key={index} className="d-flex row-nowrap justify-content-between text-end">
              <CustomLink className="link" to={item.link} text={item.text} />
              <span>({item.count})</span>
            </div>
          )})}
        </div>
      )}}})}
      </div>
      }
    </div>
  );
}
