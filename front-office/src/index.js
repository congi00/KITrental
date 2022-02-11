import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Landing from "./routes/Landing";
import JoinUs from "./routes/JoinUs";
import Login from "./routes/Login";
import Product from "./routes/Product";
import Inventory from "./routes/Inventory";
import Cart from "./routes/Cart";



ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />}/>
      <Route path="/joinus" element={<JoinUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/privateArea" element={<Login />} />
      <Route path="/rentalSingle" element={<Login />} />
      <Route path="/productSingle" element={<Product />} />
      <Route path="/catalog" element={<Inventory />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
