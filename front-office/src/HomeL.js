import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import HomeSection from "./HomeSection";
import AboutSection from "./AboutSection";


function HomeL(){
  return (
    <div className="Landing-home">
      <HomeSection/>
      <AboutSection/>
    </div >
  );
}

export default HomeL;
