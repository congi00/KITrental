import React from 'react'
import Image from 'react-bootstrap/Image'
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap"
import ImageThumb from "./img/Blender.jpg"

function CartItems(){
  return(
    <div className="cartSection">
      <Card>
        <Card.Body>
          <img thumbnail="true" src={ImageThumb} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default CartItems;
