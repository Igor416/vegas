import React, { useState } from "react";
import CustomButton from '../reusables/CustomButton.js';

export default function Sorting(props) {
  let [quantity, setQuantity] = useState(1)
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
        <div onClick={() => setQuantity(quantity == 1 ? quantity : quantity - 1)}>
          <span>-</span>
        </div>
        <div style={{width: '2rem'}} className="d-flex justify-content-center">
          <span>{quantity}</span>
        </div>
        <div onClick={() => setQuantity(quantity == 99 ? quantity : quantity + 1)}>
          <span>+</span>
        </div>
      </div>
      <div className="ps-5">
        <CustomButton color="deepSkyBlue" text={lang_version.buy} />
      </div>
    </div>
  );
}
