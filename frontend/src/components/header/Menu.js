import React from "react";
import { StyleSheet, css } from 'aphrodite';
import CustomLink from '../reusables/CustomLink.js';

const menu = {
  borderTop: '1px solid var(--bs-light)'
}

const menuStyles = StyleSheet.create({
  hide: Object.assign({
    opacity: '0',
    height: '0%'
  }, menu),
  show: Object.assign({
    opacity: '1',
    padding: '1rem 3rem',
    height: '100%'
  }, menu),
})

export default function Menu(props) {
  const state = props.state
  const categories = props.categories

  let getLink = (link, sub_category=state.sub_category) => {
    if (categories[sub_category].length == 0 || link) {
      let url = '/catalog/' + sub_category.split(';')[1]
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
      className={css(state.category ? menuStyles.show : menuStyles.hide) + " row transition-m"}
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
            <CustomLink to={getLink(undefined, sub_category)} text={sub_category.split(';')[0]} />
          </div>
        )})}
      </div>
      <div
        className={"col-2 border-start border-1"}
        onMouseEnter={() => state.sub_category && props.onMouseEnter(true, state.category, state.sub_category, true)}
        onMouseLeave={() => state.sub_category && props.onMouseLeave(true, state.sub_category, true)}
      >
        {state.sub_category && categories[state.sub_category].map((link, index) => {
        return (
          <div
            className={"d-flex pb-2"}
            key={index}
          >
            <CustomLink to={getLink(link)} text={link}/>
          </div>
        )})}
      </div>
      <div className="col-2 border-start border-1">
      </div>
      <div className="col-2 border-start border-1">
      </div>
      <div className="col-2 border-start border-1"></div>
    </div>
  );
}