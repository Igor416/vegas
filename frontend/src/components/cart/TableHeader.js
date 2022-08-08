import React from "react";

export default function TableHeader(props)  {
  const translations = {
    en: {
      cart: 'Choosed products',
      name: 'Name: ',
      shortcut: 'Photo: ',
      price: 'Price: ',
      discount: 'Discount: ',
      quantity: 'Quantity: ',
      total: 'Total: '
    },
    ru: {
      cart: 'Выбранные продукты',
      name: 'Наименование: ',
      shortcut: 'Фото: ',
      price: 'Цена: ',
      discount: 'Скидка: ',
      quantity: 'Количество: ',
      total: 'Итого: '
    },
    ro: {
      cart: 'Produse Selectate',
      name: 'Nume:',
      shortcut: 'Fotografie: ',
      price: 'Preț: ',
      discount: 'Reducere: ',
      quantity: 'Cantitate: ',
      total: 'Total: '
    }
  }

  const lang_version = Object.assign(translations[props.lang], {size: props.size})
  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <span className="h5">{lang_version.cart}</span>
      </div>
      <div
        style={{backgroundColor: 'var(--dark-cyan)'}}
        className="text-white row align-items-center text-center mt-3 rounded-pill"
      >
        <div className="col-2 h6 py-3 border-end border-white m-0">
          <span>{lang_version.name}</span>
        </div>
        <div className="col-3 h6 py-3 border-end border-white m-0">
          <span>{lang_version.shortcut}</span>
        </div>
        <div className="col-2 h6 py-3 border-end border-white m-0">
          <span>{lang_version.size}</span>
        </div>
        <div className="col-1 h6 py-3 border-end border-white m-0">
          <span>{lang_version.price} ({props.currency})</span>
        </div>
        <div className="col-1 h6 py-3 border-end border-white m-0">
          <span>{lang_version.discount}</span>
        </div>
        <div className="col-2 h6 py-3 border-end border-white m-0">
          <span>{lang_version.quantity}</span>
        </div>
        <div className="col-1 h6 py-3 m-0">
          <span>{lang_version.total}</span>
        </div>
      </div>
    </div>
  );
}