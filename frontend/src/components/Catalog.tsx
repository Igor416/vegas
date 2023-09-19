import React, { useState } from 'react';
import { useParams, useOutletContext, Link, Location  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

import LocationListener from './reusables/LocationListener';
import { getProducts, getSales, sendProductHelp } from '../api';
import { Category, Price, ListProduct, ProductHelp } from '../JSONTypes';
import Form from './services/form';
import SectionImage from './reusables/SectionImage';
import Hoverable from './reusables/Hoverable';
import CustomButton from './reusables/CustomButton';
import CustomInput from './reusables/CustomInput';
import CustomPhoneInput from './reusables/CustomPhoneInput';
import { OutletContext } from './App';

interface SortedProducts {
  [key: string]: Array<ListProduct | null>
}

export default function Catalog() {
  const outletContext: OutletContext = useOutletContext()
  const isMobile = outletContext.isMobile;
  const params = useParams()
  const lang = outletContext.lang;
  const currency = outletContext.currency
  const [isGrid, toggleGrid] = useState(true)
  const [category, setCategory] = useState<Category>({} as Category)
  const [subCategory, setSubCategory] = useState<string>(params.sub_category as string)
  const [filter, setFilter] = useState(params.filter)
  const [products, setProducts] = useState<SortedProducts>()
  const [active, setActive] = useState<ListProduct>()
  const form = new Form<ProductHelp>(sendProductHelp)
  const [data, setData] = useState({} as ProductHelp)
  const [error, setError] = useState(false)
  const [t, i18n] = useTranslation('catalog');

  const updateProducts = (path: Location) => {
    const args = path.pathname.slice(1).split('/')
    //['catalog'|'sales', '<category>', '<subCategory>', '<?filter>']

    if (args[0] == 'catalog') {
      setSubCategory(args[2])
      setFilter(args.length == 4 ? args[3] : '')
      getProducts(args[1], args[2], args.length == 4 ? args[3] : '').then((data) => {
        setCategory(data[0].category);
        let sortedProducts: SortedProducts = {};
        let remainder;

        if (Array.isArray(data[0].default_filtering)) {
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < ( data.length - i -1 ); j++) {
              if (data[j].default_filtering.length < data[j+1].default_filtering.length) {
                [data[j], data[j+1]] = [data[j + 1], data[j]]
              }
            }
          }
        }

        for (let product of data) {
          if (product.default_filtering in sortedProducts) {
            sortedProducts[product.default_filtering].push(product)
          }
          else {
            sortedProducts[product.default_filtering] = [product]
          }
        }
        
        for (let filtering in sortedProducts) {
          sortedProducts[filtering] = sortedProducts[filtering].sort((p1, p2) => p1 && p2 ? p1.name.localeCompare(p2.name) : -1)
          remainder = sortedProducts[filtering].length % 3
          if (remainder != 0) {
            for (let i = 0; i < 3 - remainder; i++) {
              sortedProducts[filtering].push(null)
            }
          }
        }
        setProducts(sortedProducts)
      })
      return
    }
    getSales().then((data) => {
      let remainder = data.products.length % 3
      let sortedProducts: SortedProducts = {
        'sales': data.products
      }
      if (remainder != 0) {
        for (let i = 0; i < 3 - remainder; i++) {
          sortedProducts.sales.push(null)
        }
      }
      setCategory({
        name: 'sales',
        name_s: data.name_s,
        name_pl: data.name_pl,
        desc: '',
        default_filtering: '',
        default_filtering_lang: data.name_pl
      })
      setProducts(sortedProducts)
    })
  }

  const submitForm = () => {
    data.category = category.name != 'sales' ? category.name_s : active?.category.name_s as string
    data.product = active?.name as string
    let r = form.submitForm(data)

    if (r == 'error: empty') {
      setError(true)
    }
    else {
      $(function () {
        $('#modal').modal('toggle');
     });
    }
  }

  const changeLayout = () => {
    toggleGrid(!isGrid)
  }

  return (
    <div className='mt-5'>
      <LocationListener locationChanged={updateProducts} />
      {!isMobile && category.name !='sales' && <SectionImage category={category} collection={subCategory == 'collection' ? filter?.toLowerCase() : undefined} />}
      <div className='d-flex mt-5 px-2 py-1 px-sm-5 py-sm-4'>
        <div className='col-sm-1'></div>
        {products &&
        <div className='col-sm-10'>
          {!isMobile && 
          <div className='d-flex flex-row justify-content-end align-items-center h6'>
            <div className='d-flex flex-row me-2 me-sm-5 align-items-center'>
              {outletContext.getCurrencies().map((currency, index) => {
              return (
                <div
                  onClick={() => outletContext.updateCurrency(currency)}
                  className={'d-flex flex-row ' + (currency != currency && 'link')}
                  key={index}
                >
                  <Hoverable text={currency as string}/>
                  <span>&nbsp;</span>
                </div>
              )})}
            </div>
            <div
              onClick={changeLayout}
              className={(isGrid ? 'switch-grid' : 'switch-column') + ' switch d-flex transition'}>
              {[0, 1, 2].map((value) => {
              return <div key={value} className='bg-white transition' />
              })}
            </div>
          </div>
          }
          {Object.keys(products).map((filtering, index) => {
          return (
          <div key={index} className='d-flex mb-5 flex-column'>
            <span className='h4'>{category.default_filtering_lang} {filtering}</span>
            <div className={(isGrid ? 'section-grid' : 'section-column') + ' d-flex flex-wrap mt-3 justify-content-between transition'}>
            {products[filtering].map((product, index) => {
            if (product == null) {
              return <div key={index} />
            }
            return (
              <div key={index} className='d-flex shadow no-link mb-3 p-3'>
                <div style={{zIndex: 1000}} className='position-absolute d-flex p-3 h4'>
                  <div style={{color: (product.best ? 'gold' : 'var(--milk)')}}>
                    <FontAwesomeIcon icon={faStar as IconProp}/>
                  </div>
                  {product.discount != 0 &&
                  <div className='ms-2 ms-sm-4' style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                    <span>-{product.discount}%</span>
                  </div>
                  }
                </div>
                <div className='d-flex row-nowrap'>
                  <div className='position-relative d-flex flex-column flex-grow-1 flex-shrink-1'>
                    <img src={product.shortcut}/>
                    {category.name == 'sales' &&
                    <div className='position-absolute bottom-0 start-0 h5'>
                      <span>{`${product.size.length} x ${product.size.width}`}</span>
                    </div>
                    }
                  </div>
                  {isGrid && product.markers &&
                  <div style={{width: isMobile ? '50vw' : '12.5vw', height: isMobile ? 'calc(50vw + 2.5rem)' : 'calc(12.5vw + 2.5rem)'}} className='d-flex flex-column justify-content-start mt-3'>
                    {product.markers.map((marker, index) => {
                      return <img key={index} className='mb-2' src={marker}/>
                    })}
                  </div>
                  }
                </div>
                <div className='d-flex mt-3 flex-column justify-content-between'>
                  <div className='price d-flex flex-row justify-content-between align-items-end'>
                    <div className='h5 m-0'>
                      <Hoverable text={product.name} />
                    </div>
                    <div className='d-flex flex-column text-end'>
                    {product.discount != 0
                    ?
                      <div className='d-flex flex-column'>
                        <div style={{textDecoration: 'line-through'}}>
                          <span>
                            {`${product.size.price[currency]} (${currency})`}
                          </span>
                        </div>
                        <div>
                          <span>
                            {`${category.name != 'sales' ? t('from') : ''} `}
                          </span>
                          <span style={{color: 'var(--lime-green)'}} className='h5'>
                            {(product.size.price[currency] * (100 - product.discount) / 100).toFixed(2)}
                          </span>
                          <span>
                            {` (${currency})`}
                          </span>
                        </div>
                      </div>
                    :
                      <div className='d-flex flex-column'>
                        <span>
                          {`${category.name != 'sales' ? t('from') : ''} ${product.size.price[currency]} (${currency})`}
                        </span>
                      </div>
                    }
                    </div>
                  </div>
                  <div className='desc py-3 border-bottom border-muted'>
                    <span>{product.desc}</span>
                  </div>
                  {!isGrid && product.markers &&
                  <div style={{height: '5vh'}} className='d-flex row-nowrap justify-content-start'>
                    {product.markers.map((marker, index) => {
                    return (
                      <img key={index} src={marker} style={{width: '5vh', height: '5vh'}} className='me-2' />
                    )})}
                  </div>
                  }
                  <div className='d-flex mt-4 flex-row row-nowrap justify-content-between h5'>
                    {category.name != 'sales'
                    ?
                    <Link to={`/product/${category.name}/${product.name}`}>
                      <CustomButton color='lime-green' text={t('details')} />
                    </Link>
                    :
                    <Link to={`/product/${product.category.name}/${product.name}`}>
                      <CustomButton color='lime-green' text={t('details')} />
                    </Link>
                    }
                    <div onClick={() => setActive(product)} data-bs-toggle='modal' data-bs-target='#modal'>
                      <CustomButton color='deep-sky-blue' text={t('call')} />
                    </div>
                  </div>
                </div>
              </div>
            )})}
            </div>
          </div>
          )})}
          </div>
        }
        <div className='col-sm-1'></div>
      </div>
      <div className='modal fade' id='modal' tabIndex={-1}>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <span className='modal-title h5' id='modalLabel'>{t('call') + ` (${active?.name})`}</span>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <span>{t('desc')}</span>
              <br/>
              <span className='h6 text-danger'>{error ? t('error') : ''}</span>
              <form className='mt-3'>
                <label htmlFor='name'>{t('name')}</label>
                <br/>
                <CustomInput
                  color='dark-cyan'
                  className='px-0 mb-3'
                  type='text'
                  id='name'
                  value={data.name}
                  onChange={value => setData(form.updateForm(data, 'name', value))}
                />
                <CustomPhoneInput
                  lang={lang}
                  color='dark-cyan' 
                  phone={data.phone}
                  setPhone={phone => setData(form.updateForm(data, 'phone', phone))}
                />
              </form>
            </div>
            <div className='d-flex justify-content-between modal-footer'>
              <div data-bs-dismiss='modal'>
                <CustomButton color='lime-green' text={t('close')} />
              </div>
              <div onClick={submitForm}>
                <CustomButton color='deep-sky-blue' text={t('submit')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
