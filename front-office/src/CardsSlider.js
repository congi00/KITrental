import React from 'react'
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './inventory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Controller } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";



function CardsSlider(){
  const [controlledSwiper, setControlledSwiper] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:8000/API/inventory")
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
    <div className="CardsSliderPage">
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
              onClick={"/productSingle"}
              message={item._id}></SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default CardsSlider;
