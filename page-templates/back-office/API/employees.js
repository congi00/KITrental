const express = require('express');
const mongoose = require('mongoose');


const Employees = require('./Modules/employees_model');


var router = express.Router();


// Get all the employees
router.get('/', function (req, res) {
  Employees.find()
  .exec()
  .then(employees => res.status(200).json({ employees }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get single employee
router.get('/:id', function (req, res) {
  Employees.findOne({ _id: req.params.id})
  .exec()
  .then(employees =>
    if(employees) res.status(200).json({ employees })
    else res.status(404).json({message: "User not found"})
  )
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})



module.exports = router;
