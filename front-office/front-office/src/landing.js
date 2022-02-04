import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Background from './img/landingBg.jpg';

var homeStyle = {
  width: "100vw",
  height: "100vh",
  position: "absolute",
  top: "0",
  zIndex: "-1",
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.1)),url(${Background})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}

function Landing(){
  return (
    <div style={homeStyle} className="Landing-home">
    </div >
  );
}

export default Landing;
