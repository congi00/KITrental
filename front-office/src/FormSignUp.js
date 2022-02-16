import React from 'react'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './joinus.css';
import { useNavigate } from "react-router-dom";



function FormSignUp(){
  const [joinSectionsN,setJoinSectionN] = React.useState({
    count: 0,
    bool: false,
    incValue:1
  });
  
  const [info,setInfo]  =  React.useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    address: "",
    email: "",
    avatar: "",
    notes: ""
  });
  const setInfoHandler = e => {
    setInfo(info => ({ ...info, [e.target.name]: e.target.value}))
 }
  
 

  const navigate = useNavigate();
  const signupChange = () =>{
    if(joinSectionsN.count+1 == 2 ){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: info.name,
          surname: info.surname,
          username: info.username,
          password: info.password,
          address: info.address,
          email: info.email,
          avatar: info.avatar,
          notes: info.notes})
      };
      fetch('/API/clients/', requestOptions)
        .then(response => response.json())
        .then(data =>{
          const token = { id: data.client._id }
          sessionStorage.setItem('token', JSON.stringify(token));
          navigate('/privateArea')
        });
    }

    setJoinSectionN((prevState)=>{
      return{
        ...joinSectionsN,
        count: prevState.count + joinSectionsN.incValue
      };
    });
  }

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
          <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formNametest" >
            <Form.Label htmlFor="nameInput">Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Name" 
              aria-label="signup name"
              aria-required="true"
              required
              onChange={setInfoHandler}/>
          </Form.Group>
          <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formSurname">
            <Form.Label htmlFor="surnameInput" >Surname</Form.Label>
            <Form.Control name="surname" type="text" placeholder="Surname" 
            aria-label="signup surname"
            aria-required="true"
            required
            onChange={setInfoHandler} />
          </Form.Group>
            <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formUsername">
              <Form.Label htmlFor="usernameInput">Username</Form.Label>
              <Form.Control name="username" type="text" placeholder="Username" 
              aria-label="signup username"
              aria-required="true"
              required
              onChange={setInfoHandler} />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formEmail">
              <Form.Label htmlFor="emailInput">Email</Form.Label>
              <Form.Control name="email" type="text" placeholder="Email" 
              aria-label="signup email"
              aria-required="true"
              required
              onChange={setInfoHandler} />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formPassword">
              <Form.Label htmlFor="passwordInput">Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Password" 
              aria-label="signup password"
              aria-required="true"
              required
              onChange={setInfoHandler}/>
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formPasswordConfirm">
              <Form.Label htmlFor="confirmPasswordInput">Confirm password</Form.Label>
              <Form.Control name="confirmPassword" type="password" 
              aria-label="signup confirm password"
              aria-required="true"
              required
              placeholder="Retype Password" />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formInterests">
              <Form.Label name="address" htmlFor="address">Address</Form.Label>
              <Form.Control name="address" type="text" 
              aria-label="signup address"
              aria-required="true"
              required
              placeholder="Address" />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 2) ? "dBlock" : "dNone"} controlId="formInterests">
              <Form.Label name="interests" htmlFor="interestsSelection">Interesting in</Form.Label>
              <Form.Select aria-label="signup interesting in"
              aria-required="true">
                <option name="Professional">Professional utilities</option>
                <option name="Household">Household utilities</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 2) ? "dBlock" : "dNone"} controlId="formPayment">
              <Form.Label name="payment" htmlFor="paymentSelection">Methods of payment</Form.Label>
              <Form.Select aria-label="signup payment method"
              aria-required="true">
                <option name="Cash">Cash</option>
                <option name="Credit">Credit Card</option>
              </Form.Select>
            </Form.Group>
          </div>
          <Button name="buttonChangeAndSubmit" className="btnForm" 
          aria-label="signup submit"
          aria-required="true"
          onClick={signupChange}>
            Go on
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default FormSignUp;
