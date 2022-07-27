import React from "react";
import { StyleSheet, css } from 'aphrodite';
import CustomLink from '../reusables/CustomLink.js';

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

export default function Menu(props) {
  const state = props.state
  const categories = props.categories

  return (
    <div
      onMouseEnter={() => props.onMouseEnter(true)}
      onMouseLeave={() => props.onMouseLeave()}
      className={css(state.category ? menuStyles.show : menuStyles.hide) + " row transition-m"}
    >
      <div className="col-2"></div>
      <div
        className="col-2 border-start border-light border-2"
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
            <CustomLink link={getLink(categories, sub_category)} text={sub_category.split(';')[0]} />
          </div>
        )})}
      </div>
      <div
        className={"col-2 border-start border-light border-2"}
        onMouseEnter={() => state.sub_category && props.onMouseEnter(true, state.category, state.sub_category, true)}
        onMouseLeave={() => state.sub_category && props.onMouseLeave(true, state.sub_category, true)}
      >
        {state.sub_category && categories[state.sub_category].map((link, index) => {
        return (
          <div
            className={"d-flex pb-2"}
            key={index}
          >
            <CustomLink link={getLink(categories, state.sub_category, link, props.lang, props.categoriesEn)} text={link}/>
          </div>
        )})}
      </div>
      <div className="col-2 border-start border-light border-2">
      </div>
      <div className="col-2 border-start border-light border-2">
      </div>
      <div className="col-2 border-start border-light border-2"></div>
    </div>
  );
}

function getLink(categories, sub_category, link, lang='en', categoriesEn=null) {
  if (categories[sub_category].length == 0 || link) {
    let url = '/catalog/' + sub_category.split(';')[1]
    if (link) {
      if (lang == 'en') {
        url += '/' + link
      }
      else {
        let keys = categories[sub_category]
        for (let link_id = 0; link_id < keys.length; link_id++) {
          if (keys[link_id] == link) {
            url += '/' + Object.values(categoriesEn)[Object.keys(categories).indexOf(sub_category)][link_id]
          }
        }
      }
    }
    return url
  }
  return ''
}