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


function NavB(){
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="Nav-container">
        <Navbar light expand="lg">
          <NavbarBrand>
            <img className="logoNav" src={logo} />
          </NavbarBrand>
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
