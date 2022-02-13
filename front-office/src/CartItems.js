import React from 'react';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap";
import {Form, Button }from 'react-bootstrap';
import Cookies from 'universal-cookie';


function CartItems(){
  const cookies = new Cookies();
  const cartItems = cookies.get('myCart');
  return(
    <div className="cartSection">
      <h1>CART</h1>
      <Form className="formCart">
        {cartItems.map(item => (
          <Card className="cartItem">
            <Card.Body>
              <div className="thumbCart">
                <img thumbnail="true" src={'img/products/'+item.image} />
              </div>
              <div className="itemTitle">
                <h2>{item.name}</h2>
                <h3>Professional</h3>
              </div>
              <div className="itemPrice">
                <h2>{item.price}</h2>
                <Form.Control type="number" placeholder={item.qty} />
              </div>
            </Card.Body>
          </Card>
          ))}
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
