import React from "react";
import CustomButton from '../reusables/CustomButton.js';

export default function Description(props) {
  const product = props.product
  const description = product.description

  const translations = {
    en: {
      yes: 'yes',
      no: 'no',
      characteristic: 'Show All Characteristic'
    },
    ru: {
      yes: 'да',
      no: 'нет',
      characteristic: 'Показать все характеристики'
    },
    ro: {
      yes: 'da',
      no: 'nu',
      characteristic: 'Afișează toate caracteristicile'
    }
  }

  const lang_version = translations[props.lang]
  
  return (
    <div className="d-flex flex-column">
      <div className="mb-3" style={{whiteSpace: "pre-line"}}>
        <span>{product.desc}</span>
      </div>
      <div className="row mt-3">
        <div className="d-flex flex-column justify-content-between col-6 p-4 border">
          <div>
          {Object.keys(description).map((key, index) => {
          return (
            <div key={index} className="d-flex mb-2 justify-content-between border-bottom">
              <span>{key}</span>
              <span className="h6">{repr(description[key], lang_version)}</span>
            </div>
          )})}
          </div>
          <div onClick={() => {toCharacteristic(props.setTabId)}}>
            <CustomButton text={lang_version.characteristic} color="deepSkyBlue" />
          </div>
        </div>
        <div className="col-6">
          <img src={product.shortcut} />
        </div>
      </div>
    </div>
  );
}

function toCharacteristic(setTabId) {
  setTabId(1);
  try {
    $('#tab-characteristic').tab('show');
    $('#characteristic').tab('show');
  } catch (error) {
    //displays error in console, however it works perfectly
  }
  
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
