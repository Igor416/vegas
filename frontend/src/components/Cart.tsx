import React, { useState } from "react";
import { useOutletContext, Link, useLocation, Location } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next';

import LocationListener from "./reusables/LocationListener";
import { getCategory, getProduct, sendOrder } from "./reusables/api";
import Hoverable from './reusables/Hoverable';
import CustomPhoneInput from "./reusables/CustomPhoneInput";
import CustomButton from "./reusables/CustomButton";
import { OutletContext } from "./App";
import { BasicProduct, OrderedProduct, Category, Size, Order, Price } from "./reusables/JSONTypes";

interface Form {
  name: string,
  town: string,
  address: string,
  phone: string,
  payment: string,
  courier: string
}

export default function Cart() {
  let outletContext: OutletContext = useOutletContext()
  let isMobile = outletContext.isMobile;
  const [rawProducts, setRawProducts] = useState<BasicProduct[]>(outletContext.products);
  const [lang, setLang] = useState(outletContext.lang);
  let [products, setProducts] = useState<OrderedProduct[]>([])
  const [form, setForm] = useState<Form>({
    name: '',
    town: '',
    address: '',
    phone: '',
    payment: '',
    courier: 'yes'
  })
  const [error, setError] = useState(false)
  const [t, i18n] = useTranslation('cart');

  const updateProducts = (path: Location, locationChanged?: boolean) => {
    let lang = path.search.replace('?lang=', '');
    setLang(lang)
    let newProducts: OrderedProduct[] = []
    for (let raw_product of rawProducts) {
      getCategory(raw_product.category).then((data) => {
        let category: Category = data;
        getProduct(raw_product.category, raw_product.id).then((data) => {
          let sum: Price = {
            EUR: 0,
            MDL: 0,
            RON: 0,
            USD: 0,
          }
          let product = {
            id: data.id,
            name: data.name,
            category: category,
            discount: data.discount,
            shortcut: data.shortcut,
            size: extractSize(data.sizes, raw_product.size),
            quantity: raw_product.quantity,
            sum: sum
          }
          for (let currency of outletContext.getCurrencies()) {
            product.sum[currency] = raw_product.sum[currency]
          }
          newProducts.push(product)
          setProducts(newProducts)
        })
      })
    }
  }

  const extractSize = (sizes: Size[], dimensions: string): Size => {
    let [width, length] = dimensions.split(' x ').map(Number)

    for (let size of sizes) {
      if (size.width == width && size.length == length) {
        return size
      }
    }
    return sizes[0]
  }

  const updateQuantity = (category: Category, id: number, quantity: number) => {
    outletContext.updateQuantity(category.name, id, quantity)

    let product = products.filter(pr => pr.category.name == category.name && pr.id == id)[0]
    for (let currency of outletContext.getCurrencies()) {
      product.sum[currency] = +(product.sum[currency] * quantity / product.quantity).toFixed(2)
    }
    product.quantity = quantity
    products[products.indexOf(product)] == product

    setProducts(products)
  }

  const updateForm = (key: keyof Form, value: string) => {
    const changedForm = {...form}
    changedForm[key as keyof Form] = value
    setForm(changedForm)
  }

  const submitForm = () => {
    let r = sendOrder(Object.assign({
      products: rawProducts,
      total: outletContext.total + ` (${outletContext.currency})`
    }, form) as Order, Cookies.get('csrftoken') as string)

    if (r == 'error: empty') {
      setError(true)
    }
  }

  const deleteProduct = (category: string, product: OrderedProduct, size: Size) => {
    setRawProducts(rawProducts.filter(pr => !(pr.id == product.id && pr.category == category && pr.size == size.width + ' x ' + size.length)))

    outletContext.deleteProduct(category, product.id, size.width + ' x ' + size.length)
    updateProducts(useLocation())
  }

  
  return (
    <div className="mt-5">
      <LocationListener locationChanged={updateProducts} />
      <div className="container-fluid d-flex mt-5 mb-5 px-2 py-1 mb-sm-0 px-sm-5 py-sm-4">
        <div className="col-sm-1"></div>
        {products[0]
        ?
        <div className="col-12 col-sm-10 pt-0 pt-sm-5">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row justify-content-between">
              <span className={"h5" + (isMobile ? " border-bottom" : "")}>{t('cart')}</span>
            </div>
            {!isMobile &&
            <div
              style={{backgroundColor: 'var(--dark-cyan)'}}
              className="text-white row align-items-center text-center mt-3 rounded-pill"
            >
              <div className="col-2 h6 py-3 border-end border-white m-0">
                <span>{t('name')}: </span>
              </div>
              <div className="col-3 h6 py-3 border-end border-white m-0">
                <span>{t('shortcut')}: </span>
              </div>
              <div className="col-2 h6 py-3 border-end border-white m-0">
                <span>{t('size')}: </span>
              </div>
              <div className="col-1 h6 py-3 border-end border-white m-0">
                <span>{t('price')}: ({outletContext.currency})</span>
              </div>
              <div className="col-1 h6 py-3 border-end border-white m-0">
                <span>{t('discount')}: </span>
              </div>
              <div className="col-2 h6 py-3 border-end border-white m-0">
                <span>{t('quantity')}: </span>
              </div>
              <div className="col-1 h6 py-3 m-0">
                <span>{t('total')}: </span>
              </div>
            </div>
            }
            {products.map((pr, index) => {
            if (isMobile) {
            return (
            <div key={index} className="d-flex flex-column border-bottom">
              <div className="d-flex row-nowrap p-2">
                <img className="col-6" src={pr.shortcut} />
                <div className="d-flex flex-column col-6 align-items-centers pt-3">
                  <div className="d-flex row-nowrap">
                    <span>{pr.category.name_s} {pr.name}</span>
                    <span
                      style={{color: 'var(--lime-green)'}}
                      className="link h5"
                      onClick={() => deleteProduct(pr.category.name, pr, pr.size)}
                    >
                      &nbsp; <FontAwesomeIcon icon='trash' />
                    </span>
                  </div>
                  <span>{t('size')} {pr.size.width} x {pr.size.length}</span>
                  {pr.discount != 0 &&
                  <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
                  }
                </div>
              </div>
              <div className="d-flex row-nowrap justify-content-around align-items-center p-2">
                <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
                  <div onClick={() => updateQuantity(pr.category, pr.id, pr.quantity == 1 ? pr.quantity : pr.quantity - 1)}>
                    <span>-</span>
                  </div>
                  <div style={{width: '2rem'}} className="d-flex justify-content-center">
                    <span>{pr.quantity}</span>
                  </div>
                  <div onClick={() => updateQuantity(pr.category, pr.id, pr.quantity == 99 ? pr.quantity : Number(pr.quantity) + 1)}>
                    <span>+</span>
                  </div>
                </div>
                <span style={{ color: 'var(--deep-sky-blue)' }} className="h6">
                  {t('price')}: {pr.sum[outletContext.currency]} ({outletContext.currency})
                </span>
              </div>
            </div>
            )}
            return (
            <div key={index} className="row">
              <div className="col-2 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                <span>{pr.category.name_s} {pr.name}</span>
                <span
                  style={{color: 'var(--lime-green)'}}
                  className="link"
                  onClick={() => deleteProduct(pr.category.name, pr, pr.size)}
                >
                  &nbsp; <FontAwesomeIcon icon='trash' />
                </span>
              </div>
              <div className="col-3 border-bottom border-end">
                <img src={pr.shortcut} />
              </div>
              <div className="col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                <span>{t('size')} {pr.size.width} x {pr.size.length}</span>
              </div>
              <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                <span>{pr.size.price[outletContext.currency]}</span>
              </div>
              <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
              </div>
              <div className="col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
                  <div onClick={() => updateQuantity(pr.category, pr.id, pr.quantity == 1 ? pr.quantity : pr.quantity - 1)}>
                    <span>-</span>
                  </div>
                  <div style={{width: '2rem'}} className="d-flex justify-content-center">
                    <span>{pr.quantity}</span>
                  </div>
                  <div onClick={() => updateQuantity(pr.category, pr.id, pr.quantity == 99 ? pr.quantity : Number(pr.quantity) + 1)}>
                    <span>+</span>
                  </div>
                </div>
              </div>
              <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom m-0">
                <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.sum[outletContext.currency]}</span>
              </div>
            </div>
            )})}
            <div className="row text-center">
              <Link to={"/" + location.search} className={"d-flex justify-content-center no-link col-6 col-sm-2 pt-3" + (isMobile ? "" : "border-end")}>
                <CustomButton text={t('add')} color="lime-green"/>
              </Link>
              {!isMobile && <div className="col-9 border-end"></div>}
              <div style={{ color: 'var(--deep-sky-blue)' }} className="col-6 col-sm-1 d-flex justify-content-center align-items-center h5 m-0">
                <span>{outletContext.total} ({outletContext.currency})</span>
              </div>
            </div>
          </div>
          <div style={{border: isMobile ? '' : '1px solid var(--deep-sky-blue)'}} className="d-flex flex-column mt-5 p-0 p-sm-5">
            <span className="h6 text-danger">{error ? t('error') : ''}</span>
            <div className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex"}>
              <div className="d-flex col-sm-5 flex-column">
                <div>
                {['name', 'town', 'address'].map((field, index) => {
                if (field != 'payment') {
                return(
                  <div key={index}>
                    <label htmlFor={field}>{t(field)}</label>
                    <input
                      id={field}
                      value={form[field as keyof Form].toString()}
                      onChange={e => updateForm(field as keyof Form, e.target.value)}
                      type="text"
                      style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
                      className="outline-0 no-hover w-100 px-0 mb-3 col-12"
                    />
                  </div>
                )}})}
                <CustomPhoneInput lang={lang} color='lime-green' phone={form.phone} setPhone={phone => updateForm('phone', phone)} />
                </div>
              </div>
              {!isMobile && <div className="col-1"></div>}
              <div className="d-flex flex-column col-sm-3 mt-3 mt-sm-0">
              {[1, 2, 3].map((num, index) => {
              return (
                <div
                  key={index}
                  className="d-flex justify-content-start row-nowrap pb-3 mb-4"
                  style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
                >
                  <input
                    id={'payment' + num}
                    value={t('payment' + num)}
                    className="me-3"
                    onClick={() => {updateForm('payment', t('payment' + num))}}
                    type="radio"
                  />
                  <label htmlFor={'payment' + num}>{t('payment' + num)}</label>
                </div>
              )})}
              </div>
              <div className="d-flex row-nowrap justify-content-end align-items-start col-sm-3 mt-3 mt-sm-0">
                <div
                  onClick={() => updateForm('courier', 'yes')}
                  style={{border: '1px solid var(--deep-sky-blue)', borderRight: 'none'}}
                  className={(form.courier ? "form-button-active" : "form-button-unactive") + " p-3 transition"}
                >
                  <span>{t('courier')}</span>
                </div>
                <div
                  onClick={() => updateForm('courier', 'no')}
                  style={{border: '1px solid var(--deep-sky-blue)', borderLeft: 'none'}}
                  className={(!form.courier ? "form-button-active" : "form-button-unactive") + " p-3 transition"}
                >
                  <span>{t('pickup')}</span>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3 mt-sm-0" onClick={submitForm}>
              <CustomButton color="deep-sky-blue" text={t('submit')} />
            </div>
          </div>
        </div>
        :
        <div style={{height: '60vh'}} className="col-12 col-sm-10 pt-0 pt-sm-5 d-flex align-items-center justify-content-center mb-sm-5">
          <div style={{
            width: isMobile ? '100vw' : '60vw',
            backgroundColor: isMobile ? 'white' : 'var(--milk)'
            }}
            className={(isMobile ? "flex-column" : "flex-row") + " d-flex juaftify-content-between align-items-center col-6 p-5"}
          >
            <div className="me-5" style={{color: 'var(--deep-sky-blue)'}}>
              <FontAwesomeIcon icon='shopping-cart' style={{width: '25vh', height: '25vh'}} />
            </div>
            <div style={{height: '25vh'}} className="d-flex flex-column justify-content-around">
              <div>
                <span className="h3">{t('empty')}</span>
                <br/>
                <Link className="link h5" to="/">
                  <span>{t('return')}</span>
                </Link>
              </div>
              <div className="link mt-3 h5">
                <span className="no-link h3">{t('unfound')}?</span>
                <br/>
                <Hoverable text={t('request')} />
              </div>
            </div>
          </div>
        </div>
        }
        <div className="col-sm-1"></div>
      </div>
    </div>
  );
}

