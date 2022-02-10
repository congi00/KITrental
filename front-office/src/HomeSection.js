import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";


function HomeSection(){
  return(
    <div className="firstSection">
      <div className="hero-wrapper container">
       <h1 className="landSubTitle">Don't </h1>
        <h1 className="landSubTitle"> Overthink It</h1>
        <h1 className="landSubTitle">rent our kitchen utilities </h1>
        <Link to="/joinus">
          <Button className="joinButton" variant="light">JOIN US</Button>
        </Link> 
      </div>
    </div>
  );
}

export default HomeSection;
