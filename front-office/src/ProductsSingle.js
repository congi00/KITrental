import React from 'react'
import {onAdd} from "./routes/Product"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import LinkProduct from "./img/blender.jpg"
import './products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie';

function ProductsSingle(){
  const cookies = new Cookies();
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
  /*const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };*/

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
        <Button onClick={() => onAdd(products)} className="btnCart" size="lg">Add to cart</Button>
        <Button  className="btnBuy" size="lg">Rent now</Button>
      </div>
    </div>
  );
}

export default ProductsSingle;
