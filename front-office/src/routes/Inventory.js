import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../inventory.css';
import Navbar from "../navbar";
import CardsSlider from "../CardsSlider";


function Inventory(){
  return(
    <div className="inventoryPage">
      <CardsSlider/>
    </div>
  );
}

export default Inventory;
