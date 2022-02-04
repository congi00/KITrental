import React from 'react';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import HomeSection from "./HomeSection";
import AboutSection from "./AboutSection";


function Landing(){
  return (
    <div className="Landing-home">
      <HomeSection/>
      <AboutSection/>
    </div >
  );
}

export default Landing;
