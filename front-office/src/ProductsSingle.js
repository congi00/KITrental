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

function ProductsSingle(){
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [controlledSwiper, setControlledSwiper] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const param = searchParams.get("prdID");
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

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

  const onRent = (products) =>{
    onAdd(products);
    navigate("/cart");
  }
  return(
    <div className="productSinglePage">
      <Link to="/catalog">
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
            <Button onClick={() => onAdd(products)} className="btnCart" size="lg">Add to cart</Button>
            <Button  className="btnBuy" size="lg" onClick={() => onRent(products)}>Rent now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsSingle;
