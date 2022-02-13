import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../products.css';
import Navbar from "../navbar";
import ProductsSingle from "../ProductsSingle";


const onAdd = (products) =>{
  console.log(cartItems);
  const exist = cartItems.find(x => x._id === products._id);
  if(exist)
    cartItems= cartItems.map(x=> x._id === products._id ? {...exist, qty: exist.qty +1 } : x)
  else
    //... notation = array concatenation
    cartItems= [...cartItems, { ...products, qty:1}]
}

var cartItems = [];

function Products(){
  return(
    <div className="productsPage">
      <ProductsSingle cartItems={cartItems} onAdd={onAdd}/>
    </div>
  );
}

export default Products;
