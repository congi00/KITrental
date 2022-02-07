import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import LinkBack from "./img/loginBack.jpg"
import FormLogin from "./FormLogin"
import './login.css';

function JoinSection(){
  const [token, setToken] = React.useState();
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
}

export default JoinSection;
