import React, {useState} from "react";
import { StyleSheet, css } from 'aphrodite'
import Description from './Description.js';
import Characteristic from './Characteristic.js';
import Structure from './Structure.js';
import Technologies from './Technologies.js';

export default function Info(props) {
  const product = props.product
  let [tabId, setTabId] = useState(2)

  const translations = {
    en: {
      description: 'Description',
      characteristic: 'Characteristic',
      structure: 'Structure',
      technologies: 'Technologies'
    },
    ru: {
      description: 'Описание',
      characteristic: 'Характеристика',
      structure: 'Структура',
      technologies: 'Технологии'
    },
    ro: {
      description: 'Descriere',
      characteristic: 'Caracteristică',
      structure: 'Structură',
      technologies: 'Tehnologii'
    }
  }

  const tabs = {
    description: Description,
    characteristic: Characteristic,
    structure: Structure,
    technologies: Technologies
  };

  let lang_version = translations[props.lang];
  
  return (
    <div className="mt-5">
      <div style={{borderColor: 'var(--deep-sky-blue)'}} className="nav nav-tabs ps-5" id="tab">
      {Object.keys(lang_version).map((tab, index) => {
      if (product[tab]) {
      return (
        <button
          key={index}
          id={'tab-' + tab}
          className={'nav-link link' + (index == 2 ? " active" : "")}
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
        <div key={index} className={"border border-top-0 border-1 p-4 tab-pane fade" + (index == 2 ? " show active" : "")} id={tab}>
          <Tab lang={props.lang} product={product} setTabId={setTabId} />
        </div>
      )}})}
      </div>
    </div>
  );
}
