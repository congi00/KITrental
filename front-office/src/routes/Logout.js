import React from 'react'
import { Navigate,Route } from "react-router-dom";

function PrivateArea(){
    const loggedIn = sessionStorage.getItem('token');
  
    
    return(
        loggedIn ? sessionStorage.clear() : (
            <Navigate to={{pathname : "/login"}} />
        ),
        <Navigate to={{pathname : "/login"}} />
    );
  }
  
  export default PrivateArea;