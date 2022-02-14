import React from 'react'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './joinus.css';



function FormSignUp(){
  const [joinSectionsN,setJoinSectionN] = React.useState({
    count: 0,
    bool: false,
    incValue:1
  });
  
  const [state,setState]  =  React.useState({
    name: "",
    surname: "this.state.surname",
    username: "this.state.username",
    password: "this.state.password",
    address: "this.state.address",
    email: "this.state.email",
    avatar: "img",
    notes: ""
  });
  


  const signupChange = () =>{
    if(joinSectionsN.count+1 == 2 ){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: state.name,
          surname: state.surname,
          username: state.username,
          password: state.password,
          address: "this.state.address",
          email: state.email,
          avatar: "img",
          notes: ""})
      };
      fetch('/API/clients/', requestOptions)
        .then(response => response.json())
        //.then(data => this.setState({ postId: data.id }));
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
          <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formBasicText" >
            <Form.Label htmlFor="nameInput">Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Name" onChange={e => setState({ name: e.target.value })}/>
          </Form.Group>
          <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formBasicText">
            <Form.Label htmlFor="surnameInput" >Surname</Form.Label>
            <Form.Control name="surname" type="text" placeholder="Surname" onChange={e => setState({ surname: e.target.value })} />
          </Form.Group>
            <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formBasicText">
              <Form.Label htmlFor="usernameInput">Username</Form.Label>
              <Form.Control name="username" type="text" placeholder="Username"  onChange={e => setState({ username: e.target.value })} />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 0) ? "dBlock" : "dNone"} controlId="formBasicText">
              <Form.Label htmlFor="emailInput">Email</Form.Label>
              <Form.Control name="email" type="text" placeholder="Email"  onChange={e => setState({ email: e.target.value })} />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formPassword">
              <Form.Label htmlFor="passwordInput">Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Password" onChange={e => setState({ password: e.target.value })}/>
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formPassword">
              <Form.Label htmlFor="confirmPasswordInput">Confirm password</Form.Label>
              <Form.Control name="confirmPassword" type="password" placeholder="Retype Password" />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formBasicText">
              <Form.Label name="interests" htmlFor="interestsSelection">Interesting in</Form.Label>
              <Form.Select >
                <option name="ProfessionalUtilities">Professional utilities</option>
                <option name="HouseholdUtilities">Household utilities</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formBasicText">
              <Form.Label name="payment" htmlFor="paymentSelection">Methods of payment</Form.Label>
              <Form.Select >
                <option name="Cash">Cash</option>
                <option name="CreditCard">Credit Card</option>
              </Form.Select>
            </Form.Group>
          </div>
          <Button name="buttonChangeAndSubmit" className="btnForm" onClick={signupChange}>
            Go on
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default FormSignUp;
