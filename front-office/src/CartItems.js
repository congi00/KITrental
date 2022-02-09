import React from 'react'
import Image from 'react-bootstrap/Image'
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Button } from 'reactstrap';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap"
import ImageThumb from "./img/Blender.jpg"
import ImageThumb2 from "./img/torch.jpg"

function CartItems(){
  return(
    <div className="cartSection">
      <h1>CART</h1>
      <Card className="cartItem">
        <Card.Body>
          <div className="thumbCart">
            <img thumbnail="true" src={ImageThumb} />
          </div>
        </Card.Body>
      </Card>
      <Card className="cartItem">
        <Card.Body>
          <div className="thumbCart">
            <img thumbnail="true" src={ImageThumb2} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CartItems;
