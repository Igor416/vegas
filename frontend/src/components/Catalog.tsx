import React, { useState } from "react";
import { useParams, useOutletContext, Link, Location  } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next';

import LocationListener from "./reusables/LocationListener";
import SectionImage from "./reusables/SectionImage";
import { getCategory, getProducts, getSales, sendHelp } from "./reusables/api";
import Hoverable from './reusables/Hoverable';
import CustomButton from './reusables/CustomButton';
import CustomPhoneInput from './reusables/CustomPhoneInput';
import { OutletContext } from "./App";
import { Category, Price, Product } from "./reusables/JSONTypes";

interface Form {
  name: string,
  phone: string
}

interface SortedProducts {
  [key: string]: Array<Product | null>
}

export default function Catalog() {
  let outletContext: OutletContext = useOutletContext()
  let isMobile = outletContext.isMobile;
  const params = useParams()
  const [isGrid, toggleGrid] = useState(true)
  const [lang, setLang] = useState(outletContext.lang);
  const [currency, setCurrency] = useState(outletContext.currency)
  const [category, setCategory] = useState<Category>({
    name: params.category ? params.category : 'sales',
    name_s: '',
    name_pl: '',
    default_filtering: '',
    default_filtering_lang: ''
  })
  const [subCategory, setSubCategory] = useState<string>(params.sub_category as string)
  const [filter, setFilter] = useState(params.filter)
  const [products, setProducts] = useState<SortedProducts>()
  const [active, setActive] = useState<null | Product>(null)
  const [form, setForm] = useState<Form>({
    name: '',
    phone: ''
  })
  const [error, setError] = useState(false)
  const [t, i18n] = useTranslation('catalog');

  const updateProducts = (path: Location) => {
    setLang(path.search.replace('?lang=', ''))
    let args = path.pathname.slice(1).split('/')
    //['catalog|sales', '<category>', '<subCategory>', '<?filter>']

    if (args[0] == 'catalog') {
      setSubCategory(args[2])
      setFilter(args.length == 4 ? args[3] : '')
      getCategory(args[1]).then((category_data) => {
        setCategory(category_data);
        getProducts(category.name, subCategory, filter).then((data) => {
          let sortedProducts: SortedProducts = {
            
          };
          let filtering, remainder;

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
        default_filtering: '',
        default_filtering_lang: data.name_pl
      })
      setProducts(sortedProducts)
    })
  }

  const updateCurrency = (currency: keyof Price) => {
    setCurrency(currency)
    outletContext.updateCurrency(currency)
  }

  const updateForm = (key: keyof Form, value: string) => {
    const changedForm = {...form}
    changedForm[key as keyof Form] = value
    setForm(changedForm)
  }

  const submitForm = () => {
    let r = sendHelp({
      category: category.name != 'sales' ? category.name_s : active?.category,
      product: active?.name,
      name: form.name,
      phone: form.phone
    }, Cookies.get('csrftoken') as string)

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
    <div className="mt-5">
      <LocationListener locationChanged={updateProducts} />
      {!isMobile && category.name !='sales' && <SectionImage category={category} collection={subCategory == 'collection' ? filter?.toLowerCase() : undefined} />}
      <div className="d-flex mt-5 px-2 py-1 px-sm-5 py-sm-4">
        <div className="col-sm-1"></div>
        {products &&
        <div className="col-sm-10">
          {!isMobile && 
          <div className="d-flex flex-row justify-content-end align-items-center h6">
            <div className="d-flex flex-row me-2 me-sm-5 align-items-center">
              {outletContext.getCurrencies().map((currency, index) => {
              return (
                <div
                  onClick={() => updateCurrency(currency)}
                  className={"d-flex flex-row " + (currency != currency && "link")}
                  key={index}
                >
                  <Hoverable text={currency as string}/>
                  <span>&nbsp;</span>
                </div>
              )})}
            </div>
            <div
              onClick={changeLayout}
              className={(isGrid ? "switch-grid" : "switch-column") + " switch d-flex transition"}>
              {[0, 1, 2].map((value) => {
              return <div key={value} className="bg-white transition" />
              })}
            </div>
          </div>
          }
          {Object.keys(products).map((filtering, index) => {
          return (
          <div key={index} className="d-flex mb-5 flex-column">
            <span className="h4">{category.default_filtering_lang} {filtering}</span>
            <div className={(isGrid ? "section-grid" : "section-column") + " d-flex flex-wrap mt-3 justify-content-between transition"}>
            {products[filtering].map((product, index) => {
            if (product == null) {
              return <div key={index} />
            }
            return (
              <div key={index} className="d-flex shadow no-link mb-3 p-3">
                <div style={{zIndex: 1000}} className="position-absolute d-flex p-3 h4">
                  <div style={{color: (product.best ? 'gold' : 'var(--milk)')}}>
                    <FontAwesomeIcon icon={faStar as IconProp}/>
                  </div>
                  {product.discount != 0 &&
                  <div className="ms-2 ms-sm-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                    <span>-{product.discount}%</span>
                  </div>
                  }
                </div>
                <div className="d-flex row-nowrap">
                  <div className="position-relative d-flex flex-column flex-grow-1 flex-shrink-1">
                    <img src={product.shortcut}/>
                    {category.name == 'sales' &&
                    <div className="position-absolute bottom-0 start-0 h5">
                      <span>{`${product.size.length} x ${product.size.width}`}</span>
                    </div>
                    }
                  </div>
                  {isGrid && product.markers &&
                  <div style={{width: isMobile ? '50vw' : '12.5vw', height: isMobile ? 'calc(50vw + 2.5rem)' : 'calc(12.5vw + 2.5rem)'}} className="d-flex flex-column justify-content-start mt-3">
                    {product.markers.map((marker, index) => {
                      return <img key={index} className="mb-2" src={marker}/>
                    })}
                  </div>
                  }
                </div>
                <div className="d-flex mt-3 flex-column justify-content-between">
                  <div className="price d-flex flex-row justify-content-between align-items-end">
                    <div className="h5 m-0">
                      <Hoverable text={product.name} />
                    </div>
                    <div className="d-flex flex-column text-end">
                    {product.discount != 0
                    ?
                      <div className="d-flex flex-column">
                        <div style={{textDecoration: 'line-through'}}>
                          <span>
                            {`${product.size.price[currency]} (${currency})`}
                          </span>
                        </div>
                        <div>
                          <span>
                            {`${category.name != 'sales' ? t('from') : ''} `}
                          </span>
                          <span style={{color: 'var(--lime-green)'}} className="h5">
                            {(product.size.price[currency] * (100 - product.discount) / 100).toFixed(2)}
                          </span>
                          <span>
                            {` (${currency})`}
                          </span>
                        </div>
                      </div>
                    :
                      <div className="d-flex flex-column">
                        <span>
                          {`${category.name != 'sales' ? t('from') : ''} ${product.size.price[currency]} (${currency})`}
                        </span>
                      </div>
                    }
                    </div>
                  </div>
                  <div className="desc py-3 border-bottom border-muted">
                    <span>{product.desc}</span>
                  </div>
                  {!isGrid && product.markers &&
                  <div style={{height: '5vh'}} className="d-flex row-nowrap justify-content-start">
                    {product.markers.map((marker, index) => {
                    return (
                      <img key={index} src={marker} style={{width: '5vh', height: '5vh'}} className="me-2" />
                    )})}
                  </div>
                  }
                  <div className="d-flex mt-4 flex-row row-nowrap justify-content-between h5">
                    {category.name != 'sales'
                    ?
                    <Link to={`/product/${category.name}/${product.id}` + location.search}>
                      <CustomButton color="lime-green" text={t('details')} />
                    </Link>
                    :
                    <Link to={`/product/${product.category}/${product.id}` + location.search}>
                      <CustomButton color="lime-green" text={t('details')} />
                    </Link>
                    }
                    <div onClick={() => setActive(product)} data-bs-toggle="modal" data-bs-target="#modal">
                      <CustomButton color="deep-sky-blue" text={t('call')} />
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
        <div className="col-sm-1"></div>
      </div>
      <div className="modal fade" id="modal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title h5" id="modalLabel">{t('call') + ` (${active?.name})`}</span>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <span>{t('desc')}</span>
              <br/>
              <span className="h6 text-danger">{error ? t('error') : ''}</span>
              <form className="mt-3">
                <label htmlFor="name">{t('name')}</label>
                <br/>
                <input
                  style={{border: 'none', borderBottom: '1px solid var(--dark-cyan)'}}
                  className="outline-0 no-hover w-100 px-0 mb-3"
                  type="text"
                  id="name"
                  placeholder="..."
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                />
                <CustomPhoneInput
                  lang={lang}
                  color="dark-cyan" 
                  phone={form.phone}
                  setPhone={phone => updateForm('phone', phone)}
                />
              </form>
            </div>
            <div className="d-flex justify-content-between modal-footer">
              <div data-bs-dismiss="modal">
                <CustomButton color="lime-green" text={t('close')} />
              </div>
              <div onClick={submitForm}>
                <CustomButton color="deep-sky-blue" text={t('submit')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
