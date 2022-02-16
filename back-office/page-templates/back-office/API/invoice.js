const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs');
const PDFDocument = require('pdfkit');

async function createInvoice(invoice, path) {
	let doc = new PDFDocument({ margin: 50 });

	//generateHeader(doc);
	//generateCustomerInformation(doc, invoice);
	//generateInvoiceTable(doc, invoice);
	generateFooter(doc);

	doc.end();
	doc.pipe(fs.createWriteStream(path+"change.pdf"));
}

/*function generateHeader(doc) {
	doc.image('img/products/blender.jpg', 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('ACME Inc.', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();
}*/

function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}

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
    rentals_id: req.body.rentals_id,
    end_date: req.body.end_date,
    filePdf: req.body.filePdf
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


router.patch('/pdf/:id', async (req, res) => {
    console.log(req.params.id)
    await Invoice.findOneAndUpdate(
      {_id: req.params.id},
      {$set: 
        {"rental_id" : "prova"}
      },
      {overwrite: true}
    )
    .exec()
    .then(result => {
      if(result){
        createInvoice(result, "back-office/invoices/")
        res.status(200).json({ message: "Successful operation", result : result })
      }else res.status(404).json({message: "Invoice not found"})
    })
    .catch(err =>
       res.status(400).json({message: "Error accessing server data", error: err})
    );
})

module.exports = router;