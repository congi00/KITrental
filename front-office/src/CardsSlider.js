import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import './inventory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Controller } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import Blender from "./img/Blender.jpg"
import Blender2 from "./img/Blender2.jpg"
import Kneader from "./img/impastarice-planetaria-offerta.jpg"
import Smoker from "./img/smoker.jpg"
import Torch from "./img/torch.jpg"
import Tigelliera from "./img/tigelliera.jpg"



function CardsSlider(){
  const [controlledSwiper, setControlledSwiper] = React.useState(null);

  return(
    <div className="CardsSliderPage">
      <div className="titlesSection"></div>
      <Swiper modules={[Controller]} controller={{ control: controlledSwiper }} onSwiper={setControlledSwiper}
        slidesPerView={"auto"}
        className="titles"
        >
        <SwiperSlide>Blender</SwiperSlide>
        <SwiperSlide>Kneader</SwiperSlide>
        <SwiperSlide>Smoker</SwiperSlide>
        <SwiperSlide>Torch</SwiperSlide>
        <SwiperSlide>Tigelliera</SwiperSlide>
        <SwiperSlide>Piatti</SwiperSlide>
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
        <SwiperSlide className="Blender" style={{backgroundImage:'url('+Blender+')'}}></SwiperSlide>
        <SwiperSlide className="Kneader" style={{backgroundImage:'url('+Kneader+')'}}></SwiperSlide>
        <SwiperSlide style={{backgroundImage:'url('+Smoker+')'}}></SwiperSlide>
        <SwiperSlide style={{backgroundImage:'url('+Torch+')'}}></SwiperSlide>
        <SwiperSlide style={{backgroundImage:'url('+Tigelliera+')'}}></SwiperSlide>
        <SwiperSlide></SwiperSlide>
      </Swiper>
    </div>
  );
}

export default CardsSlider;
