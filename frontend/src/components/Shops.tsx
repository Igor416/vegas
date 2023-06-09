import React from "react";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from "react-i18next";

import { OutletContext } from "./App";

interface Shops {
  [key: string]: string[]
}

export default function Shops() {
  const outletContext: OutletContext = useOutletContext()
  const isMobile = outletContext.isMobile;
  const [t, i18n] = useTranslation('shops');

  const shops: Shops = {
    'CC Jumbo Showroom': [
      'Mun. Chișinău, bd. Decebal 23/1',
      '0 (78) 50-55-20'
    ],
    'Vegas Rîșcani': [
      'Mun. Chișinău, str. Kiev 16/1',
      '0 (79) 44-00-57'
    ],
    'Showroom Creangă': [
      'Mun Chișinău, str. Ion Crengă 5/3',
      '0 (79) 84-04-44'
    ],
    'Showroom Ciocana': [
      'Mun Chișinău, bd. Mircea cel Bătrîn 14',
      '0 (79) 40-70-22'
    ],
    'Municipiul Brașov': [
      'Municipiul Brașov, Bulevardul  MUNCII, Nr.4, PARTER, MAGAZINUL Nr. 7, Scara C-D, Județ Brașov',
      '-'
    ]
  }

  const isOpen = () => {
    let today = new Date()
    let hours = today.getHours()
    if ((today.getDay() % 6)) {
      return (9 < hours) && (hours < 19)
    }
    else {
      if (hours == 19) {
        return today.getMinutes() < 31
      }
      return (9 < hours) && (hours < 19)
    }
  }

  return (
    <div className="mt-5">
      <div className="container-fluid d-flex mt-5 px-2 py-1 px-sm-5 py-sm-4">
        <div className="col-sm-1"></div>
        <div className="col-12 col-sm-10">
          <iframe
            src="https://www.google.com/maps/d/u/0/embed?mid=1GchRIsF2ZGYvS6rskNj_6UTPwg1UB6w&ehbc=2E312F"
            className="w-100"
            style={{height: '100vh'}}
          />
          <div className={(isMobile ? "flex-column" : "flex-wrap") + " d-flex justify-content-between mt-5"}>
          {Object.keys(shops).map((name, index) => {
          return (
            <div key={index} className="col-12 col-sm-5 shadow bg-white transition p-3 p-sm-5 my-3 my-sm-5 h6">
              <span style={{color: 'var(--dark-cyan)'}} className="h5 mb-4">{name}</span>
              <span>&nbsp; ({isOpen() ? t('opened') : t('closed')})</span>
              <br/>
              <br/>
              <FontAwesomeIcon icon='map-marker-alt' />
              <span className="mb-4">&nbsp; {shops[name][0]}</span>
              <br/>
              <br/>
              <span>{t('workday')}</span>
              <span style={{color: 'var(--dark-cyan)'}} className="mb-4">10.00 - 19.30</span>
              <br/>
              <br/>
              <span>{t('weekend')}</span>
              <span style={{color: 'var(--dark-cyan)'}} className="mb-4">10.00 - 18.00</span>
              <br/>
              <br/>
              <FontAwesomeIcon icon='phone' />
              <span style={{color: 'var(--dark-cyan)'}}>&nbsp; {shops[name][1]}</span>
            </div>
          )})}
          </div>
        </div>
        <div className="col-sm-1"></div>
      </div>
    </div>
  );
}