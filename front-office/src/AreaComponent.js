import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './privateArea.css';
import { Link, useNavigate } from "react-router-dom";
import {Card, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'
import $ from 'jquery';


function AreaComponent(){  
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const [client, setClient] = React.useState([]);
  const [rental, setRental] = React.useState([]);
  const [products, setProducts] = React.useState(null);

  const token = JSON.parse(sessionStorage.getItem("token")).id;
  const auth_token = sessionStorage.getItem("auth")
  React.useEffect(() => {
    $.ajax({
      url: "http://localhost:8000/API/clients/" + token,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', auth_token)
      },
      success: res => {
        setClient(res.client);
      },
      error: err => console.log(err)
    });
  }, [])

  React.useEffect(() => {
    async function fetchMyAPI() {
      let response = await $.ajax({url: "http://localhost:8000/API/rental/client/" + token,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', auth_token)
        }})
      var clientRental = response.rental
      setRental(clientRental);

      async function fetchMySubAPI() {
        clientRental.map(async (rntl) => {
          let response = await $.ajax({url: "http://localhost:8000/API/inventory/" + rntl.product_id,
            type: "GET",
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', auth_token)
            }})
          var rentalProd = response.products
          setProducts(products => ({ ...products, [rentalProd._id] : {'img': rentalProd.image, 'name': rentalProd.name}}))
        })
      }

      fetchMySubAPI()
    }
    
    fetchMyAPI()
  }, [])

  // function 

  return(
    <div className="areaSection">
      {!isDesktop &&
        <Link to="/logout">
          <FontAwesomeIcon className="logoutIcon" icon={faArrowRight} size="2x"/>
        </Link>
      }
      <div className='desktop-fixed-client-wrapper'>
        <h1 className="personalTitle">Personal Area</h1>
        <img className="imgPersonalArea" src="/img/Products/blender.jpg"></img>
        <h3 className='Infos'>{client.username}</h3>
        <button className='btnChangeInfo' onClick={() => navigate('/changeInfos?usrID='+client._id)}>Change info</button>
      </div>      
      {/* <h3 className='Infos'>Cognome</h3>
      <h3 className='Infos'>Email</h3> */}
      <div className='desktop-rental-wrapper'>
        <h1 className="personalTitle">Future and Active Rental</h1>
            {rental ?
              <React.Fragment>
                <div className='rental-wrapper'>
                  {rental.map(item => (item.state !== 'Closed' &&
                    <Card style={{ width: '18rem' }} >
                      <Card.Img variant="top" src={"img/products/" + (products?.[item.product_id] ? products[item.product_id].img : '')} />
                      <Card.Body>
                        <Card.Title>{products?.[item.product_id] ? products[item.product_id].name : ''}</Card.Title>
                        <Card.Text>
                          {/* {item.desc} */}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: {item.state}</ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>End: {new Date(item.end_date).toLocaleString()}</ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" className='product-button'>See More</Button>
                        <Button variant="danger" className='product-button' onClick={}>See More</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                
              </React.Fragment>
              : 
              <div className='empty-rental'>
                <h2>No rental here yet.</h2>
                <Link to="/catalog">
                  Rent a product
                </Link>
              </div>
            }
        <h1 className="personalTitle">Past Rental</h1>
            {rental ?
              <React.Fragment>
                <div className='rental-wrapper'>
                  {rental.map(item => (item.state === 'Closed' &&
                    <Card style={{ width: '18rem' }} >
                      <Card.Img variant="top" src={"img/products/" + (products?.[item.product_id] ? products[item.product_id].img : '')} />
                      <Card.Body>
                        <Card.Title>{products?.[item.product_id] ? products[item.product_id].name : ''}</Card.Title>
                        <Card.Text>
                          {/* {item.desc} */}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: {item.state}</ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>End: {new Date(item.end_date).toLocaleString()}</ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" className='product-button'>See More</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                </React.Fragment>
                : 
                <div className='empty-rental'>
                  <h2>No rental here yet.</h2>
                </div>
              }
      </div>
    </div>
  );
}

export default AreaComponent;