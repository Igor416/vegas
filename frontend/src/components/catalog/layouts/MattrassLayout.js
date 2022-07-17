import React, { Component } from "react";
import { Link } from "react-router-dom";
import { StyleSheet, css } from 'aphrodite';

const item = {
  flexFlow: 'column nowrap'
}

const itemStyles = StyleSheet.create({
  column: Object.assign({
    flex: '1 1 1'
  }, item),
  grid: Object.assign({
    flex: '1 1 0'
  }, item)
})

export default class MattrassLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let mattrasses = sortMattrasses(this.props.products)
    let isGrid = this.props.isGrid
    return (
      <div className="py-4">
        {Object.keys(mattrasses).map((collection, index) => {
        return (
          <div
            key={index}
            className="d-flex flex-column"
          >
            <span className="h4">Коллекция {collection}</span>
            <div className="d-flex flex-row flex-wrap justify-content-between">
              {mattrasses[collection].map((mattrass, index) => {
              return (
                mattrass
                ?
                <Link
                  className={css(isGrid ? itemStyles.grid : itemStyles.column) + " no-hover no-link"}
                  key={index}
                  to={`/product/${mattrass.id}`}
                >
                  <div className="shadow p-3">
                    <div></div>
                    <div>
                      <img src={mattrass.shortcut.image}/>
                    </div>
                    <div className="h5 d-flex flex-row justify-content-between align-items-end">
                      <div>
                        <span>Матрас {mattrass.name}</span>
                      </div>
                      <div>
                        <span>от {mattrass.sizes[0].priceMDL}</span>
                      </div>
                    </div>
                    <div>
                      <div>
                        <span>{mattrass.desc}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                :
                <div key={index} className={css(isGrid ? itemStyles.grid : itemStyles.column)}></div>
              )})}
            </div>
          </div>
        )})}
      </div>
    );
  }
}

function sortMattrasses(mattrasses) {
  let sorted = {};
  let collection, remainder;

  for (let mattrass of mattrasses) {
    collection = mattrass.collection
    if (collection in sorted) {
      sorted[collection.property_ru].push(mattrass)
    }
    else {
      sorted[collection.property_ru] = [mattrass]
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