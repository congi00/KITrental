import React from 'react'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './login.css';


function FormLogin({ setToken }){
  const [username, setUserName] = React.useState();
  const [password, setPassword] = React.useState();


  async function loginUser(credentials) {
    return fetch('http://localhost:8000/API/login/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":"DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":"Content-Type, Authorization, X-Requested-With"
      },
      body: JSON.stringify(credentials)
    })
    .then(
      data => data.json()
    )
  }
  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }
  return(
    <div className="formSection">
      <div className="formFields">
        <Form  onSubmit={handleSubmit} className="login-form">
        <Form.Text>
          <div className="titleFormL">
            <h1 className="login-title">LOG IN</h1>
          </div>
        </Form.Text>
        <div className="firstSectionL">
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" onChange={e => setUserName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          </div>
          <Button type = 'submit' className="btnFormL">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

FormLogin.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default FormLogin;
