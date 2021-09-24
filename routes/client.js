const express = require("express");
const User = require("../model-database/users").User;
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();




router.get("/", checkAuthenticated, async function(req, res){



  let user = await User.findById({ _id: req.user._id }, function(err, user){
      if (err)  return err;
      });


  res.render("clientlayout/client", {
    user : user,
    address: false
  });
});




















function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect("/login")
}



router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});





module.exports = router;
