import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import { Link } from "react-router-dom";
import '../login.css';
import Navbar from "../navbar";
import LoginSection from "../LoginSection"


function Login(){
  return(
    <div className="LoginPage">
      <Navbar/>
      <LoginSection/>
    </div>
  );
}

export default Login;