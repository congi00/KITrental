const express = require('express');
const mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
 var jsonParser = bodyParser.json();


const Employees = require('./Modules/employees_model.js');


var router = express.Router();

router.post('/', jsonParser, async (req, res) => {
  console.log(req.body);
  const emplUsername = req.body.emplUsername;

  await Employees.findOne({ username: emplUsername })
  .exec()
  .then(result => {
    /*let match = bcrypt.hash(password,16);
    if(!result) res.status(404).json({ message: "false" })
    else if(match == password) res.status(200).json({ message: "true" })
    else res.status(500).json({message: "false"})*/
    res.status(200).json({ message: req.body})
  })
  .catch(err =>
    res.status(400).json({message: "false", error: err})
  );
})


/*router.post('/', async (req, res) => {
  const username = "a@a.aa"
  const password = "password";

  await Employees.findOne({ username })
  .exec()
  .then(result => {
    let match = bcrypt.hash(password,16);
    if(!result) res.status(404).json({ message: "false" })
    else if(match == password) res.status(200).json({ message: "true" })
    else res.status(500).json({message: "false"})
  })
  .catch(err =>
    res.status(400).json({message: "false", error: err})
  );
})*/

module.exports = router;
