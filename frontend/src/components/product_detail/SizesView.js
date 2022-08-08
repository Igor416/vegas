import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite'
import Price from './Price.js';
import BuyPanel from './BuyPanel.js';

const dimensionStyles = StyleSheet.create({
  dimension: {
    fontWeight: 400,

    ':hover': {
      backgroundColor: 'var(--dark-cyan)'
    }
  }
})

export default function SizesView(props) {
  const product = props.product
  let [quantity, setQuantity] = useState(1)
  let [size, setSize] = useState(product.sizes[0])

  let widths = product.sizes.map(size => size.width)
  let lengths = product.sizes.map(size => size.length)

  const dimensions = {
    width: widths.filter((width, index) => widths.indexOf(width) == index),
    length: lengths.filter((length, index) => lengths.indexOf(length) == index)
  } //remove duplicates

  const translations = {
    en: {
      width: 'Width (cm):',
      length: 'Length (cm):'
    },
    ru: {
      width: 'Ширина (см)',
      length: 'Длина (см):'
    },
    ro: {
      width: 'Lățime (cm):',
      length: 'Lungime (cm):'
    }
  }

  let lang_version = translations[props.lang];

  let getSize = (width, length) => {
    for (let size of product.sizes) {
      if (size.width == width && size.length == length) {
        return size
      }
    }
  }
  
  let changeSize = (value, dimension) => {
    let params;
    if (dimension == 'width') {
      params = [value, size.length]
    }
    else {
      params = [size.width, value]
    }
    setSize(getSize.apply(null, params))
  }

  let addProduct = () => {
    props.addProduct(props.category.name, product, size, quantity)
  }

  return (
    <div className="d-flex flex-column">
      <Price size={size} discount={product.discount} {...props}/>
      <div className="d-flex border border-1 flex-column mt-5 p-3">
        <div className="d-flex flex-column flex-wrap align-items-stretch h6">
        {Object.keys(dimensions).map((dimension, index) => {
        return (
          <div key={index} className="mt-3">
            <span>{lang_version[dimension]}</span>
            <div className="mt-2">
              <div className="d-flex justify-content-between border-bottom border-1 p-2 dropdown-toggle" data-bs-toggle="dropdown">
                <span>{size[dimension]}</span>
                <FontAwesomeIcon icon='angle-down' />
              </div>
              <ul className="dropdown-menu">
              {dimensions[dimension].map((dim, index) => {
              return (
                <li
                  onClick={() => size[dimension] != dim && changeSize(dim, dimension)}
                  key={index}
                  className={css(dimensionStyles.dimension) + " p-1 ps-2"}
                  value={dim}
                >
                  {dim}
                </li>
              )})}
              </ul>
            </div>
          </div>
        )})}
        </div>
        <BuyPanel addProduct={addProduct} quantity={quantity} setQuantity={setQuantity} lang={props.lang} />
      </div>
    </div>
  );
}