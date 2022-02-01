const express = require('express')
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`)
// });

//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1:27017/KITrental';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.send('Hello World!aa')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});