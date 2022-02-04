import React from 'react'
import Professional from "./img/fine-dining-icon-7.jpg"
import Household from "./img/cucchiai.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';


function AboutSection(){
  return(
    <div className="aboutSection">
      <h2 className="aboutTitles" style={{fontSize:"3rem"}}>Reach the perfection</h2>
      <h3 className="aboutTitles" style={{fontSize:"1.5rem",paddingTop:"1vh",color:"#aaa"}}>Thanks to our products you can cook what you want <br/> when you want</h3>
      <img className="aboutIcons" src={Professional}/>
      <h3 className="aboutTitles" style={{fontSize:"2rem",paddingTop:"8vh"}}>PROFESSIONAL<br/>EQUIPMENT</h3>
      <img className="aboutIcons" style={{width:"65vw",left:"17.5vw",top:"0"}} src={Household}/>
      <h3 className="aboutTitles" style={{fontSize:"2rem",paddingTop:"3vh"}}>HOUSEHOLD<br/>TOOLS</h3>
    </div>
  );
}

export default AboutSection;
