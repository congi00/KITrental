const express = require('express');
const mongoose = require('mongoose');


const Client = require('./Modules/client_model');


var router = express.Router();
var bcrypt = require('bcrypt');

// Get all the clients
router.get('/', function (req, res) {
  Client.find()
  .exec()
  .then(clients => res.status(200).json({ clients }))
  .catch(err => res.status(400).json({message: "Error accessing server data", error: err}));
})

//Add a new client
router.post('/', async function (req, res) {
  
  const client = new Client({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 14),
      address: req.body.address,
      email: req.body.email,
      avatar: req.body.avatar,
      interests: req.body.interests,
      payment: req.body.payment,
      notes: req.body.notes,
    });
    console.log(client);
    client
      .save()
      .then(result => {
        res.status(200).json({
          message: "Successful operation",
          client: client
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Invalid data inserted",
          error: err
        });
      });
})

// Get single client
router.get('/:id', function (req, res) {
  Client.findOne({ _id: req.params.id})
  .exec()
  .then(client => {
    if(client) res.status(200).json({ client })
    else res.status(404).json({message: "User not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Delete client
router.delete('/:id', function (req, res) {
  Client.findOneAndDelete({ _id: req.params.id})
  .exec()
  .then(result => {
    if(result) res.status(200).json({ message: "Successful operation", result : result })
    else res.status(404).json({message: "Client not found"})
  })
  .catch(err =>
    res.status(400).json({message: "Error accessing server data", error: err})
  );
})


//Update client
router.patch('/:id', async function (req, res) {
  let updateData = req.body
  if(updateData.password) updateData.password = await bcrypt.hash(updateData.password, 14)
 
  await Client.findOneAndUpdate(
    {_id: req.params.id},
    {$set : updateData},
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

module.exports = router;
