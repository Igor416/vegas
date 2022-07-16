import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import Link from './Link.js';

const angleStyles = StyleSheet.create({
  hide: {
    transform: 'rotate(0deg)'
  },
  show: {
    transform: 'rotate(180deg)'
  }
})

export default class Links extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let props = this.props.props
    props.categories = this.props.categories
    return (
      <div className="row px-5 pt-4">
        <div className="col-1"></div>
        <div className="col-10 h6 m-0">
          <div id="categories" className="d-flex flex-inline justify-content-between">
            <div>
              <span>ГЛАВНАЯ &nbsp;</span>
            </div>
            {props.categories.map((category, index) => {
              return (
              <div
                className="d-flex flex-row pb-2"
                key={index}
                onMouseEnter={() => props.onMouseEnter(false, category)}
                onMouseLeave={() => props.onMouseLeave()}
              >
                <Link text={category} isActive={props.state.category == category}></Link>
                <div>
                  <span>
                    &nbsp;
                    <FontAwesomeIcon className={css(props.state.category == category ? angleStyles.show : angleStyles.hide) + " transition-s far fa-angle-down"} icon='angle-down' /> 
                  </span>
                </div>
              </div>
              )
            })}
          </div>
        </div>
        <div className="col-1"></div>
      </div>
    );
  }
}
