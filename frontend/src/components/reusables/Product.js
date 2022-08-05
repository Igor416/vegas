import React from "react";
import { StyleSheet, css } from 'aphrodite';
import { Link } from "react-router-dom";
import CustomButton from './CustomButton.js';
import { Hoverable } from './Hoverable.js';

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
    flexFlow: 'column'
  }
})

export default function Product(props) {
  const product = props.product
  
  if (!product) {
    return <div className={css(props.isGrid ? itemStyles.grid : itemStyles.column)}></div>
  }
  let price = product.sizes[0]['price' + props.currency];
  let old_price = price;
  if (product.discount) {
    price *= (100 - product.discount) / 100
  }

  const translations = {
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

  let lang_version = translations[props.lang];
  return (
    <Link
      className={css(props.isGrid ? itemStyles.grid : itemStyles.column) + ' ' + css(shadowStyles.item) + " d-flex transition-s no-link p-3"}
      to={`/product/${props.category.name}/${product.id}` + location.search}
    >
      <img src={product.shortcut}/>
      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex flex-row justify-content-between align-items-end">
          <div className="h5 m-0">
            <Hoverable text={`${props.category.name_s} ${product.name}`} />
          </div>
          <div className="d-flex flex-column text-end">
          {product.discount != 0 && 
            <div style={{textDecoration: 'line-through'}}>
              <span>
                {`${lang_version.from} ${old_price} (${props.currency})`}
              </span>
            </div>
          }
            <div>
              <span>
                {`${lang_version.from} `}
              </span>
              <span style={{color: 'var(--lime-green)'}} className="h5">
                {price}
              </span>
              <span>
                {` (${props.currency})`}
              </span>
            </div>
          </div>
        </div>
        <div className="py-3 border-bottom border-1 border-muted">
          <div>
            <span>{product.desc}</span>
          </div>
        </div>
        <div className="d-flex mt-4 flex-row row-nowrap justify-content-between h5">
          <CustomButton color="limeGreen" text={lang_version.details} />
          <div onClick={() => props.addProduct(props.category.name, product)}>
            <CustomButton color="deepSkyBlue" text={lang_version.add} />
          </div>
        </div>
      </div>
    </Link>
  );
}
