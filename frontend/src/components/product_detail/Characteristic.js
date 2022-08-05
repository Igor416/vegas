import React from "react";
import CustomButton from '../reusables/CustomButton.js';

export default function Characteristic(props) {
  const characteristic = props.product.characteristic

  const translations = {
    en: {
      brand: 'Brand',
      country: ['Country of manufacture', 'Belarus'],
      manufacturer: ['Manufacturer', 'VEGAS LLC, Lieutenant Ryabtsev, 118V, 224025, Brest, Belarus'],
      note: ['Note', 'The illustrations show prototypes. The appearance of goods and their components\n may differ from the illustrations\n while maintaining the declared consumer properties.']
    },
    ru: {
      brand: 'Бренд',
      country: ['Страна производства', 'Беларусь'],
      manufacturer: ['Производитель', 'ООО «ВЕГАС», Лейтенанта Рябцева, 118В, 224025, Брест, Беларусь'],
      note: ['Примечание', 'На иллюстрациях представлены прототипы. Внешний вид товаров и их компонентов\n может отличаться от иллюстраций\n с сохранением декларируемых потребительских свойств.']
    },
    ro: {
      brand: 'Marca',
      country: ['Țara de fabricație', 'Bielorusia'],
      manufacturer: ['Producător', 'VEGAS LLC, Locotenentului Ryabtsev, 118V, 224025, Brest, Belarus'],
      note: ['Notă', 'Ilustrațiile prezintă prototipuri. Aspectul bunurilor și componentelor\n acestora pot diferi de ilustrații, păstrând\n în același timp proprietățile declarate de consumator.']
    }
  }

  const lang_version = translations[props.lang]
  const className = "d-flex mb-2 justify-content-between align-items-center border-bottom"
  return (
    <div className="row">
      <div className="d-flex flex-column col-6 justify-content-top border-end p-4">
        <div className={className}>
          <span>{lang_version.brand}</span>
          <span className="h6">Vegas</span>
        </div>
        {Object.keys(characteristic).slice(0, 8).map((key, index) => {
        return (
        <div key={index} className={className}>
          <span>{key}</span>
          <span className="h6">{repr(characteristic[key], lang_version)}</span>
        </div>
        )})}
      </div>
      <div className="d-flex flex-column col-6 justify-content-top p-4">
        {Object.keys(characteristic).slice(8).map((key, index) => {
        return (
        <div key={index} className={className}>
          <span>{key}</span>
          <span className="h6">{repr(characteristic[key], lang_version)}</span>
        </div>
        )})}
        {Object.keys(lang_version).slice(1, -2).map((key, index) => {
        return (
        <div key={index} className={className}>
          <span>{lang_version[key][0]}</span>
          <span className="h6">{lang_version[key][1]}</span>
        </div>
        )})}
        <div className={className}>
          <span>{lang_version.note[0]}</span>
          <span className="text-end" style={{fontSize: '0.75em', whiteSpace: "pre-line"}}>{lang_version.note[1]}</span>
        </div>
      </div>
    </div>
  );
}

function repr(val, translation) {
  //val is array, number or boolean
  if (Array.isArray(val)) {
    return val.join(' / ')
  }
  
  if (typeof val == "boolean") {
    return val ? translation.yes : translation.no
  }

  return val
}
