const mongoose = require("mongoose");
const Clients = require("./client_model.js");
const Products = require("./product_model.js");
const Schema = mongoose.Schema;


const rental = new Schema({
  _id: Schema.Types.ObjectId,
  userId:{
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required : true,
  },
  productId:{
    type: Schema.Types.ObjectId,
    ref: "Products",
    required : true,
  },
  starting_date:{
    type: Date,
    required: true,
  },
  ending_date:{
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("RentalModel", rental, "rental");
