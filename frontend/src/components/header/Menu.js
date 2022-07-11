import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite';
import Link from './Link.js';

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
    let props = this.props.props
    let state = props.state
    let categories = this.props.categories

    let get_link = (sub_category) => {
      if (categories[state.category][sub_category].length == 0) {
        return sub_category.split(';')[1]
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
          {state.category && Object.keys(categories[state.category]).map((sub_category, index) => {
            return (
            <div
              className="d-flex pb-2"
              key={index}
              onMouseEnter={() => props.onMouseEnter(true, state.category, sub_category)}
              onMouseLeave={() => props.onMouseLeave(true, sub_category)}
            >
              <Link link={get_link(sub_category)} text={sub_category.split(';')[0]} isActive={state.sub_category == sub_category}></Link>
            </div>
            )
          })}
        </div>
        <div
          id="actualLinks"
          className="col-2 border-start border-light border-2"
          onMouseEnter={() => state.sub_category && props.onMouseEnter(true, state.category, state.sub_category, true)}
          onMouseLeave={() => state.sub_category && props.onMouseLeave(true, state.sub_category, true)}
        >
          {state.sub_category && categories[state.category][state.sub_category].map((actual_link, index) => {
            return (
            <div
              className="d-flex pb-2"
              key={index}
              onMouseEnter={() => props.onMouseEnter(true, state.category, state.sub_category, true, actual_link)}
              onMouseLeave={() => props.onMouseLeave(true, state.sub_category, true, actual_link)}
            >
              <Link link={state.sub_category.split(';')[0]} text={actual_link} isActive={state.actual_link == actual_link} actual_link={true}></Link>
            </div>
            )
          })}
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
