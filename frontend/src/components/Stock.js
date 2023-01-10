import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from "react-i18next";

import LocationListener from "./reusables/LocationListener.js";
import { getStock } from "./reusables/APICallPoints.js";
import CustomLink from "./reusables/CustomLink.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Stock extends Component {
  constructor(props) {
    super(props);

    this.isMobile = this.props.context.isMobile;
    this.state = {
      lang: this.props.context.lang,
      stock: null,
      currentStock: null,
    }

    this.updateStock = this.updateStock.bind(this);
  }

  updateStock(path) {
    let lang = path.search.replace('?lang=', '');
    getStock().then((data) => {
      this.setState({
        lang: lang,
        stock: data,
        currentStock: data[0]
      }, this.setCircles)
    })
  }

  setCircles() {
    let stock = document.getElementById('stock');
    let angle = 270
    let dangle = 360 / stock.children.length
    for (let i = 0; i < stock.children.length; ++i) {
      let circle = stock.children[i]
      angle += dangle
      if (i == 0) {
        circle.style.transform = `rotate(${angle}deg) translate(${stock.clientHeight / 3}px) rotate(-${angle}deg) scale(1.${this.isMobile ? '3' : '5'})`
      } else {
        circle.style.transform = `rotate(${angle}deg) translate(${stock.clientHeight / 3}px) rotate(-${angle}deg)${this.isMobile ? ' scale(0.9)' : ''}`
      }
    }
  }

  setCurrentStock(i) {
    let old = this.state.stock.indexOf(this.state.currentStock);
    if (old == i) {
      return
    }
    let currentStock = this.state.stock[i]

    let arr = document.getElementById('stock');
    let new_arr = [];
    for (let el of arr.children) {
      new_arr.push(el)
    }
    i = new_arr.indexOf(document.getElementById(i));

    let end = new_arr.slice(0, i);
    new_arr = new_arr.slice(i, new_arr.length);
    new_arr.push(...end);

    arr.replaceChildren(...new_arr);

    this.setState({
      currentStock: currentStock
    }, this.setCircles)
  }

  getPrev() {
    let i = this.state.stock.indexOf(this.state.currentStock);

    if (i == 0) {
      return this.state.stock.length - 1
    } else {
      return i - 1;
    }
  }

  getNext() {
    let i = this.state.stock.indexOf(this.state.currentStock);

    if (i == this.state.stock.length - 1) {
      return 0
    } else {
      return i + 1;
    }
  }

  render() {
    const t = this.props.t
    return (
      <div className="mt-sm-5">
        <LocationListener locationChanged={this.updateStock} />
        <div className="container-fluid d-flex mt-sm-5 mb-5 mb-sm-0 px-2 py-1 px-sm-5 py-sm-4">
          <div className="col-sm-1"></div>
          <div className="col-12 col-sm-10">
            {this.state.stock &&
            <div className={(this.isMobile ? "flex-column" : "flex-wrap") + " d-flex align-items-center justify-content-between mt-sm-5"}>
              <div id="stock" style={this.isMobile ? {height: '95vw', width: '95vw'} : {height: '50vh', width: '50vh'}}>
              {this.state.stock.map((stock, index) => {
              let length = stock.collections.length
              let collections;
              if (length > 1) {
                collections = stock.collections[0] + '...'
              } else {
                collections = stock.collections[0]
              }
              return (
                <div
                  id={index}
                  onClick={() => this.setCurrentStock(index)}
                  style={{
                    top: this.isMobile ? '40%' : '50%',
                    left: this.isMobile ? '35%' : '20%',
                    width: '12vh',
                    height: '12vh',
                    backgroundColor: 'var(--milk)',
                  }}
                  data-bs-target="#carouselStock"
                  data-bs-slide-to={index}
                  className="position-absolute transition p-3 rounded-circle d-flex flex-column align-items-center justify-content-center text-center"
                  key={index}
                >
                  <span>-{stock.discount}% {t('on')} {length == 1 ? t('collection') : t('collections')}: {collections}</span>
                </div>
              )})}
              </div>
              <div id="carouselStock" className="p-3 shadow carousel slide mt-5 mt-sm-0" data-bs-interval="false">
                <div style={{width: this.isMobile ? 'auto' : '30vw'}} className="carousel-inner">
                {this.state.stock.map((stock, index) => {
                return (
                  <div key={index} className={(index == 0 ? "active " : "") + "p-3 carousel-item"}>
                    <div className="d-flex flex-column">
                      <span><FontAwesomeIcon icon='calendar-alt' />&nbsp; {t('until')} {stock.expiry}</span><br/>
                      <span className="px-2">{stock.desc}</span><br/>
                      <span className="px-2">{t('watch')}</span><br/>
                      <ul>
                        {stock.collections.map((collection, index) => {
                        return (
                          <li key={index}>
                            <CustomLink to={"/catalog/Mattress/collection/" + collection} text={t('collection') + ' ' + collection}/>
                          </li>
                        )})}
                      </ul>
                    </div>
                  </div>
                )})}
                </div>
                <button 
                  className="carousel-control-prev ms-2 h2"
                  style={{width: '5%', color: 'var(--dark-cyan)'}} 
                  data-bs-target="#carouselStock" 
                  data-bs-slide="prev"
                  onClick={() => this.setCurrentStock(this.getPrev())}
                >
                  <FontAwesomeIcon icon='angle-left' />
                </button>
                <button 
                  className="carousel-control-next me-2 h2"
                  style={{width: '5%', color: 'var(--dark-cyan)'}} 
                  data-bs-target="#carouselStock" 
                  data-bs-slide="next"
                  onClick={() => this.setCurrentStock(this.getNext())}
                >
                  <FontAwesomeIcon icon='angle-right' />
                </button>
              </div>
            </div>
            }
          </div>
          <div className="col-sm-1"></div>
        </div>
      </div>
    );
  }
}

export default withTranslation('stock')(withParams(Stock));