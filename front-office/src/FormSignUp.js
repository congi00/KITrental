import React from 'react'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './joinus.css';



function FormSignUp(){

  return(
    <div className="formSection">
      <div className="formFields">
        <Form className='signup-form'>
        <Form.Text>
          <div className="titleForm">
            <h1 className="signup-title">SIGN UP</h1>
          </div>
        </Form.Text>
        <div className="fields-section">
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" placeholder="Surname" />
          </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" />
            </Form.Group>
          </div>
          <Button  className="btnForm">
            Go on
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default FormSignUp;
