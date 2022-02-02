global.rootDir = __dirname ;
const mongoose = require("mongoose");
const express = require("express");
const routeClients = require("./API/clients");
const routeEmployees = require("./API/employees");
const routeInventory = require("./API/inventory");
const routeOperations = require("./API/operations");
const routeRental = require("./API/rental");

const app = express();
const mongodb = "mongodb://localhost:27017/KITrental";
const port = 8000;
const db = mongoose.connection;

app.use(express.json());

app.use("/API/clients",routeClients);
app.use("/API/employees",routeEmployees);
app.use("/API/inventory",routeInventory);
app.use("/API/operations",routeOperations);
app.use("/API/rental",routeRental);




mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to Mongo!');
})

app.get('/', (req, res) => {
    res.sendFile(global.rootDir + "/index.html");
})

app.listen(port, ()=>{
    console.log('listening on port '+port);
});
