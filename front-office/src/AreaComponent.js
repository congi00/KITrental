import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './privateArea.css';
import { Link, useNavigate } from "react-router-dom";
import {Card, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'


function AreaComponent(){  
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const [client, setClient] = React.useState([]);
  const [rental, setRental] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  const token = JSON.parse(sessionStorage.getItem("token")).id;
  React.useEffect(() => {
    fetch("http://localhost:8000/API/clients/" + token)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.client);
          // setIsLoaded(true);
          setClient(result.client);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // setIsLoaded(true);
          // setError(error);
          console.log(error);
        }
      )
  }, [])

  React.useEffect(() => {
    fetch("http://localhost:8000/API/rental/client/" + token)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.rental);
          setRental(result.rental);
          // result.rental.forEach(rntl)
          fetch("http://localhost:8000/API/inventory/" + token)
            .then(res => res.json())
            .then(
              (result) => {
                console.log(result.rental);
                setRental(result.rental);
                
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                console.log(error);
              }
            )
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  }, [])

  return(
    <div className="areaSection">
      {!isDesktop &&
        <Link to="/logout">
          <FontAwesomeIcon className="logoutIcon" icon={faArrowRight} size="2x"/>
        </Link>
      }
      <h1 className="personalTitle">Personal Area</h1>
      <img className="imgPersonalArea" src="/img/Products/blender.jpg"></img>
      <h3 className='Infos'>{client.username}</h3>
      <button className='btnChangeInfo' onClick={() => navigate('/changeInfos?usrID='+client._id)}>Change info</button>
      {/* <h3 className='Infos'>Cognome</h3>
      <h3 className='Infos'>Email</h3> */}
      <h1 className="personalTitle">Future and Active Rental</h1>
      {rental ?
        <React.Fragment>
          {rental.map(item => (item.state !== 'Closed' &&
            <Card style={{ width: '18rem' }} >
              <Card.Img variant="top" src={"url(img/products/" +  + ")"} />
              <Card.Body>
                <Card.Title>Product Name</Card.Title>
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
              <Card.Img variant="top" src={"url(img/products/" +  + ")"} />
              <Card.Body>
                <Card.Title>Product Name</Card.Title>
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
  );
}

export default AreaComponent;