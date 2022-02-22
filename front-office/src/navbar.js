import React,{useState} from 'react'
import './navbar.css'
import navIcon from "./menuicon.svg"
import logo from "./img/KITrental-logos_black.png"
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
import useToken from './useToken';


function NavB(){
  const [isActive, setActive] = React.useState("false");
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const token = sessionStorage.getItem("token");

  const handleToggle = () => {
    setActive(!isActive);
  };

  //navbar scroll when active state
  const [navbar, setNavbar] = useState(false)

  //logo scroll when active
  const [navbarLogo, setNavbarLogo] = useState(logo_white)

  //navbar scroll changeBackground function
  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setNavbar(true)
    } else {
      setNavbar(false)
    }
  }

  React.useEffect(() => {
    changeBackground()
    // adding the event when scroll change background
    window.addEventListener("scroll", changeBackground)
  })

  //logo scroll function
  const changeLogo = () => {
    if (window.scrollY >= 60) {
      setNavbarLogo(logo)
    } else {
      setNavbarLogo(logo_white)
    }
  }

  React.useEffect(() => {
    changeLogo()
    // adding the event when scroll change Logo
    window.addEventListener("scroll", changeLogo)
  })
  
  return (
    <div className="Nav-container">
        <Navbar expand="lg" className={navbar ? "scrolled-navbar" : ""}>
          <Container fluid className='px-lg-5'>
            <Navbar.Brand aria-labelledby="logoNav">
              <Link to="/" >
                <img className="logoNav" src={isDesktop ? navbarLogo : logo} />
              </Link>
            </Navbar.Brand>
            <Nav justify className={isDesktop ? "menu-icons order-last" : "menu-icons"}>
              <Nav.Item className={(isDesktop && !token) ? 'd-none' : ''} >
                <Link to="/login">
                  <FontAwesomeIcon className="userIcon" aria-label="login and personal area" icon={faUser} size="2x"/>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <FontAwesomeIcon className="hamburgerIcon" icon={faHamburger} size="2x" onClick={handleToggle} aria-label="menu"/>
              </Nav.Item>
              <Nav.Item >
                <Link to="/cart">
                  <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} size="2x" aria-label="cart"/>
                </Link>
              </Nav.Item>
            </Nav>
            <Nav className={isActive ? "displayNone menuToggle" : "displayBlock menuToggle"} >
              <Nav.Item >
                <FontAwesomeIcon className="timesIcon" icon={faTimes} size="2x" onClick={handleToggle} aria-label="close menu"/>
              </Nav.Item>
              <Nav.Item >
                <Link to="/">
                  <h3>Home</h3>
                </Link>
              </Nav.Item>
              <Nav.Item onClick={() => {window.location.href="/catalog?category=professional"}}>
                  <h3>Professional utilities</h3>
              </Nav.Item>
              <Nav.Item onClick={() => {window.location.href="/catalog?category=household"}}>
                  <h3>Household products</h3>
              </Nav.Item>
              {!token &&
                <Nav.Item>
                  <Link to="/joinus">
                    <h3>Sign Up</h3>
                  </Link>
                </Nav.Item>
              }
              {!token &&
                <Nav.Item>
                  <Link to="/login">
                    <h3>Log In</h3>
                  </Link>
                </Nav.Item>
              }
              {token &&
                <Nav.Item>
                  <Link to="/logout">
                    <h3>Log Out</h3>
                  </Link>
                </Nav.Item>
              }
            </Nav> 
          </Container>
        </Navbar>
        <div className={isActive ? "displayNone menuToggle menuToggleTwo" : "displayBlock menuToggle menuToggleTwo"}/>
        <div className={isActive ? "displayNone menuToggle menuToggleTwo" : "displayBlock menuToggle menuToggleThree"}/>
    </div >
  );
}

export default NavB;
