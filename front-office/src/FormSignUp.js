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
    interests: "Professional",
    payment: "Cash",
    avatar: "",
    notes: ""
  });
  const [passwordC,setConfirm] = React.useState({
    password: ""
  });
  const setInfoHandler = e => {
    setInfo(info => ({ ...info, [e.target.name]: e.target.value}))
  }
  const [errorS,setError] = React.useState(false);
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const navigate = useNavigate();


  const checkFields = async () =>{
    if(joinSectionsN.count == 0 ){
      if(info.name != "" && 
        info.surname != "" && 
        info.username != "" && 
        re.test(info.email)){
        await fetch('/API/clients/usrCheck/'+ info.username)
          .then(response => response.json())
          .then(data =>{
          if(data.message){
            console.log(data.message)
            setError(true);
            return false;  
          }else{
            console.log(data.message)  
            setError(false);
            return true;
          }
        });
      }else{
        setError(true);
        return false;
      }
    }else if(joinSectionsN.count == 1 )
      if(info.password != "" && 
          info.password == passwordC.password && 
          info.address != ""){
          setError(false);
          return true;
        }else{
          console.log(info.password+" "+passwordC.password +" "+info.address)
          setError(true);
          return false;
        }
    
    return true;
  }
  const signupChange = () =>{
    console.log(checkFields())
    if(checkFields()){
      if(joinSectionsN.count+1 == 3 ){     
        alert(); 
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
            interests: info.interests,
            payment: info.payment,
            avatar: info.avatar,
            notes: info.notes})
        };
        fetch('/API/clients/', requestOptions)
          .then(response => response.json())
          .then(data =>{
            if(data.client){
              const token = { id: data.client._id }
              sessionStorage.setItem('token', JSON.stringify(token));
              navigate('/privateArea')
            }
          });
      }

      console.log("s")
      setJoinSectionN((prevState)=>{
        return{
          ...joinSectionsN,
          count: prevState.count + joinSectionsN.incValue
        };
      });
    }
  }

  return(
    <div className="formSection">
      <div className="formFields">
        <Form className='signup-form'>
        <Form.Text>
          <div className="titleForm">
            <h1 className="signup-title">SIGN UP</h1>
            <h4 className={errorS ? "dBlock messageError" :" dNone messageError"}>Wrong data inserted</h4>
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
              onChange={e => setConfirm({password : e.target.value})}
              placeholder="Retype Password" />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count == 1) ? "dBlock" : "dNone"} controlId="formInterests">
              <Form.Label name="address" htmlFor="address">Address</Form.Label>
              <Form.Control name="address" type="text" 
              aria-label="signup address"
              aria-required="true"
              required
              placeholder="Address"
              onChange={setInfoHandler} />
            </Form.Group>
            <Form.Group className={(joinSectionsN.count >= 2) ? "dBlock" : "dNone"} controlId="formInterests">
              <Form.Label name="interests" htmlFor="interestsSelection">Interesting in</Form.Label>
              <Form.Select aria-label="signup interesting in"
              aria-required="true"
              onChange={setInfoHandler}>
                <option name="Professional" value="Professional">Professional utilities</option>
                <option name="Household" value="Household">Household utilities</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className={(joinSectionsN.count >= 2) ? "dBlock" : "dNone"} controlId="formPayment">
              <Form.Label name="payment" htmlFor="paymentSelection">Methods of payment</Form.Label>
              <Form.Select aria-label="signup payment method"
              aria-required="true"
              onChange={setInfoHandler}>
                <option name="Cash" value="Cash" >Cash</option>
                <option name="Credit" value="Credit">Credit Card</option>
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
