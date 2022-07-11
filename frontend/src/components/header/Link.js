import React, { Component } from "react";
import { Link as Href } from "react-router-dom";
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

export default class Link extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let props = this.props
    let href = '/'
    if (props.link) {
      href += 'catalog/' + props.link
      if (props.actual_link) {
        href += '/' + props.text
      }
    }
    return (
      <div>
        <Href className="no-hover no-link" to={href}>
          <span>{props.text}</span>
        </Href>
        <div className={css(props.isActive ? lineStyles.show : lineStyles.hide) + " transition-s mt-1"}></div>
      </div>
    );
  }
}
