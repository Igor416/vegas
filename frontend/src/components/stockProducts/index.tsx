import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { getStock } from '../../api';
import { Stock } from '../../JSONTypes';
import { CustomLink } from '../reusables';
import { Circles } from './Circles';
import { ResponsiveProps } from '../..';

export function StockProducts({isMobile}: ResponsiveProps) {
  const [stock, setStock] = useState<Stock[]>([])
  const [active, setActive] = useState(-1)
  const [t, i18n] = useTranslation('stock');

  useEffect(() => {
    getStock().then((data) => {
      setStock(data)
      setActive(0)
    })
  }, [i18n.language])

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
      if (i === 0) {
        circle.style.transform = `rotate(${angle}deg) translate(${stock.clientHeight / 3}px) rotate(-${angle}deg) scale(1.${isMobile ? '3' : '5'})`
      } else {
        circle.style.transform = `rotate(${angle}deg) translate(${stock.clientHeight / 3}px) rotate(-${angle}deg)${isMobile ? ' scale(0.9)' : ''}`
      }
    }
  }

  useEffect(setCircles, [active])

  return (
    <div className='mt-sm-5'>
      <div className='container-fluid d-flex mt-sm-5 mb-5 mb-sm-0 px-2 py-1 px-sm-5 py-sm-4'>
        <div className='col-sm-1'></div>
        <div className='col-12 col-sm-10'>
          <div className={(isMobile ? 'flex-column' : 'flex-wrap') + ' d-flex align-items-center justify-content-between mt-sm-5'}>
            <Circles isMobile={isMobile} t={t} stock={stock} active={active} setActive={setActive} />
            <div id='carouselStock' className='p-3 shadow carousel slide mt-5 mt-sm-0' data-bs-interval='false'>
              <div style={{width: isMobile ? 'auto' : '30vw'}} className='carousel-inner'>
              {stock.map((stock, i) => {
              return (
                <div key={i} className={(i === 0 ? 'active ' : '') + 'p-3 carousel-item'}>
                  <div className='d-flex flex-column'>
                    <span><FontAwesomeIcon icon='calendar-alt' />&nbsp; {t('until')} {stock.expiry}</span><br/>
                    <span className='px-2'>{stock.desc}</span><br/>
                    <span className='px-2'>{t('watch')}</span><br/>
                    <ul>
                      {stock.collections.map((collection, i) => {
                      return (
                        <li key={i}>
                          <CustomLink to={'/catalog/Mattress/collection/' + collection} text={t('collection') + ' ' + collection}/>
                        </li>
                      )})}
                    </ul>
                  </div>
                </div>
              )})}
              </div>
            </div>
          </div>
        </div>
        <div className='col-sm-1'></div>
      </div>
    </div>
  );
}