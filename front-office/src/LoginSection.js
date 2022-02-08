import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import LinkBack from "./img/loginBack.jpg"
import FormLogin from "./FormLogin"
import './login.css';


function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.id;
}

function LoginSection(){
  const token = getToken();
  if(!token) {
    return(
      <div className="formPageL">
        <img className="joinImg" src={LinkBack} style={{top:"8vh"}}/>
        <div className="divRotL"/>
        <div className="divRotL" style={{bottom:"134vh",backgroundColor:"#081715",width:"5vw"}}/>
        <div className="formContainerL"/>
        <FormLogin setToken={setToken}/>
      </div>
    );
  }
  return(
    <div className="loggedPage">
      <h1>Welcome back</h1>
    </div>
  );
}

export default LoginSection;
