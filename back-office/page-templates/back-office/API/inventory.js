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

//Add a new product
router.post('/', async function (req, res) {
  const product = new Products({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.body.image,
      avaiability: req.body.avaiability,
      state: req.body.role,
      price: req.body.price
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
    else res.status(404).json({message: "User not found"})
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
  await Products.findOneAndUpdate(
    { _id: req.params.id},
    req.body,
    { overwrite: true }
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
