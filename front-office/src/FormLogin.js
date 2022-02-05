import React from 'react'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import './login.css';



function FormLogin(){

  return(
    <div className="formSection">
      <div className="formFields">
        <Form>
        <Form.Text>
          <div className="titleFormL">
            LOG IN
          </div>
        </Form.Text>
        <div className="firstSectionL">
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          </div>
          <Button  className="btnFormL">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default FormLogin;
