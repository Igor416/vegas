import { useEffect, useState } from 'react';
import { useOutletContext, Location, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DetailedProduct } from '../../JSONTypes';
import { getProduct } from '../../api';
import { SectionImage, CustomLink } from '../reusables';
import { Carousel } from './Carousel';
import { SizesPanel } from './SizesPanel';
import { Tabs } from './Tabs';
import { ResponsiveProps } from '../..';

export function ProductDetails({isMobile}: ResponsiveProps) {
  const params = useParams()
  const [product, setProduct] = useState<DetailedProduct>()
  const [t, i18n] = useTranslation('productDetails');

  useEffect(() => {
    getProduct(params.category as string, params.name as string).then(data => {
      if (data.category.name === 'Bed') {
        const [extra_length, extra_width] = Object.keys(data.characteristic).slice(2, 4).map(Number)
        data.characteristic[extra_length] = t('mattress') + ' + ' + data.characteristic[extra_length]
        data.characteristic[extra_width] = t('mattress') + ' + ' + data.characteristic[extra_width]
      }
      
      setProduct(data)
    })
  }, [i18n.language, params])

  return <div className='mt-5'>
    {product && !isMobile && <SectionImage category={product.category} collection={product.category.name === 'Mattress' && product?.characteristic['collection'] ? (product?.characteristic['collection'].toString()).toLowerCase() : undefined} />}
    <div className='container-fluid d-flex mt-5 mb-5 px-2 py-1 mb-sm-0 px-sm-5 py-sm-4'>
      <div className='col-sm-1'></div>
      {product && 
      <div className='col-sm-10'>
        <div className='d-flex flex-column mb-5'>
          <div className='d-flex row-nowrap h3'>
            <CustomLink to={`/catalog/${product.category.name}/all`} text={product.category.name_s}/>
            <span>&nbsp;{product.name}</span>
          </div>
          <div className={(isMobile ? 'flex-column' : 'row-nowrap') + ' d-flex mt-2 align-items-start'}>
            <Carousel product={product} />
            <SizesPanel t={t} product={product} />
          </div>
        </div>
        <Tabs isMobile={isMobile} t={t} product={product} />
      </div>
      }
      <div className='col-sm-1'></div>
    </div>
  </div>
}