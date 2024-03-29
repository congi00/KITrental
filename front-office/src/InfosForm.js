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
        url: "/API/clients/" + param,
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
    }, [])

    const submitChanges = async e => {
        e.preventDefault();
        console.log(changedInfo);
        return $.ajax({
          url: "/API/clients/" + clientInfo._id,
          type: "PATCH",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify(changedInfo),
          beforeSend: xhr => {
            xhr.setRequestHeader('auth', auth_token)
          },
          success: res => console.log(res),
          error: err => console.log(err)
        });
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