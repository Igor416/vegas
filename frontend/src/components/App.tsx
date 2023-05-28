import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";

import Header from "./Header";
import MobileHeader from "./MobileHeader";
import Footer from "./Footer";
import { DetailedProduct, BasicProduct, Price, Size } from "./reusables/JSONTypes";

export interface OutletContext {
  isMobile: boolean,
  country: string,
  lang: string
  currency: keyof Price,
  products: BasicProduct[]
  total: number,
  updateCurrency: (currency: keyof Price) => void,
  addProduct: (category: string, product: DetailedProduct, size: Size, quantity: number) => void,
  deleteProduct: (category: string, id: number, size: string) => void,
  updateQuantity: (category: string, id: number, quantity: number) => void,
  getCurrencies: () => Array<keyof Price>
}

export default function App() {
  const [lang, setLang] = useState(detectLang())
  const [country, setCountry] = useState(Cookies.get('country') as string)
  const [currency, setCurrency] = useState<keyof Price>('EUR')
  const [products, setProducts] = useState(decodeProducts(Cookies.get('products') as string))
  const [total, setTotal] = useState(0)
  const isMobile = window.matchMedia("(max-width: 576px)").matches
  const [t, i18n] = useTranslation();

  const calcTotal = () => {
    let start = 0
    const sum = products.reduce((prev, curr) => prev + (curr.price[currency] as number), start)
    setTotal(sum);
  }

  useEffect(() => {
    calcTotal();
    i18n.changeLanguage(lang);
  }, [])

  const updateLang = (newLang: string) => {
    i18n.changeLanguage(newLang);
    history.pushState(location.pathname.replace(`?lang=${lang}`, `?lang=${newLang}`), '')
    setLang(newLang);
  }

  const getCurrencies = (): Array<keyof Price> => {
    const currencies = {
      'MD': ['MDL', 'EUR'],
      'RO': ['RON', 'EUR'],
      'US': ['USD', 'EUR']
    }

    if (country && country == 'RO' || country == 'US') {
      return currencies[country]
    }

    return currencies.MD
  }

  const updateCurrency = (currency: keyof Price) => {
    setCurrency(currency)
    calcTotal()
  }

  const addProduct = (category: string, product: DetailedProduct, size: Size, quantity: number) => {
    let contains, pr
    for (pr of products) {
      if (pr.id == product.id && pr.category == category && pr.size == size.width + ' x ' + size.length) {
        contains = true
        break
      }
    }
    if (contains) {
      updateQuantity(category, product.id, (pr as BasicProduct).quantity + quantity)
      return
    }

    let newProduct: BasicProduct = {
      category: category,
      name: product.name,
      id: product.id,
      discount: product.discount,
      size: size.width + ' x ' + size.length,
      quantity: quantity,
      price: {
        EUR: 0,
        MDL: 0,
        RON: 0,
        USD: 0,
      },
      sum: {
        EUR: 0,
        MDL: 0,
        RON: 0,
        USD: 0,
      }
    }

    for (let currency of getCurrencies()) {
      newProduct.price[currency] = size.price[currency];
      newProduct.sum[currency] = size.price[currency] * (100 - product.discount) / 100 * quantity
    }

    products.push(newProduct)
    setProducts(products)
    calcTotal()
    Cookies.set('products', encodeProducts(products))
  }

  const deleteProduct = (category: string, id: number, size: string) => {
    setProducts(products.filter(pr => !(pr.id == id && pr.category == category && pr.size == size)))
    calcTotal()
    Cookies.set('products', encodeProducts(products))
  }

  const updateQuantity = (category: string, id: number, quantity: number) => {
    const product = products.filter(pr => pr.category == category && pr.id == id)[0]
    for (let currency of getCurrencies()) {
      product.sum[currency] = +(product.sum[currency] * quantity / product.quantity).toFixed(2)
    }
    product.quantity = quantity
    products[products.indexOf(product)] == product
    setProducts(products)
    calcTotal()
    Cookies.set('products', encodeProducts(products))
  }

  return (
    <div>
      {isMobile
      ?
      <MobileHeader
        updateLang={updateLang}
        lang={lang}
        currency={currency}
        total={total}
      />
      :
      <Header
        updateLang={updateLang}
        lang={lang}
        currency={currency}
        total={total}
      />
      }
      <Outlet context={{
        isMobile: isMobile,
        country: country,
        lang: lang,
        currency: currency,
        products: products,
        total: total,
        updateCurrency: updateCurrency,
        addProduct: addProduct,
        deleteProduct: deleteProduct,
        updateQuantity: updateQuantity,
        getCurrencies: getCurrencies
        }}/>
      <Footer />
      <div
        id="cart"
        style={{
        bottom: '5vh',
        right: isMobile ? '5vw' : '2vw',
        width: document.getElementById('cart')?.offsetHeight,
        backgroundColor: 'var(--dark-cyan)'
        }}
        className="position-fixed d-flex justify-content-center align-items-center rounded-circle p-3"
      >
        <Link to={"/cart?lang=" + lang} className="no-link no-hover">
          <FontAwesomeIcon icon="shopping-cart" color="white"/>
        </Link>
      </div>
    </div>
  );
}

function detectLang(): string {
  let lang;
  let search = location.search;

  if (search.includes('?lang=')) {
    lang = search.replace('?lang=', '').slice(0, 2);
  } else {
    lang = navigator.language
    
    if (lang.includes('-')) {
      lang = lang.split('-')[0]
    }
  }
  
  if (search != `?lang=${lang}`) {
    location.replace(location.pathname + `?lang=${lang}`)
  }
  
  return lang;
}

function encodeProducts(products: BasicProduct[]): string {
  let s = ''
  for (let product of products) {
    for (let key in product) {
      if (key == 'price' || key == 'sum') {
        for (let currency in product[key]) {
          s += `${key + currency}=${product[key][currency]};`
        }
      } else {
        s += `${key}=${product[key as keyof BasicProduct]};`
      }
    }
    s += '/'
  }
  
  return s
}

function decodeProducts(s: string): BasicProduct[] {
  let products: BasicProduct[] = []
  if (s == undefined) {
    return products
  }

  for (let productDec of s.split('/').slice(0, -1)) {
    let productEnc: BasicProduct = {
      category: '',
      name: '',
      id: 0,
      discount: 0,
      size: '',
      quantity: 0,
      price: {
        EUR: 0,
        MDL: 0,
        RON: 0,
        USD: 0,
      },
      sum: {
        EUR: 0,
        MDL: 0,
        RON: 0,
        USD: 0,
      }
    }
    for (let pair of productDec.split(';')) {
      if (pair != '') {
        let key = pair.split('=')[0]
        let value: string | number = pair.split('=')[1]
        if (key.includes('price')) {
          productEnc.price[key.slice(-3)] = Number(value)
        } else if (key.includes('sum')) {
          productEnc.sum[key.slice(-3)] = Number(value)
        } else if (key == 'id' || key == 'discount' || key == 'quantity') {
          productEnc[key] = Number(value)
        } else if (key == 'category' || key == 'name' || key == 'size') {
          productEnc[key] = value
        }
      }
    }
    
    products.push(productEnc)
  }
  
  return products
}