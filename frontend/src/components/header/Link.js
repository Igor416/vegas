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

export default class Link extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let props = this.props
    return (
      <div>
        <span>{props.text}</span>
        <div className={css(props.isActive ? lineStyles.show : lineStyles.hide) + " transition-s mt-1"}></div>
      </div>
    );
  }
}
