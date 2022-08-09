import React from "react";
import CustomButton from '../reusables/CustomButton.js';

export default function Sorting(props) {
  const translations = {
    en: {
      buy: 'Add to basket'
    },
    ru: {
      buy: 'Добавить в корзину'
    },
    ro: {
      buy: 'Adauga în coș'
    }
  }

  const lang_version = translations[props.lang]
  
  return (
    <div className="d-flex justify-content-between align-items-stretch pt-3">
      <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
        <div onClick={() => props.setQuantity(props.quantity == 1 ? props.quantity : props.quantity - 1)}>
          <span>-</span>
        </div>
        <div style={{width: '2rem'}} className="d-flex justify-content-center">
          <span>{props.quantity}</span>
        </div>
        <div onClick={() => props.setQuantity(props.quantity == 99 ? props.quantity : props.quantity + 1)}>
          <span>+</span>
        </div>
      </div>
      <div className="ps-5" onClick={() => props.addProduct()}>
        <CustomButton color="deepSkyBlue" text={lang_version.buy} />
      </div>
    </div>
  );
}
