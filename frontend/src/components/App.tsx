import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { detectLang } from '../i18n';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { DetailedProduct, Price, Size } from '../JSONTypes';
import Cart from './services/cart';
import Header from './Header';
import MobileHeader from './MobileHeader';
import Footer from './Footer';

export interface OutletContext {
  isMobile: boolean,
  lang: string
  currency: keyof Price
  cart: Cart,
  updateCurrency: (currency: keyof Price) => void,
  addProduct: (category: string, product: DetailedProduct, size: Size, quantity: number) => void,
  deleteProduct: (category: string, name: string, size: string) => void,
  updateQuantity: (category: string, name: string, quantity: number) => void,
  getCurrencies: () => Array<keyof Price>
}

export default function App() {
  const [lang, setLang] = useState(detectLang())
  const [cookies, setCookie, removeCookie] = useCookies(['lang'])
  const [currency, setCurrency] = useState<keyof Price>('EUR')
  const isMobile = window.matchMedia('(max-width: 576px)').matches
  const [total, setTotal] = useState(0)
  const cart = new Cart();
  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    setTotal(cart.total)
  }, [])

  const updateCurrency = (currency: keyof Price) => {
    cart.updateCurrency(currency)
    setCurrency(currency)
    setTotal(cart.total)
  }

  const addProduct = (category: string, product: DetailedProduct, size: Size, quantity: number) => {
    cart.addProduct(category, product, size, quantity)
    setTotal(cart.total)
  }

  const deleteProduct = (category: string, name: string, size: string) => {
    cart.deleteProduct(category, name, size)
    setTotal(cart.total)
  }

  const updateQuantity = (category: string, name: string, quantity: number) => {
    cart.updateQuantity(category, name, quantity)
    setTotal(cart.total)
  }

  const updateLang = (newLang: string) => {
    i18n.changeLanguage(newLang);
    setCookie('lang', newLang, {path: '/'})
    setLang(newLang);
  }

  return (
    <div id='app'>
      {isMobile
      ?
      <MobileHeader updateLang={updateLang} lang={lang} currency={currency} total={total} />
      :
      <Header updateLang={updateLang} lang={lang} currency={currency} total={total} />
      }
      <Outlet context={{
        isMobile: isMobile,
        lang: lang,
        currency: currency,
        cart: cart,
        updateCurrency: updateCurrency,
        addProduct: addProduct,
        deleteProduct: deleteProduct,
        updateQuantity: updateQuantity,
        getCurrencies: cart.getCurrencies
      }}/>
      <Footer />
      <div id='cart' style={{
          bottom: '5vh',
          right: isMobile ? '5vw' : '2vw',
          width: document.getElementById('cart')?.offsetHeight,
          backgroundColor: 'var(--dark-cyan)'
        }} className='position-fixed d-flex justify-content-center align-items-center rounded-circle p-3'>
        <Link to='/cart' className='no-link no-hover'>
          <FontAwesomeIcon icon='shopping-cart' color='white'/>
        </Link>
      </div>
    </div>
  );
}