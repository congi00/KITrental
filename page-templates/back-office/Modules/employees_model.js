const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const employees = new Schema({
  _id: Schema.Types.ObjectId,
  name:{
    type: String,
    required: true,
  },
  surname:{
    type: String,
    required: true,
  },
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
  email:{
    type: String,
  },
  avatar:{
    type: String,
  },
});

module.export = mongoose.model("EmployeesModel",employees);
