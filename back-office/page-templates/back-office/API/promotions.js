const express = require('express');
const mongoose = require('mongoose');
const login = require('./login')

const Promotion = require('./Modules/promotion_model');

var router = express.Router();

// Get all the promotions
router.get('/', function (req, res) {
  Promotion.find()
    .exec()
    .then(promotions => res.status(200).json({ promotions }))
    .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new promotion
router.post('/', async function (req, res) {
  
  const promotion = new Promotion({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      percentage: req.body.percentage,
    });

    promotion
      .save()
      .then(result => {
        res.status(200).json({
          message: "Successful operation",
          promotion: promotion
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Invalid data inserted",
          error: err
        });
      });
})


//Delete promotion
router.delete('/:id',login.verifyPermission(login.permissionRoleLevels["employee"]), function (req, res) {
  Promotion.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "Promotion not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})

module.exports = router;
