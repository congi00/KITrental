const express = require('express');
const mongoose = require('mongoose');


const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createInvoice(docDefinition, infosPdf, successCallback, errorCallback) {
  fs.appendFile((path.resolve(__dirname,'invoices/'+infosPdf.rental_id+'.pdf')), 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  
  try { 
    let doc = new PDFDocument
    generateHeader(doc, infosPdf);
    doc.end()
    doc.pipe(fs.createWriteStream((path.resolve(__dirname,'invoices/'+infosPdf.rental_id+'.pdf'))));
  } catch(err) {
  throw(err);
}

	//generateHeader(doc, infosPdf,path);
	//generateCustomerInformation(doc, infosPdf);
	//generateInvoiceTable(doc, invoice);

	
}

function generateHeader(doc,infosPdf) {
	doc .fillColor('#444444')
    .fontSize(20)
		.text('Dear '+infosPdf.client_name+" "+infosPdf.client_surname, 90, 57)
		.image(path.join(__dirname, '../../../img/logos/KITrental-logos_black_invoice.png'), 460, 50, {
      width: 100, height: 100, align: 'right' 
    })
    .fontSize(10)
    .text('KITrental s.r.l.', 200, 155, { align: 'right' })
		.text('Via verdi 26', 200, 170, { align: 'right' })
		.text('Bologna, BO, 40124', 200, 185, { align: 'right' })
		.moveDown();
    
    var offset =0;
  infosPdf.productsInfo.forEach(element => {
    

    
    doc.image(path.join(__dirname, '../../../img/products/',element.product_image), 110, 147, {
          width: 200, height: 200
        })
        .text('Product: '+element.product_name, 110, 360, {fontSize:"13vw"})
        .text('Price x day: '+element.product_price+"$", 110, 380, {fontSize:"13vw"})
        .text('Category: '+element.product_category, 110, 400, {fontSize:"13vw"})
        .text('State: '+element.product_state, 110, 420, {fontSize:"13vw"})
        .text('Start date of rental: '+element.product_start, 110, 440, {fontSize:"13vw"})
        .text('End date of rental: '+element.product_end, 110, 460, {fontSize:"13vw"})
		.moveDown();
    offset += 350;
    doc.addPage()
  });
  
  doc .moveTo(0, 50)       // this is your starting position of the line, from the left side of the screen 200 and from top 200
   .lineTo(1200, 50)       // this is the end point the line 
   .stroke() 

  doc.text("Notes: "+infosPdf.rentalNotes, 80, 100, {fontSize:"13vw", align: 'right'})
  .text('Total: '+infosPdf.finalPrice+"$", 80, 200, {fontSize:"13vw", align: 'right'})
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
        productsInfo : req.body.productsInfo,   
        rentalNotes:  req.body.rentalNotes,
        finalPrice : req.body.finalPrice,
        rental_id : req.body.clientInfo.rental_id
    }
    

    const docDefinition = { content: "Dummy content" };
    createInvoice(
      docDefinition,
      infosPdf,
      async function(binary) {
        res.contentType("application/pdf");
        res.setHeader('Content-Type', 'application/pdf');
      },
      function(error) {
      }
    );
})

module.exports = router;