import React from 'react'
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';


function FooterHome(){
  return(
    <div className="footerSection">
      <div className="footer-wrapper container">
        <h2 className="footerTitles" style={{fontSize:"2.5rem"}}>FAQ's</h2>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0" style={{background:"#222"}}>
            <Accordion.Header>What is KITrental and how does it work?</Accordion.Header>
            <Accordion.Body >
              KITrental is what you need in your life.
              Thanks to this application you can cook all types of food that you want.<br/>
              All you need is just a kitchen and KITrental.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>What if the utilities are broken?</Accordion.Header>
            <Accordion.Body >
              Just don't care about that! <br/>
              Subscribe to a special offer of 20€ per month and no more fee will accredit to your account.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>How much it cost the shipping?</Accordion.Header>
            <Accordion.Body>
              For more informations about shipping fee visit our <a href="/">Terms and Conditions</a>.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default FooterHome;
