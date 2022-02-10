import React,{useState} from 'react'
import './navbar.css'
import navIcon from "./menuicon.svg"
import logo from "./img/KITrental-logos_transparent.png"
import logo_white from "./img/KITrental-logos_white.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faHamburger } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';


function NavB(){
  const [isActive, setActive] = React.useState("false");
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  const handleToggle = () => {
    setActive(!isActive);
  };
  
  return (
    <div className="Nav-container">
        <Navbar expand="lg">
          <Container fluid className='px-lg-5'>
            <Navbar.Brand>
              <Link to="/">
                <img className="logoNav" src={isDesktop ? logo_white : logo} />
              </Link>
            </Navbar.Brand>
            <Nav justify className={isDesktop ? "menu-icons order-last" : "menu-icons"}>
              <Nav.Item>
                <Link to="/login">
                  <FontAwesomeIcon className="userIcon" icon={faUser} size="2x"/>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <FontAwesomeIcon className="hamburgerIcon" icon={faHamburger} size="2x" onClick={handleToggle}/>
              </Nav.Item>
              <Nav.Item >
                <Link to="/cart">
                  <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} size="2x" />
                </Link>
              </Nav.Item>
            </Nav>
            <Nav className={isActive ? "displayNone menuToggle" : "displayBlock menuToggle"} >
              <Nav.Item >
                <FontAwesomeIcon className="timesIcon" icon={faTimes} size="2x" onClick={handleToggle}/>
              </Nav.Item>
              <Nav.Item >
                <h3>Home</h3>
              </Nav.Item>
              <Nav.Item>
                <h3>Professional utilities</h3>
              </Nav.Item>
              <Nav.Item>
                <h3>Household products</h3>
              </Nav.Item>
              <Nav.Item>
                <h3>Sign Up</h3>
              </Nav.Item>
              <Nav.Item>
                <h3>Log In</h3>
              </Nav.Item>
            </Nav> 
          </Container>
        </Navbar>
        <div className={isActive ? "displayNone menuToggle menuToggleTwo" : "displayBlock menuToggle menuToggleTwo"}/>
        <div className={isActive ? "displayNone menuToggle menuToggleTwo" : "displayBlock menuToggle menuToggleThree"}/>
    </div >
  );
}

export default NavB;
