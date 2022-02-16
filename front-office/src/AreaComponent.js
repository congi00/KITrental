import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './privateArea.css';
import { Link } from "react-router-dom";
import {Card, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'


function AreaComponent(){  
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const [client, setClient] = React.useState([]);
  const [rental, setRental] = React.useState([]);
  const [products, setProducts] = React.useState(null);

  const token = JSON.parse(sessionStorage.getItem("token")).id;
  React.useEffect(() => {
    fetch("http://localhost:8000/API/clients/" + token)
      .then(res => res.json())
      .then(
        (result) => {
          setClient(result.client);
        },
        (error) => {
          console.log(error);
        }
      )
  }, [])

  React.useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch("http://localhost:8000/API/rental/client/" + token)
      response = await response.json()
      var clientRental = response.rental
      setRental(clientRental);

      async function fetchMySubAPI() {
        clientRental.map(async (rntl) => {
          let response = await fetch("http://localhost:8000/API/inventory/" + rntl.product_id)
          response = await response.json()
          var rentalProd = response.products
          setProducts(products => ({ ...products, [rentalProd._id] : {'img': rentalProd.image, 'name': rentalProd.name}}))
        })
      }

      fetchMySubAPI()
    }
    
    fetchMyAPI()
  }, [])

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
      </div>
      {/* <h3 className='Infos'>Cognome</h3>
      <h3 className='Infos'>Email</h3> */}
      <div className='desktop-rental-wrapper'>
        <h1 className="personalTitle">Future and Active Rental</h1>
            {rental ?
              <React.Fragment>
                {rental.map(item => (item.state !== 'Closed' &&
                  <Card style={{ width: '18rem' }} >
                    <Card.Img variant="top" src={"url(img/products/" + (products?.[item.product_id] ? products[item.product_id].img : '') + ")"} />
                    <Card.Body>
                      <Card.Title>{products?.[item.product_id] ? products[item.product_id].name : ''}</Card.Title>
                      <Card.Text>
                        {/* {item.desc} */}
                      </Card.Text>
                      <ListGroup className="list-group-flush">
                        <ListGroup.Item>State: </ListGroup.Item>
                        <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                        <ListGroup.Item>End: {new Date(item.end_date).toLocaleString()}</ListGroup.Item>
                      </ListGroup>
                      <Button variant="primary" className='product-button'>See More</Button>
                    </Card.Body>
                  </Card>
                ))}
              </React.Fragment>
              : 
              <p>blabla</p>
            }
        <h1 className="personalTitle">Past Rental</h1>
            {rental ?
              <React.Fragment>
                  {rental.map(item => (item.state === 'Closed' &&
                    <Card style={{ width: '18rem' }} >
                      <Card.Img variant="top" src={"url(img/products/" + (products?.[item.product_id] ? products[item.product_id].img : '') + ")"} />
                      <Card.Body>
                        <Card.Title>{products?.[item.product_id] ? products[item.product_id].name : ''}</Card.Title>
                        <Card.Text>
                          {/* {item.desc} */}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: </ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>End: {new Date(item.end_date).toLocaleString()}</ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" className='product-button'>See More</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </React.Fragment>
                : 
                <p>blabla</p>
              }
      </div>
    </div>
  );
}

export default AreaComponent;