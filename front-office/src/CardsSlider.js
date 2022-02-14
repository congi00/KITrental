import React from 'react'
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './inventory.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Controller } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'



function CardsSlider(){
  const [controlledSwiper, setControlledSwiper] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("category") == "professional" ? "Professional":"Household" ;

  React.useEffect(() => {
    fetch("http://localhost:8000/API/inventory/category/"+ param)
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
  

  const handleClick = (callback) => {
      navigate("/productSingle?prdID="+callback);
  }

  return(
    <div className="CardsSliderPage">
      <Link to="/">
        <FontAwesomeIcon className="homeIcon" icon={faHome} size="2x"/>
      </Link>
      <Link to="/login">
        <FontAwesomeIcon className="userIconP" icon={faUser} size="2x"/>
      </Link>
      <Link to="/cart">
        <FontAwesomeIcon className="cartIconP" icon={faShoppingCart} size="2x" />
      </Link>
      <h2 className="pageTitle">{param} utilities for <br/>new experiences</h2>
      <div className="titlesSection"></div>
      <Swiper modules={[Controller]} controller={{ control: controlledSwiper }} onSwiper={setControlledSwiper}
        slidesPerView={"auto"}
        className="titles"
        >
          {products.map(item => (
            <SwiperSlide>{item.name}</SwiperSlide>
          ))}
      </Swiper>
      <Swiper modules={[Controller]} controller={{ control: controlledSwiper }}
        slidesPerView={"auto"}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
        onTransitionEnd={e => {
          console.log(controlledSwiper.realIndex);
        }}
        >
          {products.map(item => (
              <SwiperSlide style={{backgroundImage:'url(img/products/'+item.image+')'}} 
              onClick={() => handleClick(item._id)}
              ></SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default CardsSlider;
