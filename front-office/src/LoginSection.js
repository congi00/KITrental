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
import useToken from './useToken';

function LoginSection(){
  const { token, setToken } = useToken();
    return(
      <div className="formPageL">
        <Navbar/>
        <img className="joinImg" src={LinkBack} style={{top:"8vh"}}/>
        <div className="divRotL"/>
        <div className="divRotL wrapperTItle"/>
        <div className="formContainerL"/>
        <FormLogin setToken={setToken}/>
      </div>
    );
}

export default LoginSection;
