import React from 'react'
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Modal } from 'react-bootstrap';
import './inventory.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Controller } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive';



function CardsSlider(){
  const [controlledSwiper, setControlledSwiper] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [titlesName, settitlesName] = React.useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("category") == "professional" ? "Professional":"Household" ;
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  React.useEffect(() => {
    fetch("http://localhost:8000/API/inventory/category/"+ param)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.products);
          setIsLoaded(true);
          setProducts(result.products);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  
  const searchProduct = (e) =>{
    settitlesName(e)
    console.log("SEt"+titlesName)
  }
  
  const [show, setShow] = React.useState(false);
  const loggedIn = sessionStorage.getItem("token");

  const handleClick = (callback) => {
      navigate("/productSingle?prdID="+callback);
  }

  function handleShow() {
    setShow(true);
  }
  return(
    <div className="CardsSliderPage">
      <Link to="/">
        <FontAwesomeIcon className="homeIcon" icon={faHome} size="2x"/>
      </Link>
      <Link to="/login">
        <FontAwesomeIcon className="userIconP" icon={faUser} size="2x"/>
      </Link>
      <Link to="/cart">
        <FontAwesomeIcon className="cartIconP" icon={faShoppingCart} size="2x" />
      </Link>
      <FontAwesomeIcon className={loggedIn ? "filterIconP dBlock": "dNone" } icon={faSearchPlus} size="2x" onClick={() => handleShow()}/>
      <Form.Control className={loggedIn ? "searchBar dBlock" : "dNone"}  type="text" placeholder="Search" onChange={(e) =>{searchProduct(e.target.value)}} />
      <Modal show={show} fullscreen={"xxl-down"} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Check 
            type="radio"
            label="Descendent price"
            name="priceFilter"
          />
          <Form.Check 
            type="radio"
            label="Ascendent price"
            name="priceFilter"
          />
          <Form.Label className="filterDate" for="startDate">Rent from</Form.Label>
          <Form.Control type="date" name='startDate'  />
          <Form.Label className="filterDate" for="endDate">To</Form.Label>
          <Form.Control type="date" name='endDate'  />
          <Button type = 'submit' className="btnFormL">
            Submit
          </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className='container'>
        <div className="hero-products-wrapper">
          <h2 className="pageTitle">{param} utilities for <br/>new experiences</h2>
          <div className="scroll-icon-wrapper">
            <a href="#products">
              <div class="scroll"></div>
            </a>
          </div>
        </div>
        <div className="titlesSection"></div>
        {!isDesktop &&
          <React.Fragment>
            <Swiper modules={[Controller]} controller={{ control: controlledSwiper }} onSwiper={setControlledSwiper}
              slidesPerView={"auto"}
              className="titles"
              >
                {products.map(item => (item.avaiability == "unavailable")? "":( 
                  <SwiperSlide className={((titlesName !== undefined) && item.name.toLowerCase().indexOf(titlesName.toLowerCase()) !== -1)? "titlesName dBlock" : "titlesName dNone"}>{item.name}</SwiperSlide>
                ))}
            </Swiper>
            <Swiper modules={[Controller]} controller={{ control: controlledSwiper }}
              slidesPerView={"auto"}
              pagination={{
                clickable: true,
              }}
              className="mySwiper"
              onTransitionEnd={e => {
                console.log(controlledSwiper.realIndex);
              }}
              >
                {products.map(item => (item.avaiability == "unavailable")? "":(
                    <SwiperSlide className={((titlesName !== undefined) && item.name.toLowerCase().indexOf(titlesName.toLowerCase()) !== -1)? "dBlock" : "dNone"} style={{backgroundImage:'url(img/products/'+item.image+')'}} 
                    onClick={() => handleClick(item._id)}
                    ></SwiperSlide>
                ))}
            </Swiper>
          </React.Fragment>
        }
        {isDesktop &&
          <React.Fragment>
            <div className="products-wrapper" id='products'>
              {products.map(item => (
                <Card style={{ width: '18rem', cursor: 'pointer' }} onClick={() => handleClick(item._id)} >
                  <Card.Img variant="top" src={"img/products/" + item.image} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className='product-desc'>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))} 
            </div>
          </React.Fragment>
        }
      </div>
    </div>
  );
}

export default CardsSlider;
