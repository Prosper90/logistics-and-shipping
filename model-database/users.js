require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");

mongoose.connect("mongodb://localhost:27017/Shipping",
    { useNewUrlParser: true, useUnifiedTopology: true, },
    function (err, res) {
        try {
            console.log('Connected to Database');
        } catch (err) {
            throw err;
        }
    });

   let db = mongoose.connection;

   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function() {
     // we're connected!
     console.log("we are connected");
    });






//for users notification
const notificationSchema = mongoose.Schema({
  title: {type: String},
  message: {type: String},
  time: {type: Date, default: Date.now}
});


//for users pickup
const pickupSchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  id: {type: String},
  shipments:  {type: String},
  loaddata: {type: String},
  cns: {type: String},

});


//for users delivery
const deliverySchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  id: {type: String},
  from:  {type: String},
  to:  {type: String},
  status: {type: String},
  cns: {type: String},
});


//for users createshipment
const createshipmentsSchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  id: {type: String},
  customername:  {type: String},
  customeremail:  {type: String},
  customeraddress: {type: String},
  customerphone: {type: Number},
  customercountry: {type: String},
  customercity:  {type: String},
  productname:  {type: String},
  productweight:  {type: Number},
  productvalue:  {type: String},
  productref:  {type: String},

});



//for users tickets
const operationSchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  id: {type: String},
  status:  {type: String},
});




//for shipment collection
const shipmentSchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  bookedshipment: {type: Number},
  arrivedshipments: {type: String},
  acceptedshipment: {type: Number},
  deliveredshipments: {type: Number},
  intransitshipment: {type: Number}
});


//for users collection
const userSchema = mongoose.Schema({
  Firstname: {type: String, required: true},
  Lastname: {type: String, required: true},
  username: {type: String, required: true},
  dateandtime : {type: Date, default: Date.now},
  email: {type: String, required: true},
  phone: {type: Number},
  state: {type: String},
  city: {type: String},
  country: {type: String},
  address: {type: String},
  zipcode: {type: String},
  password: {type: String, required: true},
  shipments: shipmentSchema,
  createshipments: [createshipmentsSchema],
  notification: [notificationSchema],
  pickupSchema: [pickupSchema],
  operation: [operationSchema]
});


  module.exports = {
    User: mongoose.model("User", userSchema),
  }
