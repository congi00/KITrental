const express = require('express');
const mongoose = require('mongoose');


/*const PDFDocument = require('pdfkit');
const fs = require('fs');*/
const pdfMakePrinter = require('pdfmake/src/printer');
const fs = require('fs');
const path = require('path');

//function createInvoice(infosPdf, path) {
async  function createInvoice(docDefinition, successCallback, errorCallback) {
  try { 
    //const fontDescriptors = { ... };fontDescriptors
    var fonts = {
      Roboto: {
        normal: path.resolve(__dirname,'fonts/Roboto-Regular.ttf'),
      }
    };
    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(docDefinition);

    doc.pipe(
      fs.createWriteStream(path.resolve(__dirname,'fonts/invoices2.pdf')).on("error", (err) => {
        errorCallback(err.message);
      })
    );

    doc.on('end', () => {
      successCallback("PDF successfully created and stored");
    });
    
    doc.end();
    
  } catch(err) {
    throw(err);
  }
  /*let theOutput = new PDFDocument
  const fileName = (__dirname+`/invoices/nvoice.pdf`)
  theOutput.pipe(fs.createWriteStream(fileName))
  generateHeader(theOutput,infosPdf);
  theOutput.end()*/
  //doc.pipe(fs.createWriteStream(path+".pdf",{flags: 'w', encoding: 'utf-8',mode: 0666}));
  

	//generateHeader(doc, infosPdf,path);
	//generateCustomerInformation(doc, infosPdf);
	//generateInvoiceTable(doc, invoice);

	
}

function generateHeader(doc,infosPdf) {
	doc .fillColor('#444444')
    .fontSize(20)
		.text('Dear '+infosPdf.client_name+" "+infosPdf.client_surname, 110, 57)
		.fontSize(10)
		.text('Via verdi 26', 200, 65, { align: 'right' })
		.text('Bologna, BO, 40124', 200, 80, { align: 'right' })
		.moveDown();
    
    var offset =0;
  infosPdf.productsInfo.forEach(element => {
    doc  .text('Product: '+element.product_name, 110, 137+offset, {fontSize:"13vw"})
        .text('Price: '+element.product_price+"$", 110, 157+offset, {fontSize:"13vw"})
        .text('Category: '+element.product_category, 110, 177+offset, {fontSize:"13vw"})
        .text('State: '+element.product_state, 110, 197+offset, {fontSize:"13vw"})
		.moveDown();
    offset += 130;
  });  
  doc
  .text("Notes: "+infosPdf.rentalNotes, 210+offset, 317, {fontSize:"13vw"})
  .text('Total: '+infosPdf.finalPrice+"$", 210, 317+offset, {fontSize:"13vw"})
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
        finalPrice : req.body.finalPrice
    }
    

    const docDefinition = { content: "Dummy content" };
    createInvoice(
      docDefinition,
      function(binary) {
        res.contentType("application/pdf");
        res.setHeader('Content-Type', 'application/pdf');
      },
      function(error) {
      }
    );
    
    //createInvoice(infosPdf, "back-office/invoices/"+req.body.rentalRef)
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