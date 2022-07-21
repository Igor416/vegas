import React, { Component } from "react";
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

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let props = this.props
    let state = props.state
    let categories = props.categories
    
    let get_link = (sub_category, actual_link=false) => {
      if (categories[sub_category].length == 0 || actual_link) {
        return '/catalog/' + sub_category.split(';')[1]
      }
      return ''
    }
    return (
      <div
        onMouseEnter={() => props.onMouseEnter(true)}
        onMouseLeave={() => props.onMouseLeave()}
        className={css(state.category ? menuStyles.show : menuStyles.hide) + " row transition-s"}
      >
        <div className="col-2"></div>
        <div
          id="sub_categories"
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
              <CustomLink link={get_link(sub_category)} text={sub_category.split(';')[0]} />
            </div>
          )})}
        </div>
        <div
          id="menuLinks"
          className="col-2 border-start border-light border-2"
          onMouseEnter={() => state.sub_category && props.onMouseEnter(true, state.category, state.sub_category, true)}
          onMouseLeave={() => state.sub_category && props.onMouseLeave(true, state.sub_category, true)}
        >
          {state.sub_category && categories[state.sub_category].map((link, index) => {
          return (
            <div
              className="d-flex pb-2"
              key={index}
            >
              <CustomLink link={get_link(state.sub_category, true)} text={link} actual_link={true}/>
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
}
