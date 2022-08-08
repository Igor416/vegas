import React from "react";
import Description from './Description.js';
import Characteristic from './Characteristic.js';
import Structure from './Structure.js';
import Technologies from './Technologies.js';

export default function Info(props) {
  const product = props.product

  const translations = {
    en: {
      description: 'Description',
      characteristic: 'Characteristic',
      structure: 'Structure',
      technologies: 'Technologies',
      yes: 'yes',
      no: 'no'
    },
    ru: {
      description: 'Описание',
      characteristic: 'Характеристика',
      structure: 'Структура',
      technologies: 'Технологии',
      yes: 'да',
      no: 'нет'
    },
    ro: {
      description: 'Descriere',
      characteristic: 'Caracteristică',
      structure: 'Structură',
      technologies: 'Tehnologii',
      yes: 'da',
      no: 'nu'
    }
  }

  const tabs = {
    description: Description,
    characteristic: Characteristic,
    structure: Structure,
    technologies: Technologies
  };

  let lang_version = translations[props.lang];
  
  let repr = (val) => {
    //val is array, number or boolean
    if (Array.isArray(val)) {
      return val.join(' / ')
    }
    
    if (typeof val == "boolean") {
      return val ? lang_version.yes : lang_version.no
    }
  
    return val
  }

  return (
    <div className="mt-5">
      <div style={{borderColor: 'var(--deep-sky-blue)'}} className="nav nav-tabs ps-5" id="tab">
      {Object.keys(lang_version).map((tab, index) => {
      if (product[tab]) {
      return (
        <button
          key={index}
          id={'tab-' + tab}
          className={'nav-link link' + (index == 0 ? " active" : "")}
          data-bs-toggle="tab"
          data-bs-target={`#${tab}`}
        >
          {lang_version[tab]}
        </button>
      )}})}
      </div>
      <div className="tab-content" id="tabContent">
      {Object.keys(lang_version).map((tab, index) => {
      if (product[tab]) {
      let Tab = tabs[tab];
      return (
        <div key={index} className={"border border-top-0 border-1 p-4 tab-pane fade" + (index == 0 ? " show active" : "")} id={tab}>
          <Tab lang={props.lang} product={product} repr={repr} />
        </div>
      )}})}
      </div>
    </div>
  );
}
