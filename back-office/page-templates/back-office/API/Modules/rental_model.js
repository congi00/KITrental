const mongoose = require("mongoose");
const Clients = require("./client_model.js");
const Products = require("./product_model.js");
const Invoice = require("./invoice_model.js");
const Schema = mongoose.Schema;


const rental = new Schema({
  _id: Schema.Types.ObjectId,
  client_id:{
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required : true,
  },
  products_id:[{
    type: Schema.Types.ObjectId,
    ref: "Products",
    required : true,
  }],
  datesProducts:[{
    startDate: {
      type: Date
    },
    endDate:{
      type: Date
    }
  }],
  invoice_id:{
    type: Schema.Types.ObjectId,
    ref: "Invoice",
  },
  start_date:{
    type: Date,
    required: true,
  },
  end_date:{
    type: Date,
    required: true,
  },
  state:{
    type: String,
    enum: ["Pending","Accepted","Active","Confirmed","Closed"],
    required: true,
  },
  price: {
    type:Number,
    required: true,
  }
});

module.exports = mongoose.model("RentalModel", rental, "rental");
