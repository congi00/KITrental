import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../products.css';
import Navbar from "../navbar";
import ProductsSingle from "../ProductsSingle";
import { useMediaQuery } from 'react-responsive';


function Products(){
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  return(
    <div>
      {isDesktop &&
        <Navbar />
      }
      <div className="productsPage">
        <ProductsSingle/>
      </div>
    </div>
  );
}

export default Products;
