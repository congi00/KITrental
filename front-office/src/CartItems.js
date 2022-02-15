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

  const handleClick = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/API/rental/", {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify({ client_id: "id",
          product_id: "id",
          start_date: "dara",
          end_date: "ss"})
    }).then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err))
  }
  return(
    cartItems ? (
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
            <Button variant="danger"  onClick={handleClick}>
              Submit
            </Button>
        </Form>
      </div>
      ):(
        <div className="cartSection">
          <h1>CART</h1>
          <h2>Your cart is empty</h2>
          <Button className='emptyCartBtn'>
            Go to shop
          </Button>
        </div>
    )
  );
}

export default CartItems;
