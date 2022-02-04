const express = require('express');
const mongoose = require('mongoose');


const Employees = require('./Modules/employees_model.js');


var router = express.Router();
var bcrypt = require('bcrypt');


// Get all the employees
router.get('/', function (req, res) {
  Employees.find()
  .exec()
  .then(employees => res.status(200).json({ employees }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new employee
router.post('/', async function (req, res) {
  const employee = new Employees({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 16),
      role: req.body.role,
      email: req.body.email,
      avatar: req.body.avatar
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
router.get('/:id', function (req, res) {
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
router.delete('/:id', function (req, res) {
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


//Update employee
router.patch('/:id', async function (req, res) {
  if(req.params.password) req.params.password = await bcrypt.hash(req.body.password, 16);
  await Employees.findOneAndUpdate(
    { _id: req.params.id},
    req.body,
    { overwrite: true }
  )
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


/*exports.cryptPassword = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err)
    return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });
  });
};*/

/*exports.comparePassword = function(plainPass, hashword, callback) {
  bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
    return err == null ?
    callback(null, isPasswordMatch) :
    callback(err);
  });
};*/

module.exports = router;
