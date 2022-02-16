const mongoose = require("mongoose");
const Clients = require("./client_model.js");
const Products = require("./product_model.js");
const Rental = require("./rental_model.js");
const Schema = mongoose.Schema;


const invoice = new Schema({
  _id: Schema.Types.ObjectId,
  rental_id:{
    type: Schema.Types.ObjectId,
    ref: "Rental",
  },
  filePdf:{
    type: String,
    required: true,
  },
  end_date:{
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("InvoiceModel", invoice, "invoice");
