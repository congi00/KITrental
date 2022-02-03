const express = require('express');
const mongoose = require('mongoose');


const Rental = require('./Modules/rental_model');


var router = express.Router();

// Get every rental
router.get('/', function (req, res) {
  const reqQuery = req.query
  const query = {}
  // let multiquery= {}
  // if(queryPassed.state)
  //     multiquery = {'$in' : queryPassed.state.split(',')}
  // if (queryPassed.state) query.state = multiquery
  // if (queryPassed.date_start) query.date_start = queryPassed.date_start
  // if (queryPassed.date_end) query.date_end = queryPassed.date_end
  if (reqQuery.client_id) query.client_id = reqQuery.client_id

  Rental.find(query)
    .exec()
    .then(rental => res.status(200).json({ rental }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new rental
router.post('/', async function (req, res) {
  const rental = new Rental({
      _id: new mongoose.Types.ObjectId(),
      client_id: req.body.client_id,
      product_id: req.body.product_id,
      starting_date: req.body.starting_date,
      ending_date: req.body.ending_date,
    });
    rental
      .save()
      .then(result => {
        res.status(200).json({
          message: "Successful operation",
          rental: rental
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Invalid data inserted",
          error: err
        });
      });
})

// Get single rental
router.get('/:id', function (req, res) {
    Rental.findOne({ _id: req.params.id})
  .exec()
  .then(rental => {
    if(rental) res.status(200).json({ rental })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Delete rental
router.delete('/:id', function (req, res) {
    Rental.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Update rental
router.patch('/:id', async function (req, res) {
  if(req.params.password) req.params.password = await bcrypt.hash(req.body.password, 16);
  await Rental.findOneAndUpdate(
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
