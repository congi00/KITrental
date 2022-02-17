import React from 'react'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './login.css';
import { useNavigate,useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery'


function InfosForm(){
    const [searchParams, setSearchParams] = useSearchParams();
    const param = searchParams.get("usrID");
    const navigate = useNavigate();
    const [clientInfo, setClientInfo] = React.useState([]);
    const [changedInfo,changeC] = React.useState({});
    const auth_token = sessionStorage.getItem("auth")

    React.useEffect(() => {
      $.ajax({
        url: "http://localhost:8000/API/clients/" + param,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', auth_token)
        },
        success: res => {
          setClientInfo(res.client);
          console.log(res.client.username)
          changeC({
              name: res.client.name,
              surname: res.client.surname,
              username: res.client.username,
              password: res.client.password,
              email : res.client.email,
          });
        },
        error: err => console.log(err)
      });

        // fetch("http://localhost:8000/API/clients/"+param)
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //     setClientInfo(result.client);
        //     console.log(result.client.username)
        //     changeC({
        //         name: result.client.name,
        //         surname: result.client.surname,
        //         username: result.client.username,
        //         password: result.client.password,
        //         email : result.client.email,
        //     });

        //     },
        //     // Note: it's important to handle errors here
        //     // instead of a catch() block so that we don't swallow
        //     // exceptions from actual bugs in components.
        //     (error) => {
        //         alert("error");
        //     }
        // )
    }, [])

    const submitChanges = async e => {
        e.preventDefault();
        console.log(changedInfo);
        return $.ajax({
          url: "http://localhost:8000/API/clients/" + clientInfo._id,
          type: "PATCH",
          body: JSON.stringify(changedInfo),
          beforeSend: xhr => {
            xhr.setRequestHeader('auth', auth_token)
          },
          success: res => console.log(res),
          error: err => console.log(err)
        });
        // return fetch('http://localhost:8000/API/clients/'+clientInfo._id, {
        // method: 'PATCH',
        // headers: {
        //     'Content-Type': 'application/json',
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers":"Content-Type, Authorization, X-Requested-With"
        // },
        // body: JSON.stringify(changedInfo)
        // })
        // .then(
        // data => data.json()
        // )
    }


    return(
    <div className="infoSection">
       <Link to="/privateArea">
        <FontAwesomeIcon className="backIcon" icon={faArrowLeft} size="2x"/>
       </Link>
      <div className="formFields">
        <Form className="Infos-form">
        <Form.Text>
          <div className="titleFormC">
            <h1 className="changeinfos-title">Personal Informations</h1>
          </div>
        </Form.Text>
        <div className="firstSectionC">
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder={clientInfo.name} onChange={e => changeC(changedInfo => ({ ...changedInfo, name: e.target.value}))}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSurname">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" placeholder={clientInfo.surname} onChange={e => changeC(changedInfo => ({ ...changedInfo, surname: e.target.value}))}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder={clientInfo.username} onChange={e => changeC(changedInfo => ({ ...changedInfo, username: e.target.value}))}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder ="password" onChange={e => changeC(changedInfo => ({ ...changedInfo, password: e.target.value}))}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPasswordConfirm">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control type="password" placeholder="confirm password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder={clientInfo.email} onChange={e => changeC(changedInfo => ({ ...changedInfo, email: e.target.value}))}/>
          </Form.Group>
        </div>
          <Button type = 'submit' className="btnFormC" onClick={submitChanges}>
            Change infos
          </Button>
        </Form>
      </div>
    </div>
  );
}


export default InfosForm;