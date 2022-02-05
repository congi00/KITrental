import React,{useState} from 'react'
import './navbar.css'
import navIcon from "./menuicon.svg"
import logo from "./img/KITrental-logos_transparent.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Navbar,
    NavItem,
    NavbarToggler,
    Collapse,
    NavLink,
    Nav,
    NavbarBrand
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faHamburger } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


function NavB(){
  const [isActive, setActive] = React.useState("false");

  const handleToggle = () => {
    setActive(!isActive);
  };
  return (
    <div className="Nav-container">
        <Navbar light expand="lg">
          <NavbarBrand>
            <Link to="/">
              <img className="logoNav" src={logo} />
            </Link>
          </NavbarBrand>
          <Nav>
            <NavItem>
              <Link to="/login">
                <FontAwesomeIcon className="userIcon" icon={faUser} size="2x"/>
              </Link>
            </NavItem>
            <NavItem>
              <FontAwesomeIcon className="hamburgerIcon" icon={faHamburger} size="2x" onClick={handleToggle}/>
            </NavItem>
            <NavItem >
              <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} size="2x" />
            </NavItem>
          </Nav>
          <Nav className={isActive ? "displayNone menuToggle" : "displayBlock menuToggle"} >
          <NavItem >
            <FontAwesomeIcon className="timesIcon" icon={faTimes} size="2x" onClick={handleToggle}/>
          </NavItem>
          <NavItem >
            <h3>Home</h3>
          </NavItem>
          <NavItem>
            <h3>Professional utilities</h3>
          </NavItem>
          <NavItem>
            <h3>Household products</h3>
          </NavItem>
          <NavItem>
            <h3>Sign Up</h3>
          </NavItem>
          <NavItem>
            <h3>Log In</h3>
          </NavItem>
          </Nav>
        </Navbar>
        <div className={isActive ? "displayNone menuToggle menuToggleTwo" : "displayBlock menuToggle menuToggleTwo"}/>
        <div className={isActive ? "displayNone menuToggle menuToggleTwo" : "displayBlock menuToggle menuToggleThree"}/>
    </div >
  );
}

export default NavB;
