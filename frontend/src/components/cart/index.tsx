import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { OrderedProduct, Size } from '../../JSONTypes';
import { getProduct } from '../../api';
import { Hoverable } from '../reusables';
import { FormPanel } from './FormPanel';
import { Table } from './Table';
import { ResponsiveProps } from '../..';
import { CartContext } from '../../providers';

export function Cart({isMobile}: ResponsiveProps) {
  const cachedProducts = useContext(CartContext)
  const [products, setProducts] = useState<OrderedProduct[]>([])
  const [t, i18n] = useTranslation('cart');

  useEffect(() => {
    if (cachedProducts.length === 0) {
      setProducts([])
    }
    for (let raw_product of cachedProducts) {
      getProduct(raw_product.category, raw_product.name).then(data => {
        let product = {
          name: data.name,
          category: data.category,
          discount: data.discount,
          shortcut: data.shortcut,
          size: extractSize(data.sizes, raw_product.size),
          quantity: raw_product.quantity,
          sum: {...raw_product.sum}
        }
        setProducts([...products, product])
      })
    }
  }, [i18n.language, cachedProducts])

  const extractSize = (sizes: Size[], dimensions: string): Size => {
    let [width, length] = dimensions.split(' x ').map(Number)
    return sizes.find(size => size.width === width && size.length === length) as Size
  }
  
  return <div className='mt-5'>
    <div className='container-fluid d-flex mt-5 mb-5 px-2 py-1 mb-sm-0 px-sm-5 py-sm-4'>
      <div className='col-sm-1'></div>
      {products.length > 0
      ?
      <div className='col-12 col-sm-10 pt-0 pt-sm-5'>
        <Table isMobile={isMobile} t={t} products={products} />
        <FormPanel isMobile={isMobile} t={t} lang={i18n.language} products={products} />
      </div>
      :
      <div style={{height: '60vh'}} className='col-12 col-sm-10 pt-0 pt-sm-5 d-flex align-items-center justify-content-center mb-sm-5'>
        <div style={{
          width: isMobile ? '100vw' : '60vw',
          backgroundColor: isMobile ? 'white' : 'var(--milk)'
          }}
          className={(isMobile ? 'flex-column' : 'flex-row') + ' d-flex juaftify-content-between align-items-center col-6 p-5'}
        >
          <div className='me-5' style={{color: 'var(--deep-sky-blue)'}}>
            <FontAwesomeIcon icon='shopping-cart' style={{width: '25vh', height: '25vh'}} />
          </div>
          <div style={{height: '25vh'}} className='d-flex flex-column justify-content-around'>
            <div>
              <span className='h3'>{t('empty')}</span>
              <br/>
              <Link className='link h5' to='/'>
                <span>{t('return')}</span>
              </Link>
            </div>
            <div className='link mt-3 h5'>
              <span className='no-link h3'>{t('unfound')}?</span>
              <br/>
              <Hoverable text={t('request')} />
            </div>
          </div>
        </div>
      </div>
      }
      <div className='col-sm-1'></div>
    </div>
  </div>
}

