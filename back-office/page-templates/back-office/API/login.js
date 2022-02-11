const express = require('express');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();


const Employees = require('./Modules/employees_model.js');
const Clients = require('./Modules/client_model.js');


var router = express.Router();

router.post('/', jsonParser, async (req, res) => {
  const username = req.body.emplUsername;
  const password = req.body.emplPassword;
  console.log(username);
  
  const employee = await Employees.findOne({ username: username });
  if(!employee){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,employee.password);
    res.status(200).json({password: pass, id:employee._id, role: employee.role});
  }
})

router.post('/clients', jsonParser, async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  const client = await Clients.findOne({ username: username });
  if(!client){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,client.password);
    res.status(200).json({ id:client._id});
  }
})

router.post('/managers', jsonParser, async (req, res) => {
  const username = req.body.emplUsername;
  const password = req.body.emplPassword;
  console.log(username);
  
  const employee = await Employees.findOne({ username: username });
  if(!employee){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,employee.password);
    pass = pass && employee.role=="manager";
    res.status(200).json({password: pass, id:employee._id, role: employee.role});
  }
})


module.exports = router;
