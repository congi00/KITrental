const mongoose = require("mongoose");
const Clients = require("./client_model.js");
const Products = require("./product_model.js");
const Rental = require("./rental_model.js");
const Schema = mongoose.Schema;


const invoice = new Schema({
  _id: Schema.Types.ObjectId,
  client_id:{
    type: Schema.Types.ObjectId,
    ref: "Clients",
  },
  product_id:{
    type: Schema.Types.ObjectId,
    ref: "Products",
  },
  rentals_id:[{
    type: Schema.Types.ObjectId,
    ref: "Rental",
  }],
  end_date:{
    type: Date,
    required: true,
  },
  client_name:{
    type: String,
  },
  client_surname:{
    type: String,
  },
  client_address:{
    type: String,
  },
  client_payment:{
    type: String,
    enum: ["Cash","Credit"],
  },
  total:{
    type: Number,
  },
});

module.exports = mongoose.model("InvoiceModel", invoice, "invoice");
