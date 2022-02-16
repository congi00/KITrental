import React from 'react'
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import './inventory.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Controller } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive';



function CardsSlider(){
  const [controlledSwiper, setControlledSwiper] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("category") == "professional" ? "Professional":"Household" ;
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

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
      <div className='container'>
        <div className="hero-products-wrapper">
          <h2 className="pageTitle">{param} utilities for <br/>new experiences</h2>
          <div className="scroll-icon-wrapper">
            <a href="#products">
              <div class="scroll"></div>
            </a>
          </div>
        </div>
        <div className="titlesSection"></div>
        {!isDesktop &&
          <React.Fragment>
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
          </React.Fragment>
        }
        {isDesktop &&
          <React.Fragment>
            <div className="products-wrapper" id='products'>
              {products.map(item => (
                <Card style={{ width: '18rem' }} onClick={() => handleClick(item._id)} >
                  <Card.Img variant="top" src={"img/products/" + item.image} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.desc}
                    </Card.Text>
                    <Button variant="primary" className='product-button'>See More</Button>
                  </Card.Body>
                </Card>
              ))} 
            </div>
          </React.Fragment>
        }
      </div>
    </div>
  );
}

export default CardsSlider;
