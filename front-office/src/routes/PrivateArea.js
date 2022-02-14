import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate,Route } from "react-router-dom";
import AreaComponent from "../AreaComponent"
import "../privateArea.css"
import Navbar from '../navbar';


function PrivateArea(){
  const loggedIn = sessionStorage.getItem('token');

  return(
      loggedIn ? (
        <div className="privateArea">
          <Navbar/>
          <AreaComponent/>
        </div>
      ) : (
        <Navigate to={{pathname : "/login"}} />
      )
  );
}

export default PrivateArea;
