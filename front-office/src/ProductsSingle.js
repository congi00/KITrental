import React from 'react'
import {onAdd} from "./routes/Product"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,useSearchParams,useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import LinkProduct from "./img/Blender.jpg"
import './products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import { useMediaQuery } from 'react-responsive'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addDays from "date-fns/addDays";

function ProductsSingle(){
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryP, setCategoryP] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const param = searchParams.get("prdID");
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  React.useEffect(() => {
    fetch("http://localhost:8000/API/inventory/"+param)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.products);
          setProducts(result.products);
          setCategoryP(products.category.toLowerCase());
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
      const exist = cartItems.find(x => x._id === product._id);
      console.log(exist);
      if(exist)
        cookies.set('myCart', cartItems.map(x=> x._id === product._id ? {...exist, qty: exist.qty +1 } : x), { path: '/' });
      else
        //... notation = array concatenation
        cookies.set('myCart', [...cartItems, { ...product, qty:1}], { path: '/' });
    }else{
      cookies.set('myCart', [{ ...product, qty:1}], { path: '/' });
    }
      console.log(cookies.get('myCart'));
  }


  const onSelectDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };  

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
            <div className='calendar'>
            <DatePicker
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              excludeDates={[new Date(products.startD),new Date(products.endD)]}
              selectsRange
              selectsDisabledDaysInRange
              inline
              onChange={onSelectDate}
            />
            </div>
            <Button onClick={() => onAdd(products)} className="btnCart" size="lg">Add to cart</Button>
            <Button  className="btnBuy" size="lg" onClick={() => onRent(products)}>Rent now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsSingle;
