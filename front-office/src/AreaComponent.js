import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './privateArea.css';
import { Link, useNavigate } from "react-router-dom";
import {Card, Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'
import $ from 'jquery';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Controller } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";


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
      url: "API/clients/" + token,
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
      let response = await $.ajax({url: "API/rental/client/" + token,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', auth_token)
        }})
      var clientRental = response.rental
      setRental(clientRental);

      async function fetchMySubAPI() {
        clientRental.map(async (rntl) => {
          let response = await $.ajax({url: "API/inventory/many/" + rntl.products_id.toString(),
            type: "GET",
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', auth_token)
            }})
          var rentalProds = response.products
          rentalProds.forEach(prod => {
            setProducts(products => ({ ...products, [prod._id] : {'img': prod.image, 'name': prod.name}}))
          })
        })
      }

      fetchMySubAPI()
    }
    
    fetchMyAPI()
  }, [])

  // function 
  const deleteRental = (rentalId, el) => {
    var confirmalert = true
    confirmalert = window.confirm("Are you sure?");
    if (confirmalert == true) {
      $.ajax({
        url: "api/rental/" + rentalId,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', auth_token)
        },
        success: res => {
          var rental = res.rental;

          // Products unavailability dates deletion (if the rental is removed, also the unavailability dates for that rental must be removed)
          rental.products_id.forEach((prod, i) => {
            $.ajax({
              url: "api/inventory/" + prod,
              type: "GET",
              success: res => {
                var prodDatesArr = res.products.indisponibilityDates
                var dateToRemove = new Date(rental.datesProducts[i].startDate)
                var removePos = null

                prodDatesArr.some((date, index) => {
                  var startIndDate = new Date(date.startDate)
                  startIndDate.setHours(startIndDate.getHours() - 2) // So that the conversion to UTC doesn't add 2 hours and get the next day instead
                  startIndDate.setHours(0, 0, 0, 0)
                  dateToRemove.setHours(0, 0, 0, 0)

                  if (startIndDate.getTime() == dateToRemove.getTime()) {
                    removePos = index
                    console.log(removePos)
                    console.log(prodDatesArr[index])
                    return true;
                  }
                })
    
                var newIndDates = res.products.indisponibilityDates
                newIndDates.splice(removePos, 1);

                // Update of product unavailability dates
                $.ajax({
                  url: "api/inventory/" + prod,
                  type: "PATCH",
                  contentType: "application/json",
                  dataType: "json",
                  data: JSON.stringify({indisponibilityDates: newIndDates})
                })
              }
            })
          })

          // Rental deletion
          $.ajax({
            url: "API/rental/" + rentalId,
            type: "DELETE",
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', auth_token)
            },
            success: res => {
              $(el).closest(".card").css("--bs-table-bg", "red");
              $(el)
                .closest(".card")
                .fadeOut(400, function () {
                  $(this).remove();
                });
            },
            error: err => console.log(err)
          });
        }
      })
    }
  }

  return(
    <div className="areaSection">
      {!isDesktop &&
        <Link to="/logout">
          <FontAwesomeIcon className="logoutIcon" icon={faArrowRight} size="2x"/>
        </Link>
      }
      <div className='desktop-fixed-client-wrapper'>
        <h1 className="personalTitle">Personal Area</h1>
        <img className="imgPersonalArea" src="img/profile-placeholder.png"></img>
        <h3 className='Infos'>{client.username}</h3>
        <button type="button" className='btnChangeInfo' onClick={() => navigate('/changeInfos?usrID='+client._id)}>Change info</button>
      </div>      
      {/* <h3 className='Infos'>Cognome</h3>
      <h3 className='Infos'>Email</h3> */}
      <div className='desktop-rental-wrapper'>
        <h1 className="personalTitle">Future and Active Rental</h1>
            {rental.filter(rntl => rntl.state !== 'Closed').length ?
              <React.Fragment>
                <div className='rental-wrapper'>

                  
                <Swiper modules={[Controller]}
                      slidesPerView={"auto"}
                      className="swiperAreaFuture"
                      >
                  {rental.map(item => (item.state !== 'Closed' &&
                    ! isDesktop &&
                        <SwiperSlide>
                       <Card>
                      <Card.Img variant="top" src={"img/products/" + (products?.[item.products_id[0]] ? products[item.products_id[0]].img : '')} />
                      <Card.Body>
                      <Card.Title>
                        {item.products_id.map((prod, i, prods) => {
                          if (prods.length - 1 === i) {
                            return products?.[prod] ? products[prod].name : ''
                          } else {
                            return products?.[prod] ? products[prod].name + ', ' : ''
                          }
                        })}
                        </Card.Title>
                        <Card.Text>
                          {item.note}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: {item.state}</ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>Price: {item.price}$</ListGroup.Item>
                        </ListGroup>
                        <Button disabled={!(new Date() < new Date(item.start_date))} variant="primary" className='product-button' onClick={() => navigate('/editRental?rentalID='+item._id)}>Edit</Button>
                        <Button disabled={!(new Date() < new Date(item.start_date))} variant="danger" className='product-remove-button' onClick={(e) => deleteRental(item._id, e.target)}>Delete</Button>

                      </Card.Body>
                    </Card>
                        </SwiperSlide>
                  ))}
                  </Swiper>
                  {rental.map(item => (item.state !== 'Closed' &&
                    isDesktop &&
                    <Card style={{ width: '18rem' }} >
                      <Card.Img variant="top" src={"img/products/" + (products?.[item.products_id[0]] ? products[item.products_id[0]].img : '')} />
                      <Card.Body>
                      <Card.Title>
                        {item.products_id.map((prod, i, prods) => {
                          if (prods.length - 1 === i) {
                            return products?.[prod] ? products[prod].name : ''
                          } else {
                            return products?.[prod] ? products[prod].name + ', ' : ''
                          }
                        })}
                        </Card.Title>
                        <Card.Text>
                          {item.note}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: {item.state}</ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>Price: {item.price}$</ListGroup.Item>
                        </ListGroup>
                        <Button disabled={!(new Date() < new Date(item.start_date))} variant="primary" className='product-button' onClick={() => navigate('/editRental?rentalID='+item._id)}>Edit</Button>
                        <Button disabled={!(new Date() < new Date(item.start_date))} variant="danger" className='product-remove-button' onClick={(e) => deleteRental(item._id, e.target)}>Delete</Button>

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
        <h1 className="personalTitle" style={{ marginTop : "5vh"}}>Past Rental</h1>
            {rental.filter(rntl => rntl.state === 'Closed').length ?
              <React.Fragment>
                <div className='rental-wrapper'>

                <Swiper modules={[Controller]}
                      slidesPerView={"auto"}
                      className="swiperAreaPast"
                      >
                  {rental.map(item => (item.state === 'Closed' &&
                    ! isDesktop &&
                        <SwiperSlide>
                          <Card>
                      <Card.Img variant="top" src={"img/products/" + (products?.[item.products_id[0]] ? products[item.products_id[0]].img : '')} />
                      <Card.Body>
                        <Card.Title>{products?.[item.products_id[0]] ? products[item.products_id[0]].name : ''}</Card.Title>
                        <Card.Text>
                        {item.note}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: {item.state}</ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>End: {new Date(item.end_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>Price: {item.price}$</ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" className='invoice-button' onClick={() => window.open('https://site202126.tw.cs.unibo.it/invoices/' + item._id + '.pdf', '_blank')}>Invoice</Button>
                      </Card.Body>
                    </Card>
                        </SwiperSlide>
                  ))}
                  </Swiper>

                  {rental.map(item => (item.state === 'Closed' &&
                  isDesktop &&
                    <Card style={{ width: '18rem' }} >
                      <Card.Img variant="top" src={"img/products/" + (products?.[item.products_id[0]] ? products[item.products_id[0]].img : '')} />
                      <Card.Body>
                        <Card.Title>{products?.[item.products_id[0]] ? products[item.products_id[0]].name : ''}</Card.Title>
                        <Card.Text>
                        {item.note}
                        </Card.Text>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>State: {item.state}</ListGroup.Item>
                          <ListGroup.Item>Start: {new Date(item.start_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>End: {new Date(item.end_date).toLocaleString()}</ListGroup.Item>
                          <ListGroup.Item>Price: {item.price}$</ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" className='invoice-button' onClick={() => window.open('https://site202126.tw.cs.unibo.it/invoices/' + item._id + '.pdf', '_blank')}>Invoice</Button>
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