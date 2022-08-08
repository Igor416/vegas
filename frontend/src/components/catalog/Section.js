import React from "react";
import { StyleSheet, css } from 'aphrodite';
import Product from '../reusables/Product.js'

const sectionStyles = StyleSheet.create({
  column: {
    flexFlow: 'column'
  },
  grid: {
    flexFlow: 'row wrap'
  }
})

export default function Section(props) {
  return (
    <div className="d-flex my-5 flex-column">
      <span className="h4">{props.category.default_filtering_lang} {props.filtering}</span>
      <div className={css(props.isGrid ? sectionStyles.grid : sectionStyles.column) + " d-flex mt-3 justify-content-between"}>
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
