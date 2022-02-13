import React from 'react'
import {onAdd} from "./routes/Product"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import LinkProduct from "./img/blender.jpg"
import './products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

function ProductsSingle(props){
  const {cartItems,onAdd} = {props};
  const [controlledSwiper, setControlledSwiper] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const param = searchParams.get("prdID");
  React.useEffect(() => {
    fetch("http://localhost:8000/API/inventory/"+param)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.products);
          setIsLoaded(true);
          setProducts(result.products);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  return(
    <div className="productSinglePage">
      <Link to="/catalog">
        <FontAwesomeIcon className="arrowIcon" icon={faAngleLeft} size="2x"/>
    </Link>
      <img className="productsImg" src={'img/products/'+products.image}/>
      <div className="productDesc">
        <h2 className="productName"><b>{products.name}</b></h2>
        <h4 className="priceTit"><b>Price<br/><span className="productPrice">{products.price}</span></b></h4>
        <h3 className="productDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et tempus enim. Nunc elementum lectus sed purus convallis, non dictum massa malesuada.</h3>
        <Button onClick={onAdd(products)} className="btnCart" size="lg">Add to cart</Button>
        <Button  className="btnBuy" size="lg">Rent now</Button>
      </div>
    </div>
  );
}

export default ProductsSingle;
