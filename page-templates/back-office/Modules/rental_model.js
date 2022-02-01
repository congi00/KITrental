const mongoose = require("mongoose");
const Clients = require("./clients_model.js");
const Employees = require("./employees_model.js");
const Schema = mongoose.Schema;


const rental = new Schema({
  _id: Schema.Types.ObjectId,
  userId:{
    type: Schema.Types.ObjectId,
    ref: Clients,
    required : true,
  }
});

module.export = mongoose.model("RentalModel",rental);
