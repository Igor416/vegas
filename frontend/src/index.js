import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHandHoldingUsd,
  faPhone,
  faShoppingCart,
  faAngleDown,
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import App from "./components/App";
import Catalog from "./components/Catalog";
import ProductDetail from "./components/ProductDetail";

library.add(faHandHoldingUsd, faPhone, faShoppingCart, faAngleDown, faAngleUp, faAngleLeft, faAngleRight, faStar);

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="catalog/:category/:sub_category/" element={<Catalog/>}>
          <Route path=":filter/" element={<Catalog/>} />
        </Route>
        <Route path="product/:category/:id" element={<ProductDetail/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
