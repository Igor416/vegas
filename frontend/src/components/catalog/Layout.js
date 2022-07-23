import React, { Component } from "react";
import { Link } from "react-router-dom";
import Hoverable from "../reusables/Hoverable.js"
import { StyleSheet, css } from 'aphrodite';

const section = {
  display: 'flex'
}

const sectionStyles = StyleSheet.create({
  column: Object.assign({
    flexFlow: 'column'
  }, section),
  grid: Object.assign({
    flexFlow: 'row wrap'
  }, section)
})

const shadowStyles = StyleSheet.create({
  item: {
    boxShadow: '0 .5rem 1rem rgba(0, 0, 0, .15)',
    ':hover': {
      boxShadow: '0 1rem 1.5rem rgba(0, 0, 0, .175)'
    }
  }
})

const itemStyles = StyleSheet.create({
  column: {
    flexFlow: 'row nowrap',
    ':nth-child(1n) > img': {
      width: '40%'
    },
    paddingRight: '4em'
  },
  grid: {
    flex: '1 1 0',
    flexFlow: 'column nowrap'
  }
})

export default class productLayout extends Component {
  constructor(props) {
    super(props);

    this.translations = {
      en: {
        from: 'from',
        details: 'More',
        add: 'Add to cart'
      },
      ru: {
        from: 'от',
        details: 'Подробнее',
        add: 'Добавить в корзину'
      },
      ro: {
        from: 'de la',
        details: 'Mai mult',
        add: 'Adaugă în coș'
      }
    }
  }

  render() {
    let products = sortProducts(this.props.products, this.props.category.default_filtering);
    let lang_version = this.translations[this.props.lang];
    let currency = this.props.currency
    let isGrid = this.props.isGrid

    return (
      <div className="py-4">
        {Object.keys(products).map((filtering, index) => {
        return (
          <div
            key={index}
            className="d-flex my-5 flex-column"
          >
            <span className="h4">{this.props.category.default_filtering_lang} {filtering}</span>
            <div className={css(isGrid ? sectionStyles.grid : sectionStyles.column) + " mt-3 justify-content-between"}>
            {products[filtering].map((product, index) => {
              let price = product?.sizes[0]['price' + currency];
              let old_price = price;
              if (product?.discount) {
                price *= (100 - product.discount) / 100
              }
              return (
                product
                ?
                <Link
                  className={css(isGrid ? itemStyles.grid : itemStyles.column) + ' ' + css(shadowStyles.item) + " d-flex transition-s no-link p-3"}
                  key={index}
                  to={`/product/${product.id}`}
                >
                  <img src={product.shortcut}/>
                  <div className="d-flex flex-column justify-content-between">
                    <div className="d-flex flex-row justify-content-between align-items-end">
                      <div className="h5 m-0">
                        <Hoverable text={`${this.props.category.name_s} ${product.name}`} />
                      </div>
                      <div className="d-flex flex-column text-end">
                      {product.discount != 0 && 
                        <div style={{textDecoration: 'line-through'}}>
                          <span>
                            {`${lang_version.from} ${old_price} (${currency})`}
                          </span>
                        </div>
                      }
                        <div>
                          <span>
                            {`${lang_version.from} `}
                          </span>
                          <span className="h5">
                            {price}
                          </span>
                          <span>
                            {` (${currency})`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-3 border-bottom border-1 border-muted">
                      <div>
                        <span>{product.desc}</span>
                      </div>
                    </div>
                    <div className="d-flex flex-row row-nowrap justify-content-between h5">
                      <button className="p-2 bg-white border-0 outline-0 no-hover p-0">
                        <span>{lang_version.details}</span>
                      </button>
                      <button className="p-2 bg-white border-0 outline-0 no-hover p-0">
                        <span>{lang_version.add}</span> 
                      </button>
                    </div>
                  </div>
                </Link>
                :
                <div key={index} className={css(isGrid ? itemStyles.grid : itemStyles.column)}></div>
              )
            })}
            </div>
          </div>
        )})}
      </div>
    );
  }
}

function sortProducts(products, default_filtering) {
  let sorted = {};
  let filtering, remainder;
  
  for (let product of products) {
    filtering = product[default_filtering]
    if (filtering in sorted) {
      sorted[filtering].push(product)
    }
    else {
      sorted[filtering] = [product]
    }
  }
  
  for (let filtering in sorted) {
    remainder = sorted[filtering].length % 3 
    if (remainder == 0) continue
    else {
      for (let i = 0; i < remainder + 1; i++) {
        sorted[filtering].push(null)
      }
    }
  }

  return sorted
}