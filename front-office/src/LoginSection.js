import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import LinkBack from "./img/loginBack.jpg"
import FormLogin from "./FormLogin"
import './login.css';
import Navbar from "./navbar";
import Avatar from "./avatar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'


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
        <Navbar/>
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
      <FontAwesomeIcon className="arrowIcon" icon={faAngleLeft} size="2x"/>
      <FontAwesomeIcon className="cogIcon" icon={faCog} size="2x"/>
      <Avatar/>
      <div className="nameWelcome">
        <h1>Hi alecongi!</h1>
      </div>
    </div>
  );
}

export default LoginSection;
