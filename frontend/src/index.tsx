import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import geti18n from './i18n';
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

import App from './components/App';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Stock from './components/Stock';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Shops from './components/Shops';

function render() {
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='catalog/:category/:sub_category/' element={<Catalog />}>
            <Route path=':filter' element={<Catalog />} />
          </Route>
          <Route path='sales' element={<Catalog />} />
          <Route path='stock' element={<Stock />} />
          <Route path='product/:category/:name' element={<ProductDetails />} />
          <Route path='cart' element={<Cart />} />
          <Route path='shops' element={<Shops />} />
          <Route path='' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}