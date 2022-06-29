import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite'

const menuStyles = StyleSheet.create({
  hide: {
    opacity: '0',
    height: '0%'
  },
  show: {
    opacity: '1',
    padding: '1rem 3rem',
    borderTop: '1px solid',
    borderTopColor: 'var(--bs-light)',
    height: '100%'
  }
})

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let props = this.props
    return (
      <div
        onMouseEnter={() => props.onMouseEnter(true)}
        onMouseLeave={() => props.onMouseLeave(true)}
        className={css(props.state.active ? menuStyles.show : menuStyles.hide) + " transition-s"}
      >
      </div>
    );
  }
}
