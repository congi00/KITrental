import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import {Card} from "react-bootstrap";
import {Form, Button }from 'react-bootstrap';
import {Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios';
import $ from 'jquery'
import { useNavigate } from "react-router-dom";

function CartItems(){
  const cookies = new Cookies();
  const [cartItems,setcartItems] = React.useState(cookies.get('myCart'));
  const [totalPrice,setTotalPrice] = React.useState(0);
  const auth_token = sessionStorage.getItem("auth");
  const [logged, SetLogged] = React.useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    console.log('Apparently calculation of price (when the user opens the)')
    if(sessionStorage.getItem("token"))
      SetLogged(true);
    if(cartItems){
      const cartItemsF = cartItems.filter(x=> {if(x.qty != 0) return x});
      console.log(cartItemsF.length);
      if(cartItemsF.length != 0){
        cookies.set('myCart', cartItemsF, { path: '/' });

        // Calculation discounted price
        // Promotions
        axios.get("API/promotions/",{headers: {'auth': auth_token}})    
        .then((res) => {    
          // console.log(res.data);
          var proms = res.data.promotions;
          // console.log(proms)
          var changedCart =[]
          var discountsMSG
          cartItems.forEach(item => {
            discountsMSG = ''
            var pricePItem = item.price;
            for (const [key, value] of Object.entries(proms)) {
              var prom_start_date = new Date(value.start_date)
              var prom_end_date = new Date(value.end_date)
              if (new Date(item.startD) >= prom_start_date && new Date(item.endD) <= prom_end_date) {
                var old_rental_price = pricePItem 
                pricePItem = old_rental_price - ( old_rental_price / 100 * value.percentage )
                console.log(old_rental_price - ( old_rental_price / 100 * value.percentage ))
                if (discountsMSG == ''){
                  discountsMSG += '-' + value.percentage + "% for " + value.name + " promotion"
                }else{
                    discountsMSG += ', ' + '-' + value.percentage + "% for " + value.name + " promotion"
                }
              }

              // Weekdays discount (inner Mon-Tue-Wed)
              // products_dates.forEach((d, index) => {
                var start_day = new Date(item.startD).getDay() // Sunday = 0, Monday = 1, ...
                // var diffInDays = products_mult_prices[index] / products_prices[index]
                const diffInMs   = (new Date(item.startD)).getTime() - (new Date(item.endD)).getTime()
                const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
                var current_day = start_day
                var discounted = false
                var inner_weekdays = false

                // Checking for weekdays discounts
                for(var i=0; i < diffInDays; i++) {
                    // Start weekdays check
                    if(current_day == 0) {
                      inner_weekdays = true;
                    }
            
                    // Inner weekdays Confirmed
                    if(current_day == 4 && inner_weekdays) {
                      var sub_amount = item.price + item.price * 0.5 + item.price * 0.25 // For free on Mondays, 50% on Tuesdays, 25% on Wednesdays 
                      pricePItem -= sub_amount
                      // if (index == singleProduct)
                      //     singleProductPrice -= sub_amount
                      inner_weekdays = false;
                      discounted = true;
                      console.log(sub_amount)
                      // console.log('discounts')
                        if (discountsMSG == ''){
                            discountsMSG += '-' + sub_amount + '$'
                        }else{
                            discountsMSG += ' , ' + '-' + sub_amount + '$'
                        }
                        console.log(discountsMSG)
                    }
                    
                    if (current_day == 6) current_day = 0
                    else current_day++
                }
                if (discounted) discountsMSG += ' for inner Mon-Tue-Wed'
                
                // })

              console.log("Prima "+item.price)
              item.price = pricePItem
              console.log("Dopo "+item.price)
              setTotalPrice((prevState, props) => prevState + pricePItem)
            }
            console.log(cartItems)
            changedCart.push(item);
            console.log(changedCart)
            /*cartItems.map(item =>  (
              setTotalPrice((prevState, props) => prevState + item.price*item.qty)
            ))*/
          });
          console.log(discountsMSG)
          setcartItems(changedCart)
          console.log(cartItems);
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
    e.preventDefault();
    var datesP = [];
    var priceC = 0;
    var productsID = [];
    axios.get("API/promotions/",{headers: {'auth': auth_token}})    
          .then((res) => {    
            
            console.log(res.data);
            var proms = res.data.promotions;
            console.log(proms)
            var pricesProducts = []
            var real_price =0;
            cartItems.forEach(item => {

              var pricePItem = item.price;
              for (const [key, value] of Object.entries(proms)) {
                var prom_start_date = new Date(value.start_date)
                var prom_end_date = new Date(value.end_date)
                if (new Date(item.startD) >= prom_start_date && new Date(item.endD) <= prom_end_date) {
                  var old_rental_price = pricePItem 
                  pricePItem = old_rental_price - ( old_rental_price / 100 * value.percentage )
                  console.log(pricePItem)
                }
              }
              pricesProducts.push(parseInt(pricePItem));
              datesP = datesP.concat([{startDate : item.startD, endDate : item.endD}]);
              productsID.push(item._id);
              console.log(pricePItem)
              priceC += pricePItem * getDates(item.startD,item.endD);
              real_price += item.price* getDates(item.startD,item.endD);
              console.log(priceC);
              
            });
            $.ajax({
              url: "/API/rental/",
              type: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://site202126.tw.cs.unibo.it/",
                "Access-Control-Allow-Methods":"DELETE, POST, GET",
                "Access-Control-Allow-Headers":"Content-Type, Authorization",
              },
              contentType: "application/json",
              data: JSON.stringify({ client_id: JSON.parse(sessionStorage.getItem("token")).id,
                products_id: productsID,
                start_date: new Date(),
                datesProducts : datesP,
                price : priceC,
                state : "Accepted",
                real_price : real_price,
                pricesProducts: pricesProducts
              }),
              beforeSend: xhr => {
                xhr.setRequestHeader('auth', auth_token)
              },
              success: res => {
                cartItems.forEach(item => {
                  $.ajax({
                    url: "API/inventory/" + item._id,
                    type: "PATCH",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({indisponibilityDates : datesP}),
                    beforeSend: xhr => {
                      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
                    },
                    success: function (response) {
                      if (response) {
                        window.location.href="/privateArea";
                      } else {
                        alert("There was an error.");
                      }
                    },
                  });
                });
              },
              error: err => {console.log(err)}
            });
          })      
          /*<!-- onChange={e => onTodoChange(e.target.value,item)} -->*/
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
          <Link to="/catalog">
            <Button className='emptyCartBtn'>
              Go to shop
            </Button>
          </Link>
        </div>
    )
  );
}

export default CartItems;