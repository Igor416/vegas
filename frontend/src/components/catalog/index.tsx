import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ListProduct, Category } from '../../JSONTypes';
import { getProducts, getSales } from '../../api';
import { SectionImage } from '../reusables';
import { Modal } from './Modal';
import { CategoryPanel } from './CategoryPanel';
import { ResponsiveProps } from '../..';

interface CatalogProps extends ResponsiveProps {
  isSales: boolean
}

export function Catalog({isMobile, isSales}: CatalogProps) {
  const params = useParams()
  const [category, setCategory] = useState<Category>({} as Category)
  const [subCategory, setSubCategory] = useState<string>(params.subCategory as string)
  const [filter, setFilter] = useState(params.filter)
  const [active, setActive] = useState<ListProduct>()
  const [products, setProducts] = useState<ListProduct[]>([])
  const [t, i18n] = useTranslation('catalog');

  useEffect(() => {
    if (isSales) {
      getSales().then((data) => {
        setCategory({
          name: 'sales',
          name_s: data.name_s,
          name_pl: data.name_pl,
          desc: '',
          default_filtering: '',
          default_filtering_lang: data.name_pl
        })
        setProducts(data.products)
      })
      return
    }
    setSubCategory(params.subCategory as string)
    setFilter(params.filter ? params.filter : '')
    getProducts(params.category as string, params.subCategory as string, params.filter ? params.filter : '').then(data => {
      setCategory(data[0].category);
      setProducts(data)
    })
  }, [i18n.language, params])

  return <div className='mt-5'>
    {!isMobile && !isSales && <SectionImage category={category} collection={subCategory === 'collection' ? filter?.toLowerCase() : undefined} />}
    <div className={'d-flex mt-5 px-2 py-1 px-sm-5 py-sm-4' + (isSales ? ' mt-5' : '')}>
      <div className='col-sm-1'></div>
      <div className='col-sm-10'>
        <CategoryPanel
          isMobile={isMobile}
          t={t}
          isSales={isSales}
          rawProducts={products}
          category={category}
          setActive={setActive}
        />
      </div>
      <div className='col-sm-1'></div>
    </div>
    <Modal t={t} lang={i18n.language} active={active as ListProduct} />
  </div>
}
