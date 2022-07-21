import React, { Component } from "react";
import { Link } from "react-router-dom";
import Hoverable from "./../../reusables/Hoverable.js"
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

export default class MattressLayout extends Component {
  constructor(props) {
    super(props);

    this.translations = {
      en: {
        collection: 'Collection: ',
        mattress: 'Mattress',
        from: 'from',
        details: 'More',
        add: 'Add to cart'
      },
      ru: {
        collection: 'Коллекция',
        mattress: 'Матрас',
        from: 'от',
        details: 'Подробнее',
        add: 'Добавить в корзину'
      },
      ro: {
        collection: 'Colecție',
        mattress: 'Saltea',
        from: 'de la',
        details: 'Mai mult',
        add: 'Adaugă în coș'
      }
    }
  }

  render() {
    console.log(this.props)
    let mattresses = sortMattresses(this.props.products);
    let lang_version = this.translations[this.props.lang];
    let currency = this.props.currency
    let isGrid = this.props.isGrid

    return (
      <div className="py-4">
        {Object.keys(mattresses).map((collection, index) => {
        return (
          <div
            key={index}
            className="d-flex my-5 flex-column"
          >
            <span className="h4">{lang_version.collection} {collection}</span>
            <div className={css(isGrid ? sectionStyles.grid : sectionStyles.column) + " mt-3 justify-content-between"}>
            {mattresses[collection].map((mattress, index) => {
              let price = mattress?.sizes[0]['price' + currency];
              let old_price = price;
              if (mattress?.discount) {
                price *= (100 - mattress.discount) / 100
              }
              return (
                mattress
                ?
                <Link
                  className={css(isGrid ? itemStyles.grid : itemStyles.column) + ' ' + css(shadowStyles.item) + " d-flex transition-s no-link p-3"}
                  key={index}
                  to={`/product/${mattress.id}`}
                >
                  <img src={mattress.shortcut}/>
                  <div className="d-flex flex-column justify-content-between">
                    <div className="d-flex flex-row justify-content-between align-items-end">
                      <div className="h5 m-0">
                        <Hoverable text={`${lang_version.mattress} ${mattress.name}`} />
                      </div>
                      <div className="d-flex flex-column text-end">
                      {mattress.discount != 0 && 
                        <div style={{textDecoration: 'line-through'}}>
                          <span>
                            {`${lang_version.from} `}
                          </span>
                          <span className="h5">
                            {old_price}
                          </span>
                          <span>
                            {` (${currency})`}
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
                        <span>{mattress.desc}</span>
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

function sortMattresses(mattresses) {
  let sorted = {};
  let collection, remainder;
  
  for (let mattress of mattresses) {
    collection = mattress.collection
    if (collection in sorted) {
      sorted[collection].push(mattress)
    }
    else {
      sorted[collection] = [mattress]
    }
  }
  
  for (let collection in sorted) {
    remainder = sorted[collection].length % 3 
    if (remainder == 0) continue
    else {
      for (let i = 0; i < remainder + 1; i++) {
        sorted[collection].push(null)
      }
    }
  }

  return sorted
}