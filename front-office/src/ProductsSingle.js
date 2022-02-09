import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import LinkProduct from "./img/Blender.jpg"
import './products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

function ProductsSingle(){
  return(
    <div className="productSinglePage">
      <FontAwesomeIcon className="arrowIcon" icon={faAngleLeft} size="2x"/>
      <img className="productsImg" src={LinkProduct}/>
      <div className="productDesc">
        <h2 className="productName"><b>Blender</b></h2>
        <h4 className="priceTit"><b>Price<br/><span className="productPrice">20$</span></b></h4>
        <h3 className="productDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et tempus enim. Nunc elementum lectus sed purus convallis, non dictum massa malesuada.</h3>
        <Button  className="btnCart" size="lg">Add to cart</Button>
        <Button  className="btnBuy" size="lg">Buy now</Button>
      </div>
    </div>
  );
}

export default ProductsSingle;
