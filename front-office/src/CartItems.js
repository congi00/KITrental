import React from 'react';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap";
import {Form, Button }from 'react-bootstrap';
import Cookies from 'universal-cookie';
import $ from 'jquery'


function CartItems(){
  const cookies = new Cookies();
  const cartItems = cookies.get('myCart');
  const [totalPrice,setTotalPrice] = React.useState(0);
  const auth_token = sessionStorage.getItem("auth")
  
  React.useEffect(() => {
    console.log(cartItems);
    if(cartItems){
      const cartItemsF = cartItems.filter(x=> {if(x.qty != 0) return x});
      console.log(cartItemsF.length);
      if(cartItemsF.length != 0){
        cookies.set('myCart', cartItemsF, { path: '/' });
        cartItems.map(item =>  (
          setTotalPrice((prevState, props) => prevState + item.price*item.qty)
      ))}
      else
        cookies.remove("myCart");
    }
  }, []);

  const onTodoChange = (value,product) =>{
    const cartItems = cookies.get('myCart');
    const exist = cartItems.find(x => x._id === product._id);
    console.log(exist);

    if(exist && value == 0 && cartItems.length == 1)
    cookies.remove("myCart");
    else if(exist){
      cookies.set('myCart', cartItems.map(x=> x._id === product._id ? {...exist, qty: parseFloat(value) } : x), { path: '/' });
    }
    console.log(cookies.get('myCart'));
    window.location.reload(false);
  }


  const getDates = (startDate, endDate) => {
    let dates = 0  
      const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
      }

      var currentDate = startDate
      while (currentDate <= endDate) {
        dates ++
        currentDate = addDays.call(currentDate, 1)
      }
      
    return dates;
    
  }


  const handleClick = (e) => {
    /*client_id: req.body.client_id,
    products_id: req.body.products_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    state: req.body.state,
    price: req.body.price*/
    e.preventDefault();
    cartItems.map(item => (
      console.log(item.startD),
      console.log(item.endD),
      console.log(getDates(item.startD,item.endD)),
      console.log(item.price * item.qty * getDates(item.startD,item.endD))
    ));
    
    $.ajax({
      url: "http://localhost:8000/API/rental/",
      type: "POST",
      body: JSON.stringify({ client_id: "c",
        product_id: "c",
        start_date: new Date(),
        end_date: new Date()}),
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', auth_token)
      },
      success: res => {console.log(res)},
      error: err => {console.log(err)}
    });

    // fetch("http://localhost:8000/API/rental/", {
    //     method: 'POST',
    //     headers: new Headers(),
    //     body: JSON.stringify({ client_id: "id",
    //       product_id: "id",
    //       start_date: "dara",
    //       end_date: "ss"})
    // }).then((res) => res.json())
    //     .then((data) => console.log(data))
    //     .catch((err) => console.log(err))
  }
  return(
    cartItems ? (
      <div className="cartSection container">
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
                  <h3>{item.category}</h3>
                </div>
                <div className="itemPrice">
                  <h2>{item.price*item.qty}$</h2>
                  <Form.Control type="number" min="0" placeholder={item.qty} onChange={e => onTodoChange(e.target.value,item)} />
                </div>
              </Card.Body>
            </Card>
            ))}
            <div className="total-price-wrapper">
              <h2 className="totalItems">Total:</h2>
              <h2 className="totalItemsPrice">{totalPrice}$</h2>
            </div>
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
