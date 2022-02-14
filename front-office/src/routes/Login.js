import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate ,Link, Route } from "react-router-dom";
import '../login.css';
import LoginSection from "../LoginSection";

function Login(){
  const loggedIn = sessionStorage.getItem('token');
  
  return(    
    loggedIn ? (
      <Navigate to={{pathname : "/privateArea"}} />
    ) : (
        <div className="LoginPage">
          <LoginSection/>
        </div>
    )
  );
}

export default Login;
