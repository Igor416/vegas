import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { geti18n } from './i18n';
import Cookies from 'js-cookie';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHandHoldingUsd,
  faPhone,
  faShoppingCart,
  faAngleDown,
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faStar,
  faMapMarkerAlt,
  faTrash,
  faCalendarAlt,
  faEnvelope,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const icons = [
  faHandHoldingUsd,
  faPhone,
  faShoppingCart,
  faAngleDown,
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faStar,
  faMapMarkerAlt,
  faTrash,
  faCalendarAlt,
  faEnvelope,
  faCheckCircle,
  faFacebook
]

library.add.apply(library, icons);

const appDiv = document.getElementById('main') as HTMLElement;
const root = createRoot(appDiv);

geti18n()
if (Cookies.get('country')) {
  render()
} else {
  fetch('https://api.country.is/').then(response => response.json()).then(data => {
    Cookies.set('country', data.country);
    render();
  })
}

import { App } from './components/App';
import { Home } from './components/home';
import { Catalog } from './components/catalog';
import { StockProducts } from './components/stockProducts';
import { ProductDetails } from './components/productDetails';
import { Cart } from './components/cart';
import { Shops } from './components/shops';
import { i18n } from 'i18next';

export interface ResponsiveProps {
  isMobile: boolean
}

export interface TranslatableProps {
  t: (val: string) => string,
  lang?: string,
  i18n?: i18n
}

function render() {
  const isMobile = window.matchMedia('(max-width: 576px)').matches
  
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App isMobile={isMobile} />}>
          <Route path='catalog/:category/:subCategory/' element={<Catalog isMobile={isMobile} isSales={false} />}>
            <Route path=':filter' element={<Catalog isMobile={isMobile} isSales={false} />} />
          </Route>
          <Route path='sales' element={<Catalog isMobile={isMobile} isSales={true} />} />
          <Route path='stock' element={<StockProducts isMobile={isMobile} />} />
          <Route path='product/:category/:name' element={<ProductDetails isMobile={isMobile} />} />
          <Route path='cart' element={<Cart isMobile={isMobile} />} />
          <Route path='shops' element={<Shops isMobile={isMobile} />} />
          <Route path='' element={<Home isMobile={isMobile} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}