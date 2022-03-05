import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,useSearchParams,useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import './products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import { useMediaQuery } from 'react-responsive'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from 'jquery';

function ProductsSingle(){
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [BTNDisabled, setBTNDisabled] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryP, setCategoryP] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const param = searchParams.get("prdID");
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const [Dates,setDates] = React.useState([]);
  const [Bepi, setBepi] = React.useState(false);
  const [linkSugg, setlinkSugg] = React.useState("/");
  

  React.useEffect(() => {
    fetch("/API/inventory/"+param)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.products);
          setProducts(result.products);
          //setCategoryP(result.products.category.toLowerCase());
          setDates(getDates(result.products.indisponibilityDates, result.products.indisponibilityDates));
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
      
  }, [])

  const onAdd = (product) =>{
    const cartItems = cookies.get('myCart');

    if(cartItems){
      cookies.set('myCart', [...cartItems, { ...product, startDate : startDate, endDate: endDate}], { path: '/' });
    }else{
      cookies.set('myCart', [{ ...product, startDate : startDate, endDate: endDate}], { path: '/' });
    }
      console.log(cookies.get('myCart'));
  }


  const onSelectDate = (dates) => {
    const [start, end] = dates; 
    setBTNDisabled(false);
    Dates.forEach(element => {
      console.log("Dates" + element)
      console.log("Start" + start)
      console.log("End" + end)
      if(start <= element && element <= end){
        setBTNDisabled(true);
        console.log("Inserto contentente")
        $.ajax({
          url: "API/inventory/subcategory/"+ products.subCategory,
          type: "GET",
          contentType: "application/json",
          success: function (response) {
            if (response) {
              console.log(response);
              var idP;
              var available = false;
              response.products.forEach((datesProdItem)=>{
                if(datesProdItem.indisponibilityDates.length <1){
                  available = true;
                  idP = element._id;
                }
                datesProdItem.indisponibilityDates.forEach((item)=>{
                  if((start>=  new Date(item.startDate) &&  end >= new Date(item.endDate))
                    &&
                    !(start >= new Date(item.startDate) && new Date(item.endDate) >= end)
                    &&
                    !(start == new Date(item.startDate))
                    &&
                    !(end == new Date(item.endDate))
                  ){
                    available = true;
                    idP = datesProdItem._id;
                  }
                })
              });
              if(available){
                setBepi(true);
                setlinkSugg("/productSingle?prdID="+idP)
              }
            } else {
              alert("There was an error.");
            }
          },
        });
      }
    })
    setStartDate(start);
    setEndDate(end);
  };  

  
  const getDates = (startDate, endDate) => {
    const dates = []
    const invDates = startDate;
      const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
      }
    invDates.forEach(element => {
      startDate = new Date(element.startDate)
      var currentDate = startDate
      endDate= new Date(element.endDate)
      while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
      }
    });
    return dates;
  }


  const loggedIn = sessionStorage.getItem('token');


  const onRent = (products) =>{
    onAdd(products);
    navigate("/cart");
  }
  return(
    <div className="productSinglePage">
      <Link to={"/catalog?category="+ categoryP}>
        <FontAwesomeIcon className="arrowIcon" icon={faAngleLeft} size="2x"/>
      </Link>
      <div className="row product-wrapper">
        <div className="col-12 col-lg-6 img-col">
          <img className="productsImg" src={'img/products/'+products.image}/>
        </div>
        <div className="col-12 col-lg-6 desc-col">
          <div className="productDesc">
            <h2 className="productName"><b>{products.name}</b></h2>
            <h4 className="priceTit"><b>{!isDesktop && <React.Fragment>Price<br/></React.Fragment>}<span className="productPrice">{products.price}$</span></b></h4>
            <h3 className="productDescription">{products.description}</h3>
            <h3 className="productDescription">State: {products.state}</h3>
            <br/>
            <h3 className={Bepi ? "suggBlock" : "suggNone"}>This product is unavailable in those date, if you want you can check this 
            <span onClick={() => {window.location.href=linkSugg}}> <i>product</i></span>
            </h3>
            <div className='calendar'>
            {loggedIn ? ( 
            <DatePicker
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              excludeDates={Dates}
              selectsRange
              selectsDisabledDaysInRange
              inline
              onChange={onSelectDate}
            />
            ):(<DatePicker
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              selectsDisabledDaysInRange
              inline
              onChange={onSelectDate}
            />)}
            </div>
            <Button onClick={() => onAdd(products)} className="btnCart" size="lg" disabled={BTNDisabled}>Add to cart</Button>
            <Button  className="btnBuy" size="lg" onClick={() => onRent(products)} disabled={BTNDisabled}>Rent now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsSingle;
