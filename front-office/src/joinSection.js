import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import LinkBack from "./img/joinBack.jpg"
import FormSignUp from "./FormSignUp"
import './joinus.css';

function JoinSection(){
  return(
    <div className="formPage">
      <img className="joinImg" src={LinkBack}/>
      <div className="divRot"/>
      <div className="formContainer"/>
      <FormSignUp/>
    </div>
  );
}

export default JoinSection;
