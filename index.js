global.rootDir = __dirname ;
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const routeClients = require("./back-office/page-templates/back-office/API/clients");
const routeEmployees = require("./back-office/page-templates/back-office/API/employees");
const routeInventory = require("./back-office/page-templates/back-office/API/inventory");
const routeOperations = require("./back-office/page-templates/back-office/API/operations");
const routeRental = require("./back-office/page-templates/back-office/API/rental");
const routeLogin = require("./back-office/page-templates/back-office/API/login");
const bodyParser = require("body-parser");

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
app.use("/API/login",routeLogin);

app.use("/js",express.static(global.rootDir + "/back-office/js"));
app.use("/css",express.static(global.rootDir + "/back-office/css"));
app.use("/img",express.static(global.rootDir + "/back-office/img"));

app.use(express.static(global.rootDir + "/front-office/build"));
app.use(express.static(global.rootDir + "/front-office/public"));


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())




mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to Mongo!');
})

app.get('/', (req, res) => {
    res.sendFile(global.rootDir + "/front-office/build/index.html");
})

app.get('/backoffice', (req, res) => {
    res.sendFile(global.rootDir + "/back-office/page-templates/back-office/index.html");
})

app.get('/dashboard', (req, res) => {
    res.sendFile(global.rootDir + "/dashboard/admin-dashboard.html");
})

app.listen(port, ()=>{
    console.log('listening on port '+port);
});
