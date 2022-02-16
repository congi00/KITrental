import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../changeInfo.css';
import Navbar from "../navbar";
import InfosForm from "../InfosForm";
import { useMediaQuery } from 'react-responsive';


function ChangeInfos(){
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  return(
    <div>
      {isDesktop &&
        <Navbar />
      }
      <div className="infoPage">
        <InfosForm/>
      </div>
    </div>

  );
}

export default ChangeInfos;