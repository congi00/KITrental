import React from 'react'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './login.css';
import { useNavigate } from "react-router-dom";


function FormLogin({ setToken }){
  const [username, setUserName] = React.useState();
  const [password, setPassword] = React.useState();
  const [error,setError] = React.useState(false);
  let navigate = useNavigate();

  async function loginUser(credentials) {
    // var auth_token = JSON.parse(sessionStorage.getItem("token")).id
    return fetch('/API/login/clients', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials)
    }).then((res) => res.json())
  }
  const handleSubmit = async e => {
    e.preventDefault();
    
    const token = await loginUser({
      username,
      password
    });
    console.log(token)
    if(!token.message){
      if (token.password) {
        setToken({id:token.id});
        sessionStorage.setItem('auth', token.auth)
        navigate("/privateArea");
      }
    }else{
      setError(true);
    }
  }
  return(
    <div className="formSection">
      <div className="formFieldsL">
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
          <Form.Label className={error ? "errVisibleLogin" : "errNone"}>Wrong password or email!</Form.Label>
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
