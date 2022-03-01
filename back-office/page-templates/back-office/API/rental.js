const express = require('express');
const mongoose = require('mongoose');
const login = require('./login')

const Rental = require('./Modules/rental_model');


var router = express.Router();

// Get every rental
router.get('/',login.verifyPermission(login.permissionRoleLevels["employee"]), function (req, res) {
  const reqQuery = req.query
  const query = {}
  if (reqQuery.client_id) query.client_id = reqQuery.client_id
  
  Rental.find(query)
    .sort({ start_date: 1 })
    .exec()
    .then(rental => res.status(200).json({ rental }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get every rental from frontoffice
router.get('/client/:query', function (req, res) {
  const client = req.params.query
  const query = {}
  query.client_id = client

  Rental.find(query)
    .sort({ start_date: -1 })
    .exec()
    .then(rental => res.status(200).json({ rental }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get every rental matching product id
router.get('/rentalByProductId/:id', function (req, res) {
  const prod = req.params.id
  const query = {}
  query.products_id = prod

  Rental.find(query)
    .exec()
    .then(rental => res.status(200).json({ rental }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get every rental matching array of products ids
router.get('/rentalByProductsIds/:ids', login.verifyPermission(login.permissionRoleLevels["employee"]), function (req, res) {
  var ids = req.params.ids.split(','); // id,id,id...
  var query = {'products_id': { $in: ids}}

  Rental.find(query)
    .exec()
    .then(rental => res.status(200).json({ rental }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new rental
router.post('/', function (req, res) {
  console.log(req.body);

  const rental = new Rental({
    _id: new mongoose.Types.ObjectId(),
    client_id: req.body.client_id,
    products_id: req.body.products_id,
    datesProducts : req.body.datesProducts,
    start_date: req.body.start_date,
    state: req.body.state,
    price: req.body.price,
    real_price: req.body.real_price
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
router.get('/:id',login.verifyPermission(login.permissionRoleLevels["client"]), function (req, res) {
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
  console.log('PATCH RENTAL')
  console.log(req.body)
  await Rental.findOneAndUpdate(
    { _id: req.params.id},
    req.body
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
