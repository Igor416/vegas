import React from "react";
import { StyleSheet, css } from 'aphrodite';
import { Link } from "react-router-dom";
import CustomLink from '../reusables/CustomLink.js';

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

export default function Menu(props) {
  const state = props.state
  const categories = props.categories

  const translations = {
    en: {
      from: 'from',
    },
    ru: {
      from: 'от',
    },
    ro: {
      from: 'de la',
    }
  }
  
  let lang_version = translations[props.lang];

  let getLink = (sub_category, link=null) => {
    if (categories[sub_category].length == 0 || link) {
      let url = `/catalog/${sub_category.split(';')[1]}`
      if (link) {
        if (props.lang == 'en') {
          url += '/' + link
        }
        else {
          let keys = categories[sub_category]
          for (let link_id = 0; link_id < keys.length; link_id++) {
            if (keys[link_id] == link) {
              url += '/' + Object.values(props.categoriesEn)[Object.keys(categories).indexOf(sub_category)][link_id]
            }
          }
        }
      }
      return url
    }
    return ''
  }

  return (
    <div
      onMouseEnter={() => props.onMouseEnter(true)}
      onMouseLeave={() => props.onMouseLeave()}
      className={css(state.category ? menuStyles.show : menuStyles.hide) + " border-top row transition"}
    >
      <div className="col-2"></div>
      <div
        className="col-2 border-start border-1"
        onMouseLeave={() => state.category && props.onMouseLeave(true)}
      >
        {state.category && Object.keys(categories).map((sub_category, index) => {
        return (
          <div
            className="d-flex pb-2"
            key={index}
            onMouseEnter={() => props.onMouseEnter(true, state.category, sub_category)}
            onMouseLeave={() => props.onMouseLeave(true, sub_category)}
          >
            <CustomLink to={getLink(sub_category)} text={sub_category.split(';')[0]} />
          </div>
        )})}
      </div>
      <div
        className="col-2 border-start border-1"
        onMouseEnter={() => state.sub_category && props.onMouseEnter(true, state.category, state.sub_category, true)}
        onMouseLeave={() => state.sub_category && props.onMouseLeave(true, state.sub_category, true)}
      >
        {state.sub_category && categories[state.sub_category].map((link, index) => {
        return (
          <div
            className={"d-flex pb-2"}
            key={index}
          >
            <CustomLink to={getLink(state.sub_category, link)} text={link}/>
          </div>
        )})}
      </div>
      {state.category && state.bestProducts[state.categoryEN].map((product, index) => {
      return (
      <div key={index} className="col-2 border-start border-1 p-2">
        <Link className="no-hover no-link text-end" to={`/product/${product.category}/${product.id}?lang=` + props.lang}>
          <span className="h6">{product.name}</span>
          <img src={product.shortcut} />
          {product.discount != 0
          ?
          <div className="d-flex flex-column">
            <div style={{textDecoration: 'line-through'}}>
              <span>
                {`${lang_version.from} ${product.sizes[0]['price' + props.currency]} (${props.currency})`}
              </span>
            </div>
            <div>
              <span>
                {`${lang_version.from} `}
              </span>
              <span style={{color: 'var(--lime-green)'}} className="h6">
                {product.sizes[0]['price' + props.currency] * (100 - product.discount) / 100}
              </span>
              <span>
                {` (${props.currency})`}
              </span>
            </div>
          </div>
          :
          <div className="d-flex flex-column">
            <div>
              <span>
                {`${lang_version.from} ${product.sizes[0]['price' + props.currency]} (${props.currency})`}
              </span>
            </div>
          </div>
          }
        </Link>
      </div>
      )})}
      <div className="col-2 border-start border-1"></div>
    </div>
  );
}