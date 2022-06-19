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

const menuStyles = StyleSheet.create({
  hide: {
    opacity: '0',
    height: '0%'
  },
  show: {
    opacity: '1',
    padding: '1rem 3rem',
    borderTopWidth: '1px',
    height: '100%'
  }
})

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.links = ["МАТРАСЫ", "ПОДУШКИ", "НАМАТРАСНИКИ", "АКСЕССУАРЫ", "ДЕТЯМ", "МЕБЕЛЬ", "ОСНОВАНИЯ", "МАГАЗИНЫ"]
    this.inMenu = false;
    this.state = {
      toggle: this.links.map(link => false), //[false, false, false ...]
      active: null
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  onMouseEnter(inMenu, index) {
    let toggle = this.state.toggle
    let active = this.state.active
    if (!inMenu) {
      active = this.links[index]
      toggle = this.links.map((link, i) => {return i == index})
    }
    this.setState({
      toggle: toggle,
      active: active
    }, () => {this.inMenu = inMenu})
  }
  
  onMouseLeave(inMenu, index) {
    this.inMenu = false
    setTimeout(() => {
      if (!this.inMenu) {
        let toggle = this.state.toggle
        toggle[this.links.indexOf(this.state.active)] = false
        this.setState({
          toggle: toggle,
          active: null
        })
      }
    }, 20)
  }
  
  render() {
    return (
      <nav className="navbar sticky-top bg-white">
        <div className="container-fluid px-5 pt-4 navbar-nav">
          <div className="col-1 nav-item"></div>
          <div className="col-10 nav-item h6 m-0">
            <div className="d-flex flex-inline justify-content-between">
              <div>
                <span>ГЛАВНАЯ &nbsp;</span>
              </div>
              {this.links.map((link, index) => {
                return (
                <div
                  className="d-flex flex-row pb-2"
                  key={index}
                  onMouseEnter={() => this.onMouseEnter(false, index)}
                  onMouseLeave={() => this.onMouseLeave(false, index)}
                >
                  <div>
                    <span>{link}</span>
                    <div className={css(this.state.toggle[index] ? lineStyles.show : lineStyles.hide) + " transition-s mt-1"}></div>
                  </div>
                  <div>
                    <span>&nbsp;<i className={css(this.state.toggle[index] ? angleStyles.show : angleStyles.hide) + " transition-s far fa-angle-down"}></i></span>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
          <div className="col-1 nav-item"></div>
        </div>
        <div
          onMouseEnter={() => this.onMouseEnter(true)}
          onMouseLeave={() => this.onMouseLeave(true)}
          className={css(this.state.active ? menuStyles.show : menuStyles.hide) + " container-fluid transition-s border-1"}
        >
        </div>
      </nav>
    );
  }
}
