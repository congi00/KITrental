import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import { Button } from 'reactstrap';


function Landing(){
  return (
    <div className="Landing-home">
      <div className="firstSection">
        <h1 className="landSubTitle" style={{width:"40vw"}}>Don't </h1>
        <h1 className="landSubTitle" style={{width:"80vw"}}> Overthink It</h1>
        <h1 className="landSubTitle" style={{fontSize:"2rem",width:"80vw"}}>rent our kitchen utilities </h1>
        <Button className="joinButton" style={{left: "6vw",top:"30vh"}}>JOIN US</Button>
      </div>
    </div >
  );
}

export default Landing;
