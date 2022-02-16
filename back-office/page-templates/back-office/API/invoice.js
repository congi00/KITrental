const express = require('express');
const mongoose = require('mongoose');


const Invoice = require('./Modules/invoice_model');
const Rental = require('./Modules/rental_model');


var router = express.Router();

// get all invoices 
router.get('/', function (req, res) {
    Invoice.find()
    .exec()
    .then(invoices => res.status(200).json({ invoices }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get every invoices from frontoffice
router.get('/client/:query', function (req, res) {
  const client = req.params.query
  const query = {}
  query.client_id = client

  Invoice.find(query)
    .sort({ start_date: -1 })
    .exec()
    .then(invoice => res.status(200).json({ invoice }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get single invoice
router.get('/:id', function (req, res) {
    Invoice.findOne({ _id: req.params.id})
     .exec()
    .then(invoice => {
        if(invoice) res.status(200).json({ invoice })
        else res.status(404).json({invoice: "invoice not found"})
    })
    .catch(err =>
        res.status(400).json({message: "Error accessing server data", error: err})
    );
})



//Add a new rental
router.post('/', async function (req, res) {
  console.log(req.body)
  const invoice = new Invoice({
    _id: new mongoose.Types.ObjectId(),
    client_id: req.body.client_id._id ,
    product_id: req.body.product_id._id ,
    rentals_id: req.body.rentals_id._id,
    end_date:   req.body.end_date,
    client_name:req.body.client_name,
    client_surname:req.body.client_surname,
    client_address:req.body.client_address,
    client_payment:req.body.client_payment,
    total:req.body.total
  });
  
  invoice
    .save()
    .then(result => {
      res.status(200).json({
        message: "Successful operation",
        invoice: invoice
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Invalid data inserted",
        error: err
      });
    });
})

module.exports = router;