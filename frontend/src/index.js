import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import App from "./components/App";
import Catalog from "./components/Catalog"

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="catalog/:product/:category" element={<Catalog/>}>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
