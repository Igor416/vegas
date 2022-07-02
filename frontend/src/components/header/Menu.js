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
    props.categories = this.props.categories
    return (
      <div
        onMouseEnter={() => props.onMouseEnter(true)}
        onMouseLeave={() => props.onMouseLeave()}
        className={css(props.state.category ? menuStyles.show : menuStyles.hide) + " row transition-s"}
      >
        <div className="col-2"></div>
        <div
          id="sub_categories"
          className="col-2 border-start border-light border-2"
          onMouseLeave={() => props.state.category && props.onMouseLeave(true)}
        >
          {props.state.category && Object.keys(props.categories[props.state.category]).map((sub_category, index) => {
            return (
            <div
              className="d-flex pb-2"
              key={index}
              onMouseEnter={() => props.onMouseEnter(true, props.state.category, sub_category)}
              onMouseLeave={() => props.onMouseLeave(true, sub_category)}
            >
              <Link text={sub_category} isActive={props.state.sub_category == sub_category}></Link>
            </div>
            )
          })}
        </div>
        <div
          id="actualLinks"
          className="col-2 border-start border-light border-2"
          onMouseEnter={() => props.state.sub_category && props.onMouseEnter(true, props.state.category, props.state.sub_category, true)}
          onMouseLeave={() => props.state.sub_category && props.onMouseLeave(true, props.state.sub_category, true)}
        >
          {props.state.sub_category && props.categories[props.state.category][props.state.sub_category].map((actual_link, index) => {
            return (
            <div
              className="d-flex pb-2"
              key={index}
              onMouseEnter={() => props.onMouseEnter(true, props.state.category, props.state.sub_category, true, actual_link)}
              onMouseLeave={() => props.onMouseLeave(true, props.state.sub_category, true, actual_link)}
            >
              <Link text={actual_link} isActive={props.state.actual_link == actual_link}></Link>
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
