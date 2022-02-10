import React from 'react'
import Image from 'react-bootstrap/Image'
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap"
import ImageThumb from "./img/Blender.jpg"
import ImageThumb2 from "./img/torch.jpg"
import {Form, Button }from 'react-bootstrap'

function CartItems(){

  return(
    <div className="cartSection">
      <h1>CART</h1>
      <Form className="formCart">
          <Card className="cartItem">
            <Card.Body>
              <div className="thumbCart">
                <img thumbnail="true" src={ImageThumb} />
              </div>
              <div className="itemTitle">
                <h2>Blender</h2>
                <h3>Professional</h3>
              </div>
              <div className="itemPrice">
                <h2>322$</h2>
                <Form.Control type="number" placeholder="1" />
              </div>
            </Card.Body>
          </Card>
          <Card className="cartItem">
            <Card.Body>
              <div className="thumbCart">
                <img thumbnail="true" src={ImageThumb2} />
              </div>
              <div className="itemTitle">
                <h2>Torch</h2>
                <h3>Professional</h3>
              </div>
              <div className="itemPrice">
                <h2>322$</h2>
                <Form.Control type="number" placeholder="1" />
              </div>
            </Card.Body>
          </Card>
          <Card className="cartItem">
            <Card.Body>
              <div className="thumbCart">
                <img thumbnail="true" src={ImageThumb2} />
              </div>
              <div className="itemTitle">
                <h2>Torch</h2>
                <h3>Professional</h3>
              </div>
              <div className="itemPrice">
                <h2>322$</h2>
                <Form.Control type="number" placeholder="1" />
              </div>
            </Card.Body>
          </Card>
          <h2 className="totalItems">Total:</h2>
          <h2 className="totalItemsPrice">130$</h2>
          <Button variant="danger" type="submit">
            Submit
          </Button>
      </Form>
    </div>
  );
}

export default CartItems;
