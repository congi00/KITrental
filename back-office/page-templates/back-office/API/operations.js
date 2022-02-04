const express = require('express');
const mongoose = require('mongoose');


const Operation = require('./Modules/operation_model');


var router = express.Router();

// Get all the operations
router.get('/', function (req, res) {
  const reqQuery = req.query
  const query = {}
  if (reqQuery.rental_id) query.rental_id = reqQuery.rental_id
  Operation.find()
    .exec()
    .then(operations => res.status(200).json({ operations }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new operation
router.post('/', async function (req, res) {
  const operation = new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: req.body.type,
      employeeId: req.body.employeeId,
      rentalId: req.body.rentalId,
    });
    operation
      .save()
      .then(result => {
        res.status(200).json({
          message: "Successful operation",
          operation: operation
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Invalid data inserted",
          error: err
        });
      });
})

// Get single operation
router.get('/:id', function (req, res) {
  Operation.findOne({ _id: req.params.id})
  .exec()
  .then(operations => {
    if(operations) res.status(200).json({ operations })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Delete operation
router.delete('/:id', function (req, res) {
  Operation.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Update operation
router.patch('/:id', async function (req, res) {
  if(req.params.password) req.params.password = await bcrypt.hash(req.body.password, 16);
  await Operation.findOneAndUpdate(
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

module.exports = router;
