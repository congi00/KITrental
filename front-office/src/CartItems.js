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
  const [DiscountsMSG,setDiscountsMSG] = React.useState("");

  

  React.useEffect(() => {
    if(sessionStorage.getItem("token"))
      SetLogged(true);
    
    if(cartItems){
      //const cartItemsF = cartItems; //.filter(x=> {if(x.qty != 0) return x});
      if(cartItems.length != 0){
        axios.get("API/promotions/",{headers: {'auth': auth_token}})    
        .then((res) => {       
          var proms = res.data.promotions;  
          var total_price = 0;
          cartItems.forEach((item,index,arrayCart) => {
            var itemUpdate = item
            var pricePItem = item.price;
            console.log("Prezzo per item"+pricePItem);
            for (const [key, value] of Object.entries(proms)) {
              var prom_start_date = new Date(value.start_date)
              var prom_end_date = new Date(value.end_date)

              if (new Date(item.startDate) >= prom_start_date && new Date(item.endDate) <= prom_end_date) {
                var old_rental_price = pricePItem; 
                pricePItem = old_rental_price - ( old_rental_price / 100 * value.percentage )
                if(old_rental_price != pricePItem)
                  setDiscountsMSG(DiscountsMSG+ '-' + value.percentage + "% for " + value.name + " promotion")  
              }
            }
            total_price += pricePItem;
            cartItems[index]["discountedPricePerItems"]=Number(pricePItem)
            //pricesProducts = pricesProducts.concat([pricePItem])
            
            var newDatesProds = {startDate:item.startDate,endDate: item.endDate}
            var prices = []
            var multPrices = []
            var prodsSumPrice = 0
            var diffInMs   = (new Date(newDatesProds.endDate)).getTime() - (new Date(newDatesProds.startDate)).getTime()
            var diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
            var multPrice = pricePItem * diffInDays
            prodsSumPrice += multPrice // Sum of products to multiply for rental days
            multPrices.push(multPrice)
            prices.push(pricePItem)
            
            console.log("multPrices: "+diffInDays)
            console.log("multPrices: "+diffInMs)
            //real_price = item.price*diffInDays
            const rentalPrice = prodsSumPrice
            var updatedPrices = calculatePrice(total_price, prices, multPrices, newDatesProds)                    
            console.log("Prezzo prodotto aggiornato :")
            console.log(cartItems)
            
            //setcartItems(copyOfObject);
            console.log(updatedPrices);
            cartItems[index]["discountedPrice"]=updatedPrices.prod
            console.log("FINE");
            console.log(cartItems);
            cookies.set('myCart', cartItems, { path: '/' });
            setcartItems(cookies.get('myCart'))    
          });
          cartItems.map(item =>  (
            setTotalPrice((prevState, props) => prevState + Number(item.discountedPrice))
          ))
        })    
      }else
        cookies.remove("myCart"); 
    }
  }, []);



const calculatePrice = (total_price, products_prices, products_mult_prices, products_dates) => {
  var singleProductPrice = products_mult_prices
  var discounted_price = total_price
  var start_day = new Date(products_dates.startDate).getDay() // Sunday = 0, Monday = 1, ...
  var diffInDays = products_mult_prices / products_prices
  var current_day = start_day
  var discounted = false
  var inner_weekdays = false
  
  for(var i=0; i < diffInDays; i++) {
    // Start weekdays check
    if(current_day == 0) {
      inner_weekdays = true;
    }
    // Inner weekdays Confirmed
    if(current_day == 4 && inner_weekdays) {
      var sub_amount = parseInt(products_prices) + parseInt(products_prices) * 0.5 + parseInt(products_prices) * 0.25 // For free on Mondays, 50% on Tuesdays, 25% on Wednesdays 
      discounted_price -= sub_amount
      singleProductPrice -= sub_amount
      inner_weekdays = false;
      discounted = true;
      setDiscountsMSG(DiscountsMSG+ '-' + sub_amount + '$') 
      console.log(sub_amount)
    }
        
    if (current_day == 6) current_day = 0
    else current_day++
  }
  if (discounted) 
    setDiscountsMSG(DiscountsMSG+"-" + (products_mult_prices - singleProductPrice) + "$"+' for inner Mon-Tue-Wed') 
  console.log(DiscountsMSG);
  return {prod: singleProductPrice};
}

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


  const handleClick = async (e) => {
    var datesP = []
    var real_price = 0;
    var productsID = []
    var pricesProducts = [];
    cartItems.forEach((item) =>  {
      productsID = productsID.concat([item._id]); // rental creation ids
      datesP = datesP.concat([{startDate : item.startDate, endDate : item.endDate}]); // rental creation dates       
      var newDatesProds = {startDate:item.startDate,endDate: item.endDate}
      var diffInMs   = (new Date(newDatesProds.endDate)).getTime() - (new Date(newDatesProds.startDate)).getTime()
      var diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;      
      real_price += item.price*diffInDays

      pricesProducts.push({price : Number(item.discountedPricePerItems)})
      console.log(pricesProducts);
    })


    console.log("HELLO IS DISCOUNTED")
    console.log(DiscountsMSG)
    console.log("HELLO IS DISCOUNTED")
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
        price : totalPrice,
        state : "Accepted",
        real_price : real_price,
        pricesProducts: pricesProducts,
        note: DiscountsMSG,
      }),
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', auth_token)
      },
      success: res => {
        console.log(res)
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
                console.log(response)
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
    
    
    
    
    
    
    
    
    
    
    
    
    /*e.preventDefault();
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
            console.log(item.discountedPrice),
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
                  <h2>{item.discountedPrice}$</h2>
                </div>
              </Card.Body>
            </Card>
            ))}
            <div className="total-price-wrapper">
              <h2 className="totalItems">Total:</h2>
              <h2 className="totalItemsPrice">{totalPrice}$</h2>
              <h2 className="">{DiscountsMSG}</h2>
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