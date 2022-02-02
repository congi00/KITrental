const mongoose = require("mongoose");
const Employees = require("./employees_model.js");
const Rental = require("./rental_model.js");
const Schema = mongoose.Schema;


const operation = new Schema({
  _id: Schema.Types.ObjectId,
  type:{
    type: String,
    enum: ["rent_create","rent_update","rent_close"],
    required: true,
  },
  employeeId:{
    type: Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },
  rentalId:{
    type: Schema.Types.ObjectId,
    ref: "Rental",
    required: true,
  },
});

module.exports = mongoose.model("OperationModel",operation);
