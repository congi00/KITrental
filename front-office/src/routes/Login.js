import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../login.css';
import LoginSection from "../LoginSection";


function Login(){
  return(
    <div className="LoginPage">
      <LoginSection/>
    </div>
  );
}

export default Login;
