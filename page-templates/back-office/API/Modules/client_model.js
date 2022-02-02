const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const client = new Schema({
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
  address:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  avatar:{
    type: String,
    required: true,
  },
  notes:{
    type: String,
  }
});

module.exports = mongoose.model("ClientModel",client);
