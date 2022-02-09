import React from 'react'
import Image from 'react-bootstrap/Image'
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Button } from 'reactstrap';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap"
import ImageThumb from "./img/blender.jpg"

function CartItems(){
  return(
    <div className="cartSection">
      <h1>CART</h1>
      <Card>
        <Card.Body>
          <img thumbnail="true" src={ImageThumb} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default CartItems;
