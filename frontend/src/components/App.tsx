import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { Footer } from './footer';
import { MobileHeader, DesktopHeader } from './header';
import { ResponsiveProps } from '..';
import { CurrencyProvider } from '../providers';
import { CartProvider } from '../providers/cart';

export function App({isMobile}: ResponsiveProps) {
  const [cookies, setCookie, removeCookie] = useCookies(['lang'])
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language != cookies.lang) {
      setCookie('lang', i18n.language, {path: '/'})
    }
  }, [i18n.language])

  return <div id='app'>
    <CurrencyProvider value='EUR'>
      <CartProvider value={[]}>
        {isMobile
        ?
        <MobileHeader />
        :
        <DesktopHeader />
        }
        <Outlet/>
        <Footer />
      </CartProvider>
    </CurrencyProvider>
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
}