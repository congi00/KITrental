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


function NavB(){
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="Nav-container">
        <Navbar light expand="lg">
          <NavbarBrand>
            <img className="logoNav" src={logo} />
          </NavbarBrand>
          <NavItem>
            <h1 className="TitleNav">ITrental</h1>
          </NavItem>
          <NavItem>
            <FontAwesomeIcon className="userIcon" icon={faUser} size="2x"/>
          </NavItem>
          <NavItem>
            <FontAwesomeIcon className="hamburgerIcon" icon={faHamburger} size="2x"/>
          </NavItem>
          <NavItem>
            <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} size="2x" />
          </NavItem>
          <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <img width="10%" src={navIcon} alt="Menu icon"/>
                </NavItem>
              </Nav>
          </Collapse>
        </Navbar>
    </div >
  );
}

export default NavB;
