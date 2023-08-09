import React, { useState, useEffect } from "react";
import { useOutletContext, Location } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import LocationListener from "./reusables/LocationListener";
import { getStock } from "../api";
import { Stock } from "../JSONTypes";
import CustomLink from "./reusables/CustomLink";
import { OutletContext } from "./App";

export default function Stock() {
  const outletContext: OutletContext = useOutletContext()
  const isMobile = outletContext.isMobile;
  const [stock, setStock] = useState<Stock[] | null>(null)
  const [currentStock, setCurrentStock] = useState<Stock | null>(null)
  const [t, i18n] = useTranslation('stock');

  const updateStock = (path: Location) => {
    getStock().then((data) => {
      setStock(data)
      setCurrentStock(data[0])
    })
  }

  const setCircles = () => {
    let stock = document.getElementById('stock');
    if (!stock) {
      return
    }
    let angle = 270
    let dangle = 360 / stock.children.length
    for (let i = 0; i < stock.children.length; ++i) {
      let circle = stock.children[i] as HTMLElement
      angle += dangle
      if (i == 0) {
        circle.style.transform = `rotate(${angle}deg) translate(${stock.clientHeight / 3}px) rotate(-${angle}deg) scale(1.${isMobile ? '3' : '5'})`
      } else {
        circle.style.transform = `rotate(${angle}deg) translate(${stock.clientHeight / 3}px) rotate(-${angle}deg)${isMobile ? ' scale(0.9)' : ''}`
      }
    }
  }

  useEffect(setCircles, [currentStock])

  const updateCurrentStock = (i: number) => {
    if (!stock || !currentStock) {
      return
    }
    let old = stock.indexOf(currentStock);
    if (old == i) {
      return
    }
    setCurrentStock(stock[i])

    let arr = document.getElementById('stock') as HTMLElement;
    let new_arr: HTMLElement[] = [];
    for (let j = 0; j < arr.children.length; j++) {
      new_arr.push(arr.children[j] as HTMLElement)
    }
    i = new_arr.indexOf(document.getElementById('' + i) as HTMLElement);

    let end = new_arr.slice(0, i);
    new_arr = new_arr.slice(i, new_arr.length);
    new_arr.push(...end);

    arr.replaceChildren(...new_arr);
  }

  const getPrev = () => {
    if (!stock || !currentStock) {
      return 0
    }
    let i = stock.indexOf(currentStock);

    if (i == 0) {
      return stock.length - 1
    }
    return i - 1;
  }

  const getNext = () => {
    if (!stock || !currentStock) {
      return 0
    }
    let i = stock.indexOf(currentStock);

    if (i == stock.length - 1) {
      return 0
    }
    return i + 1;
  }

  return (
    <div className="mt-sm-5">
      <LocationListener locationChanged={updateStock} />
      <div className="container-fluid d-flex mt-sm-5 mb-5 mb-sm-0 px-2 py-1 px-sm-5 py-sm-4">
        <div className="col-sm-1"></div>
        <div className="col-12 col-sm-10">
          {stock &&
          <div className={(isMobile ? "flex-column" : "flex-wrap") + " d-flex align-items-center justify-content-between mt-sm-5"}>
            <div id="stock" style={isMobile ? {height: '95vw', width: '95vw'} : {height: '50vh', width: '50vh'}}>
            {stock.map((stock, index) => {
            let length = stock.collections.length
            let collections;
            if (length > 1) {
              collections = stock.collections[0] + '...'
            } else {
              collections = stock.collections[0]
            }
            return (
              <div
                id={'' + index}
                onClick={() => updateCurrentStock(index)}
                style={{
                  top: isMobile ? '40%' : '50%',
                  left: isMobile ? '35%' : '20%',
                  width: '12vh',
                  height: '12vh',
                  backgroundColor: 'var(--milk)',
                }}
                data-bs-target="#carouselStock"
                data-bs-slide-to={index}
                className="position-absolute transition p-3 rounded-circle d-flex flex-column align-items-center justify-content-center text-center"
                key={index}
              >
                <span>-{stock.discount}% {t('on')} {length == 1 ? t('collection') : t('collections')}: {collections}</span>
              </div>
            )})}
            </div>
            <div id="carouselStock" className="p-3 shadow carousel slide mt-5 mt-sm-0" data-bs-interval="false">
              <div style={{width: isMobile ? 'auto' : '30vw'}} className="carousel-inner">
              {stock.map((stock, index) => {
              return (
                <div key={index} className={(index == 0 ? "active " : "") + "p-3 carousel-item"}>
                  <div className="d-flex flex-column">
                    <span><FontAwesomeIcon icon='calendar-alt' />&nbsp; {t('until')} {stock.expiry}</span><br/>
                    <span className="px-2">{stock.desc}</span><br/>
                    <span className="px-2">{t('watch')}</span><br/>
                    <ul>
                      {stock.collections.map((collection, index) => {
                      return (
                        <li key={index}>
                          <CustomLink to={"/catalog/Mattress/collection/" + collection} text={t('collection') + ' ' + collection}/>
                        </li>
                      )})}
                    </ul>
                  </div>
                </div>
              )})}
              </div>
              <button 
                className="carousel-control-prev ms-2 h2"
                style={{width: '5%', color: 'var(--dark-cyan)'}} 
                data-bs-target="#carouselStock" 
                data-bs-slide="prev"
                onClick={() => updateCurrentStock(getPrev())}
              >
                <FontAwesomeIcon icon='angle-left' />
              </button>
              <button 
                className="carousel-control-next me-2 h2"
                style={{width: '5%', color: 'var(--dark-cyan)'}} 
                data-bs-target="#carouselStock" 
                data-bs-slide="next"
                onClick={() => updateCurrentStock(getNext())}
              >
                <FontAwesomeIcon icon='angle-right' />
              </button>
            </div>
          </div>
          }
        </div>
        <div className="col-sm-1"></div>
      </div>
    </div>
  );
}