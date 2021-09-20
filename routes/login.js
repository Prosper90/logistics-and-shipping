const express = require("express");
const path = require("path");
const User = require("../model-database/users").User;
 const passport = require("passport");
 const LocalStrategy = require("passport-local").Strategy;
 const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/", function(req, res){
  res.render("login");
});



router.post("/", passport.authenticate("local", {
failureFlash: true,
failureRedirect: "/login",
successRedirect: "/client"
})
);









module.exports = router;
