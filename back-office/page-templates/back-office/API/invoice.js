const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs');
const PDFDocument = require('pdfkit');

function createInvoice(infosPdf, path) {
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc, infosPdf);
	//generateCustomerInformation(doc, infosPdf);
	//generateInvoiceTable(doc, invoice);

	doc.end();
	doc.pipe(fs.createWriteStream(path+(Math.random() + 1).toString(36).substring(7)+".pdf"));
}

function generateHeader(doc,infosPdf) {
	doc .fillColor('#444444')
        .fontSize(20)
		.text('Dear '+infosPdf.client_name+" "+infosPdf.client_surname, 110, 57)
		.fontSize(10)
		.text('Via verdi 26', 200, 65, { align: 'right' })
		.text('Bologna, BO, 40124', 200, 80, { align: 'right' })
		.text('Product: '+infosPdf.product_name, 110, 137, {fontSize:"13vw"})
        .text('Price: '+infosPdf.product_price+"$", 110, 157, {fontSize:"13vw"})
        .text('Category: '+infosPdf.product_category, 110, 177, {fontSize:"13vw"})
        .text('State: '+infosPdf.product_state, 110, 197, {fontSize:"13vw"})
        .text('Address: '+infosPdf.client_address, 110, 217, {fontSize:"13vw"})
        .text('Payment: '+infosPdf.client_payment, 110, 237, {fontSize:"13vw"})
		.moveDown();
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
    console.log(req.body.rental_id);
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
    rental_id: req.body.rental_id,
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


router.post('/pdf/', async (req, res) => {
  console.log(req.body)
    const infosPdf = {
        client_name : req.body.clientInfo.client_name,
        client_surname : req.body.clientInfo.client_surname,
        client_address : req.body.clientInfo.client_address,
        client_payment : req.body.clientInfo.client_payment,        
        product_name: req.body.productInfo.product_name,
        product_image: req.body.productInfo.product_image,
        product_state: req.body.productInfo.product_state,
        product_price: req.body.productInfo.product_price,
        product_category: req.body.productInfo.product_category,
    }
    
    
    createInvoice(infosPdf, "back-office/invoices/")
    /*res.status(200).json({ message: "Successful operation", result : result })
    .exec()
    .then(result => {
      if(result){
        
      }else res.status(404).json({message: "Invoice not found"})
    })
    .catch(err =>
       res.status(400).json({message: "Error accessing server data", error: err})
    );*/
})

module.exports = router;