import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import { Link } from "react-router-dom";
import '../cart.css';
import Navbar from "../navbar";
import CartItems from "../CartItems";


function Cart(){
  return(
    <div className="CartPage">
      <Navbar/>
      <CartItems/>
    </div>
  );
}

export default Cart;
