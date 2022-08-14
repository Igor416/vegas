import React from "react";
import Hoverable from '../reusables/Hoverable.js';
import { currencies } from '../reusables/Globals.js';

export default function Sorting(props) {
  const size = props.size;
  const translations = {
    en: {
      old_price: 'Old price: ',
      current_price: 'Price: '
    },
    ru: {
      old_price: 'Старая цена: ',
      current_price: 'Цена: '
    },
    ro: {
      old_price: 'Prețul vechi: ',
      current_price: 'Prețul: '
    }
  }

  const lang_version = translations[props.lang]
  
  return (
    <div className="d-flex border border-1 bg-light justify-content-center row-nowrap pt-2 mb-5">
      <div className="border-end border-1 p-3 text-end">
      {props.discount != 0 && 
        <div style={{textDecoration: 'line-through'}}>
          <span>
            {`${lang_version.old_price} ${size['price' + props.currency]} (${props.currency})`}
          </span>
        </div>
      }
        <div>
          <span>
            {`${lang_version.current_price} `}
          </span>
          <span style={{color: 'var(--lime-green)'}} className="h5">
            {props.discount == 0 ? size['price' + props.currency] : size['price' + props.currency] * (100 - props.discount) / 100}
          </span>
          <span>
            {` (${props.currency})`}
          </span>
        </div>
      </div>
      <div className="d-flex flex-column p-3">
      {currencies.map((currency, index) => {
      return (
        <div
          onClick={() => props.updateCurrency(currency)}
          className={"d-flex flex-row " + (currency != props.currency && "link")}
          key={index}
        >
          <Hoverable text={currency} isActive={currency == props.currency}/>
          <span>&nbsp;</span>
        </div>
      )})}
      </div>
    </div>
  );
}
