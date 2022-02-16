const express = require('express');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');



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

router.patch('/:id', async function (req, res) {
    console.log();
    let reqD = req.body.rental_id;

    await Invoice.findOneAndUpdate(
      {_id: req.params.id},
      {$set: 
        {"rental_id" : reqD}
      },
      {overwrite: true}
    )
    .exec()
    .then(result => {
      if(result) res.status(200).json({ message: "Successful operation", result : result })
      else res.status(404).json({message: "Client not found"})
    })
    .catch(err =>
      res.status(400).json({message: "Error accessing server data", error: err})
    );
})

router.delete('/:id', function (req, res) {
    Invoice.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})

//Add a new invoice
router.post('/', async function (req, res) {
  console.log(req.body)
  const invoice = new Invoice({
    _id: new mongoose.Types.ObjectId(),
    rentals_id: req.body.rentals_id._id,
    end_date: req.body.end_date,
    filePdf: req.body.total
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


router.post('/pdf/:id', (req, res) => {
    const doc = new PDFDocument()
    let filename = req.body.rental_id
    // Stripping special characters
    filename = encodeURIComponent(filename) + '.pdf'
    // Setting response to 'attachment' (download).
    // If you use 'inline' here it will automatically open the PDF
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    const content = req.body.content
    doc.y = 300
    doc.text(content, 50, 50)
    doc.pipe(res)
    doc.end()
})

module.exports = router;