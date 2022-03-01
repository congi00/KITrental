import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../changeInfo.css';
import Navbar from "../navbar";
import EditRental from "../EditRental";
import { useMediaQuery } from 'react-responsive';


function EditRentalPage(){
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  return(
    <div>
      {isDesktop &&
        <Navbar />
      }
      <div className="infoPage">
        <EditRental/>
      </div>
    </div>

  );
}

export default EditRentalPage;