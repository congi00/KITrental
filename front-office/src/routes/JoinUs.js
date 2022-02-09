import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../joinus.css';
import Navbar from "../navbar";
import JoinSection from "../joinSection"


function JoinUs(){
  return(
    <div className="joinUsPage">
      <Navbar/>
      <JoinSection/>
    </div>
  );
}

export default JoinUs;
