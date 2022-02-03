const express = require('express');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
 var jsonParser = bodyParser.json();


const Employees = require('./Modules/employees_model.js');


var router = express.Router();

router.post('/', jsonParser, async (req, res) => {
  const username = req.body.emplUsername;
  const password = req.body.emplPassword;

  const employee = await Employees.findOne({ username: username });
  if(!employee){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,employee.password);
    res.status(200).json({password: pass, id:employee._id, role: employee.role});
  }
})



module.exports = router;
