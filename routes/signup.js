
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../model-database/users").User;
const shortid = require("shortid");
const router = express.Router();



router.get("/", function(req, res){
  //console.log(req.query.referrer);
  res.render("signup", {referrer: req.query.referrer});
});




router.post("/",  async function(req, res){





 //console.log("entered the post");

let checkEmail =   await User.findOne({email: req.body.email});

//check if username exists
let checkUsername =   await User.findOne({username: req.body.username});

console.log(checkEmail);

//check if any input field was not filled
if(req.body.firstName == "" || req.body.lastName == "" || req.body.email == "" || req.body.password == "" || req.body.confirm == ""){
 //console.log("happy");
   req.session.message = {
     type: "danger",
     intro: "Empty fields",
     message: "Please insert the requested information"
   }

   res.redirect("signup");
  }
  //check if email exists
  else if (checkEmail){
  //console.log("Email check");
    req.session.message = {
      type: "danger",
      intro: "Password error",
      message: "That email has already been registered"
    }

    res.redirect("signup");
  }
  //check if username exists
  else if(checkUsername){
    //console.log("Email check");
    req.session.message = {
      type: "danger",
      intro: "Password error",
      message: "The Username has already been taken"
    }

    res.redirect("signup");
  }
//console.log(req.body.password);
//console.log(req.body.confirm);
  //checks if the confirm password matches the first password
else if(req.body.password != req.body.confirm){
  //console.log("password check");
  req.session.message = {
    type: "danger",
    intro: "Password error",
    message: "Passwords do not match"
  }

  res.redirect("signup");
} else {


//hash password and save to the database
try{
   //console.log("Saving to db");
 const hashedPassword = await bcrypt.hash(req.body.password, 10);

 let user = new User({
     Firstname: req.body.Firstname,
     Lastname: req.body.Lastname,
     username: req.body.username,
     email: req.body.email,
     country: req.body.country,
     state: req.body.state,
     city: req.body.city,
     address: req.body.address,
     zipcode: req.body.zipcode,
     phone: req.body.phone,
     password: hashedPassword,


 });

 user.notification.push({ title: "welcome", message: "welcome To Investnest. Deposit and start earning" });


 user.investment = {
   Investedamount: 0,
   TotalInvestment: 0,
   ExpectedReturn: 0,
   RequestpaymentId: 0,
   BTCWithdrawAddress: "",
   ETHWithdrawAddress: "",
   withdrawalAmount : 0
 };



  await user.save();



  res.redirect("login");



} catch {
res.redirect("signup");
}


}


});







module.exports = router;
