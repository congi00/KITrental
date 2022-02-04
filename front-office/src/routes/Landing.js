import React from 'react';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../navbar";
import HomeL from "../HomeL";
import FooterHome from "../FooterHome";


function LandingP(){
  return (
    <div>
      <Navbar />
      <HomeL />
      <FooterHome />
    </div>
  );
}

export default LandingP;
