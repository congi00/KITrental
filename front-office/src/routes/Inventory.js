import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../inventory.css';
import Navbar from "../navbar";
import CardsSlider from "../CardsSlider";
import { useMediaQuery } from 'react-responsive';


function Inventory(){
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  return(
    <div style={{"overflow":"hidden"}}>
      {isDesktop &&
        <Navbar />
      }
      <div className="inventoryPage">
        <CardsSlider/>
      </div>
    </div>

  );
}

export default Inventory;
