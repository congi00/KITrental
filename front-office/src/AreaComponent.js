import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PrivateArea.css';
import { Link } from "react-router-dom";
import {Card} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


function AreaComponent(){  
  return(
    <div className="areaSection">
      <Link to="/logout">
        <FontAwesomeIcon className="logoutIcon" icon={faArrowRight} size="2x"/>
      </Link>
      <h1 className="personalTitle">Personal Area</h1>
      <img className="imgPersonalArea" src="/img/Products/blender.jpg"></img>
      <h3 className='Infos'>Nome</h3>
      <h3 className='Infos'>Cognome</h3>
      <h3 className='Infos'>Email</h3>
      <h1 className="personalTitle">Last rental</h1>
    </div>
  );
}

export default AreaComponent;