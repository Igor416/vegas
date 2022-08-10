import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableHeader from "./TableHeader.js";
import TableFooter from "./TableFooter.js";

export default function Table(props) {
  const products = props.products
  
  const translations = {
    en: {
      size: 'Size: '
    },
    ru: {
      size: 'Размер: '
    },
    ro: {
      size: 'Marimea: '
    }
  }

  const lang_version = translations[props.lang]

  return (
    <div className="d-flex flex-column">
      <TableHeader lang={props.lang} currency={props.currency} size={lang_version.size}/>
      {products.map((pr, index) => {
      return (
      <div key={index} className="row">
        <div className="col-2 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
          <span>{pr.name} ({pr.category.name_s}) &nbsp;</span>
          <span
            style={{color: 'var(--lime-green)'}}
            className="link"
            onClick={() => props.deleteProduct(pr.category.name, pr, pr.size)}
          >
            &nbsp; <FontAwesomeIcon icon='trash' />
          </span>
        </div>
        <div className="col-3 border-bottom border-end">
          <img src={pr.shortcut} />
        </div>
        <div className="col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0">
          <span>{lang_version.size}{pr.size.width} x {pr.size.length}</span>
        </div>
        <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
          <span>{pr.size['price' + props.currency]}</span>
        </div>
        <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
          <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
        </div>
        <div className="col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0">
          <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
            <div onClick={() => props.updateQuantity(pr.category, pr.id, pr.quantity == 1 ? pr.quantity : pr.quantity - 1)}>
              <span>-</span>
            </div>
            <div style={{width: '2rem'}} className="d-flex justify-content-center">
              <span>{pr.quantity}</span>
            </div>
            <div onClick={() => props.updateQuantity(pr.category, pr.id, pr.quantity == 99 ? pr.quantity : Number(pr.quantity) + 1)}>
              <span>+</span>
            </div>
          </div>
        </div>
        <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom m-0">
          <span style={{ color: 'var(--deep-sky-blue)' }}>{pr['sum' + props.currency]}</span>
        </div>
      </div>
      )})}
      <TableFooter total={props.total} lang={props.lang} currency={props.currency} />
    </div>
  );
}
