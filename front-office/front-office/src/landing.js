import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Background from './img/landingBg.jpg';

var homeStyle = {
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${Background})`,
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
