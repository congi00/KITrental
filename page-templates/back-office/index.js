const mongoose = require("mongoose");
const express = require("express");
const routeClients = require("./API/clients");
const routeEmployees = require("./API/employees");
const routeInventory = require("./API/inventory");
const routeOperations = require("./API/operations");
const routeRental = require("./API/rental");

const app = express();
const mongodb = "mongodb://localhost:27017/KITrental"
const port = 8000;
const db = mongoose.connection;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to Mongo!');
})

app.get('/employees', (req, res) => {
    res.sendFile("./index.html");
})

app.listen(port, ()=>{
    console.log('listening on port '+port);
});
