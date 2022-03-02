const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const employees = new Schema({
  _id: Schema.Types.ObjectId,
  username:{
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  password:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum: ["manager","officer"],
    required: true,
  },
});

module.exports = mongoose.model("EmployeesModel", employees, "employees");
