import React from "react";
import { StyleSheet, css } from 'aphrodite';
import Product from '../reusables/Product.js'

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

export default function Section(props) {
  return (
    <div className="d-flex my-5 flex-column">
      <span className="h4">{props.category.default_filtering_lang} {props.filtering}</span>
      <div className={css(props.isGrid ? sectionStyles.grid : sectionStyles.column) + " mt-3 justify-content-between"}>
      {props.products.map((product, index) => {
      return (
        <div style={{flex: '1 1 0'}} key={index}>
          <Product product={product} {...props} />
        </div>
      )})}
      </div>
    </div>
  );
}
