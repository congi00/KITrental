import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../products.css';
import Navbar from "../navbar";
import ProductsSingle from "../ProductsSingle";


function Products(){
  return(
    <div className="productsPage">
      <ProductsSingle/>
    </div>
  );
}

export default Products;
