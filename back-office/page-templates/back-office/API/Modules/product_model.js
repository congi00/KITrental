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
  availability:{
    type: String,
    enum: ["available","unavailable"],
    required: true,
  },
  state:{
    type: String,
    enum: ["new","perfect","good","broken"],
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  category:{
    type: String,
    enum: ["Professional","Household"],
    required: true,
  },
  subCategory:{
    type: String,
    enum: ["Blender","Torch","Barbeque","Kneader"],
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  creation_date:{
    type: Date,
    required: true
  },
  indisponibilityDates:[{
    startD:{
      type: Date
    },
    endD:{
      type: Date
    },
  }]
});

module.exports = mongoose.model("ProductModel", product, "inventory");
