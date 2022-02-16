const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const promotion = new Schema({
  _id: Schema.Types.ObjectId,
  name:{
    type: String,
    required: true,
  },
  start_date:{
    type: Date,
    required: true,
  },
  end_date:{
    type: Date,
    required: true,
  },
  percentage:{
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("PromotionModel", promotion, "promotions");
