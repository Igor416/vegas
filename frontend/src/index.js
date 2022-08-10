import React from "react";
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
  faStar,
  faMapMarkerAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import App from "./components/App.js";
import Home from "./components/Home.js";
import Catalog from "./components/Catalog.js";
import ProductDetail from "./components/ProductDetail.js";
import Cart from "./components/Cart.js";
import Shops from "./components/Shops.js";

library.add(faHandHoldingUsd, faPhone, faShoppingCart, faAngleDown, faAngleUp, faAngleLeft, faAngleRight, faStar, faMapMarkerAlt, faTrash);

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="catalog/:category/:sub_category/" element={<Catalog />}>
          <Route path=":filter" element={<Catalog />} />
        </Route>
        <Route path="product/:category/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="shops" element={<Shops />} />
        <Route path="" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
