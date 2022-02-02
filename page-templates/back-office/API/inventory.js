//Import the mongoose module
const express = require('express')
var mongoose = require('mongoose');

const app = express();
const port = 8000;

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/KITrental';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.send('Hello World!aa')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

/*

*/
