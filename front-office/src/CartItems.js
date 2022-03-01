import React from 'react';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap";
import {Form, Button }from 'react-bootstrap';
import Cookies from 'universal-cookie';
import axios from 'Axios';
import $ from 'jquery'


function CartItems(){
  const cookies = new Cookies();
  const [cartItems,setcartItems] = React.useState(cookies.get('myCart'));
  const [totalPrice,setTotalPrice] = React.useState(0);
  const auth_token = sessionStorage.getItem("auth");
  const [logged, SetLogged] = React.useState(false);
  
  React.useEffect(() => {
    if(sessionStorage.getItem("token"))
      SetLogged(true);
    if(cartItems){
      const cartItemsF = cartItems.filter(x=> {if(x.qty != 0) return x});
      console.log(cartItemsF.length);
      if(cartItemsF.length != 0){
        cookies.set('myCart', cartItemsF, { path: '/' });


        axios.get("API/promotions/",{headers: {'auth': auth_token}})    
        .then((res) => {    
          console.log(res.data);
          var proms = res.data.promotions;
          console.log(proms)
          var changedCart =[]
          cartItems.forEach(item => {
            var pricePItem = item.price;
            for (const [key, value] of Object.entries(proms)) {
              var prom_start_date = new Date(value.start_date)
              var prom_end_date = new Date(value.end_date)
              if (new Date(item.startD) >= prom_start_date && new Date(item.endD) <= prom_end_date) {
                var old_rental_price = pricePItem 
                pricePItem = old_rental_price - ( old_rental_price / 100 * value.percentage )
              }
              console.log("Prima"+item.price)
              item.price = pricePItem
              console.log("Dopo"+item.price)
              setTotalPrice((prevState, props) => prevState + pricePItem)
            }
            console.log(cartItems)
            changedCart.push(item);
            console.log(changedCart)
            /*cartItems.map(item =>  (
              setTotalPrice((prevState, props) => prevState + item.price*item.qty)
            ))*/
          });
          setcartItems(changedCart)
          
        })
 
      }else
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
    /*client_id: req.body.client_id*/
    console.log()
    var datesP = [];
    var priceC = 0;
    var productsID = [];
    e.preventDefault();

    axios.get("API/promotions/",{headers: {'auth': auth_token}})    
          .then((res) => {    
            console.log(res.data);
            var proms = res.data.promotions;
            console.log(proms)
        
            cartItems.forEach(item => {
              var pricePItem = item.price;
              for (const [key, value] of Object.entries(proms)) {
                var prom_start_date = new Date(value.start_date)
                var prom_end_date = new Date(value.end_date)
                if (new Date(item.startD) >= prom_start_date && new Date(item.endD) <= prom_end_date) {
                  var old_rental_price = pricePItem 
                  pricePItem = old_rental_price - ( old_rental_price / 100 * value.percentage )
                }
              }
              datesP = datesP.concat([{startDate : item.startD, endDate : item.endD}]);
              productsID.push(item._id);
              priceC += pricePItem * item.qty * getDates(item.startD,item.endD);
              
              console.log(priceC);
            });
          })      
    
    $.ajax({
      url: "http://localhost:8000/API/rental/",
      type: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8000",
        "Access-Control-Allow-Methods":"DELETE, POST, GET",
        "Access-Control-Allow-Headers":"Content-Type, Authorization",
      },
      contentType: "application/json",
      data: JSON.stringify({ client_id: JSON.parse(sessionStorage.getItem("token")).id,
        products_id: productsID,
        start_date: new Date(),
        end_date: new Date(),
        datesProducts : datesP,
        price : priceC,
        state : "Pending",
      }),
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', auth_token)
        console.log("ECCOMIS")
      },
      success: res => {console.log(res);
        console.log("ECCOMI")
      },
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
          <Button className='emptyCartBtn' disabled={logged}>
            Go to shop
          </Button>
        </div>
    )
  );
}

export default CartItems;
