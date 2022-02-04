const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const product = new Schema({
  _id: Schema.Types.ObjectId,
  name:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  avaiability:{
    type: String,
    enum: ["available","unavaiable"],
    required: true,
  },
  state:{
    type: String,
    enum: ["new","perfect","good","broken"],
    required: true,
  },
  price:{
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("ProductModel", product, "inventory");
