import React from 'react'
import Professional from "./img/fine-dining-icon-7.jpg"
import Household from "./img/cucchiai.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";


function AboutSection(){
  return(
    <div className="aboutSection">
      <div className="flex-wrapper container">
        <h2 className="aboutTitles" style={{fontSize:"3rem"}}>Reach the perfection</h2>
        <h3 className="aboutTitles" style={{fontSize:"1.5rem",paddingTop:"1vh",color:"#aaa"}}>Thanks to our products you can cook what you want <br/> when you want</h3>
        <div className="col-12 col-lg image-text-card">
        <Link to="/catalog?category=professional">
          <img className="aboutIcons" src={Professional}/>
        </Link>
          <h3 className="aboutTitles" style={{fontSize:"2rem",paddingTop:"8vh"}}>PROFESSIONAL<br/>EQUIPMENT</h3>
          <Link to="/catalog?category=professional">
            <Button className="catalogButton" variant="light">PRODUCTS</Button>
          </Link> 
        </div>
        <div className="col-12 col-lg image-text-card">
          <Link to="/catalog?category=household">
            <img className="aboutIcons custom-image" src={Household}/>
          </Link>
          <h3 className="aboutTitles" style={{fontSize:"2rem",paddingTop:"3vh"}}>HOUSEHOLD<br/>TOOLS</h3>
          <Link to="/catalog?category=household">
            <Button className="catalogButton" variant="light">PRODUCTS</Button>
          </Link> 
        </div>
      </div>

    </div>
  );
}

export default AboutSection;
