const express = require('express');
const mongoose = require('mongoose');
const login = require('./login')


const Employees = require('./Modules/employees_model.js');


var router = express.Router();
var bcrypt = require('bcrypt');


// Get all the employees
router.get('/',login.verifyPermission(login.permissionRoleLevels["manager"]), function (req, res) {
  Employees.find()
  .exec()
  .then(employees => res.status(200).json({ employees }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new employee
router.post('/',login.verifyPermission(login.permissionRoleLevels["manager"]), async function (req, res) {
  console.log(req.body)
  const employee = new Employees({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 14),
      role: req.body.role
    });
    employee
      .save()
      .then(result => {
        res.status(200).json({
          message: "Successful operation",
          employee: employee
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Invalid data inserted",
          error: err
        });
      });
})

// Get single employee
router.get('/:id', login.verifyPermission(login.permissionRoleLevels["employee"]), function (req, res) {
  Employees.findOne({ _id: req.params.id})
  .exec()
  .then(employees => {
    if(employees) res.status(200).json({ employees })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Delete employee
router.delete('/:id',login.verifyPermission(login.permissionRoleLevels["manager"]), function (req, res) {
  Employees.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})

module.exports = router;
