import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite'

const line = {
  backgroundColor: 'black',
  height: '1px'
}

const lineStyles = StyleSheet.create({
  hide: Object.assign({
    opacity: '0',
    width: '0%'
  }, line),
  show: Object.assign({
    opacity: '1',
    width: '100%'
  }, line)
})

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
    let props = this.props
    return (
      <div className="row px-5 pt-4">
        <div className="col-1 nav-item"></div>
        <div className="col-10 nav-item h6 m-0">
          <div className="d-flex flex-inline justify-content-between">
            <div>
              <span>ГЛАВНАЯ &nbsp;</span>
            </div>
            {props.links.map((link, index) => {
              return (
              <div
                className="d-flex flex-row pb-2"
                key={index}
                onMouseEnter={() => props.onMouseEnter(false, index)}
                onMouseLeave={() => props.onMouseLeave(false, index)}
              >
                <div>
                  <span>{link}</span>
                  <div className={css(props.state.toggle[index] ? lineStyles.show : lineStyles.hide) + " transition-s mt-1"}></div>
                </div>
                <div>
                  <span>&nbsp;<i className={css(props.state.toggle[index] ? angleStyles.show : angleStyles.hide) + " transition-s far fa-angle-down"}></i></span>
                </div>
              </div>
              )
            })}
          </div>
        </div>
        <div className="col-1 nav-item"></div>
      </div>
    );
  }
}
