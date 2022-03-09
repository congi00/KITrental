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
  const [Asc,setAsc] = React.useState(false);
  const [Desc,setDesc] = React.useState(false);
  const [selectCat,setSelectCat] = React.useState("");
  const [availabilityF,setavailabilityF] = React.useState("");
  const param = searchParams.get("category") == "professional" ? "Professional":"Household" ;
  const price = searchParams.get("price");
  const sub = searchParams.get("sub");
  const availability = searchParams.get("availability");
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const loggedIn = sessionStorage.getItem("token");
  
  


  React.useEffect(() => {
    if(!price){ 
      var priceS = "null"
    }else {
      var priceS = price
    }
    if(!sub){ 
      var subS = "null"
    }else{
      var subS = sub
    }
    if(!availability){ 
      var availabilityS = "null"
    }else{
      var availabilityS = availability
    }

    if(price || sub || availability ){
      fetch("/API/inventory/filter/?price="+ priceS+"&sub="+ subS+"&availability="+ availabilityS+"&category=" +param)
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
    }else{
      fetch("/API/inventory/category/"+ param)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.products);
          setIsLoaded(true);
          if(!loggedIn){
            result.products = result.products.filter((value, index, self) =>
              index === self.findIndex((t) => (
                t.subCategory === value.subCategory
              ))
            )
            result.products.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
          }
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
    }
  }, [])
  
  const searchProduct = (e) =>{
    settitlesName(e)
    console.log("SEt"+titlesName)
  }
  
  const [show, setShow] = React.useState(false);

  const handleClick = (e) => {
    
      navigate("/productSingle?prdID="+e);
  }

  const onAsc = () => {
    setAsc(!Asc);
  }
  const onDesc = () => {
    setDesc(!Desc);
  }


  function handleShow() {
    setShow(true);
  }

  const checkFilter = (e) => {
    console.log(selectCat);
    e.preventDefault();
    if(Asc){
      navigate("/catalog?category="+searchParams.get("category")+"&price=ASC"+"&sub="+selectCat+"&availability="+availabilityF);
    }else if(Desc){
      navigate("/catalog?category="+searchParams.get("category")+"&price=DESC"+"&sub="+selectCat+"&availability="+availabilityF);
    }else{
      navigate("/catalog?category="+searchParams.get("category")+"&price="+"&sub="+selectCat+"&availability="+availabilityF);
    }

    window.location.reload(false);
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
      <div>
        <div className="hero-products-wrapper">
          <div className="container">
            <h2 className="pageTitle">{param} utilities for <br/>new experiences</h2>
            <div className="scroll-icon-wrapper">
              <a href="#products">
                <div class="scroll"></div>
              </a>
            </div>
          </div>
        </div>
        <div className="container">
        <div className="titlesSection"></div>
        {loggedIn && 
          <div className="upper-section-wrapper pt-5">
            <h2>Filter and/or Search</h2>
            <div className="filter-search-wrapper">
            <FontAwesomeIcon className="filterIconP dBlock" icon={faSearchPlus} size="2x" onClick={() => handleShow()}/>
              <Form.Control className="searchBar dBlock"  type="text" placeholder="Search" onChange={(e) =>{searchProduct(e.target.value)}} />
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
                    onChange={onDesc}
                  />
                  <Form.Check 
                    type="radio"
                    label="Ascendent price"
                    name="priceFilter"
                    onChange={onAsc}
                  />
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select onChange={e => setSelectCat(e.target.value)}>
                      <option>Select options</option>
                      <option value="Blender">Blender</option>
                      <option value="Barbeque">Barbeque</option>
                      <option value="Torch">Torch</option>
                      <option value="Kneader">Kneader</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select onChange={e => setavailabilityF(e.target.value)}>
                      <option>Select options</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Button type = 'submit' className="btnFormL"
                  onClick={checkFilter}
                  > 
                    Submit
                  </Button>
                  </Form>
                </Modal.Body>
              </Modal> 
            </div>
          </div>
        }
        
        {!isDesktop &&
          <React.Fragment>
            <Swiper modules={[Controller]} controller={{ control: controlledSwiper }} onSwiper={setControlledSwiper}
              slidesPerView={"auto"}
              className="titles"
              >
                {products.map(item => (item.availability == "unavailable" && ! loggedIn)? "":( 
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
                {products.map(item => (item.availability == "unavailable" && ! loggedIn)? "":(
                    <SwiperSlide className={((titlesName !== undefined) && item.name.toLowerCase().indexOf(titlesName.toLowerCase()) !== -1)? "swiperP dBlock" : "swiperP dNone"} style={{backgroundImage:'url(img/products/'+item.image+')'}} 
                    onClick={() => handleClick(item._id)}
                    > {item.price}$</SwiperSlide>
                ))}
            </Swiper>
          </React.Fragment>
        }
        {isDesktop &&
          <React.Fragment>
            <div className="products-wrapper" id='products'>
              {products.map(item => (
                <Link to={"/productSingle?prdID=" + item._id} style={{ color: 'black', textDecoration: 'none' }}>
                  <Card style={{ width: '18rem', cursor: 'pointer' }}
                    className={((titlesName !== undefined) && item.name.toLowerCase().indexOf(titlesName.toLowerCase()) !== -1)? "dBlock" : "dNone"}>
                    <Card.Img variant="top" src={"img/products/" + item.image} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text className='product-desc'>
                        {item.description}
                      </Card.Text>
                      <Card.Text className='product-price' style={{fontSize: '1.5rem'}}>
                        {item.price}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              ))} 
            </div>
          </React.Fragment>
        }
        </div>
      </div>
    </div>
  );
}

export default CardsSlider;
