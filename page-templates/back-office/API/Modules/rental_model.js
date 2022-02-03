const mongoose = require("mongoose");
const Clients = require("./client_model.js");
const Products = require("./product_model.js");
const Schema = mongoose.Schema;


const rental = new Schema({
  _id: Schema.Types.ObjectId,
  client_id:{
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required : true,
  },
  product_id:{
    type: Schema.Types.ObjectId,
    ref: "Products",
    required : true,
  },
  start_date:{
    type: Date,
    required: true,
  },
  end_date:{
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("RentalModel", rental, "rental");
