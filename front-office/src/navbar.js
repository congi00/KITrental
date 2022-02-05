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
import { Link } from "react-router-dom";


function NavB(){
  const [isOpen, setIsOpen] = React.useState(false);
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
              <FontAwesomeIcon className="userIcon" icon={faUser} size="2x"/>
            </NavItem>
            <NavItem>
              <FontAwesomeIcon className="hamburgerIcon" icon={faHamburger} size="2x"/>
            </NavItem>
            <NavItem>
              <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} size="2x" />
            </NavItem>
          </Nav>
        </Navbar>
    </div >
  );
}

export default NavB;
