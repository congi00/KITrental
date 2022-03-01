const express = require('express');
const mongoose = require('mongoose');


const Products = require('./Modules/product_model');


var router = express.Router();




// Get all the products
router.get('/', function (req, res) {
  Products.find()
  .exec()
  .then(products => res.status(200).json({ products }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get the specified products
router.get('/many/:ids', function (req, res) {
  var ids = req.params.ids.split(','); // id,id,id...
  var query = {'_id': { $in: ids}}

  Products.find(query)
  .exec()
  .then(products => res.status(200).json({ products }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

// Get products by category name
router.get('/productsByCategoryName/:category', function (req, res) {
  var category = req.params.category
  var query = {'category': category}

  Products.find(query)
  .exec()
  .then(products => res.status(200).json({ products }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})


router.get('/filter/', function (req, res) {
  console.log(req.query["price"]);
  if(req.query["price"]!="null")
    if(req.query["price"] == "ASC")
      var order=1
    else
      var order=-1

    var reqFilter = {}
    if(req.query["sub"]!="null" && req.query["availability"]!="null")
      reqFilter = {
        category: req.query["category"],subCategory : req.query["sub"],availability : req.query["availability"]
      }
    else if(req.query["sub"]!="null")
      reqFilter = {
        category: req.query["category"],subCategory : req.query["sub"]
      }
    else if(req.query["availability"]!="null")
      reqFilter = {
        category: req.query["category"],availability : req.query["availability"]
      }

  if(!order)
    Products.find(reqFilter)
    .exec()
    .then(products => res.status(200).json({ products }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
  else 
    Products.find(reqFilter)
    .sort({price: order })
    .exec()
    .then(products => res.status(200).json({ products }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})




//Add a new product
router.post('/', async function (req, res) {
  console.log(req.body)
  const product = new Products({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.body.image,
      availability: req.body.availability,
      state: req.body.state,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      subCategory: req.body.subCategory,
      creation_date: req.body.creation_date,
      indisponibilityDates: req.body.indisponibilityDates
    });
    product
      .save()
      .then(result => {
        res.status(200).json({
          message: "Successful operation",
          product: product
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Invalid data inserted",
          error: err
        });
      });
})

// Get single product
router.get('/:id', function (req, res) {
  Products.findOne({ _id: req.params.id})
  .exec()
  .then(products =>
    {if(products) res.status(200).json({ products })
    else res.status(404).json({message: "Product not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


// Get single category
router.get('/category/:category', async function (req, res) {
  Products.find({ category: req.params.category})
  .exec()
  .then(products =>
    {if(products) res.status(200).json({ products })
    else res.status(404).json({message: "Category not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})

// Get single category
router.get('/subcategory/:subcategory', async function (req, res) {
  Products.find({ subCategory: req.params.subcategory})
  .sort({price: -1 })
  .exec()
  .then(products =>
    {if(products) res.status(200).json({ products })
    else res.status(404).json({message: "Category not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})



//Delete single product verify if there's no relation with rental
router.delete('/:id', async function (req, res) {
  await Products.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result =>
    {if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})

/*Verify the state*/
//Update product
router.patch('/:id', async function (req, res) {
  console.log('PATCH inventory: ');
  console.log(req.body)
  
  await Products.findOneAndUpdate(
    { _id: req.params.id},
    req.body
  )
  .exec()
  .then(result =>
    {if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "Product not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})

module.exports = router;
