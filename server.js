require("dotenv").config();
const express = require("express");
const path = require("path");
const login = require("./routes/login");
const client = require("./routes/client");
//const adminlogin = require("./routes/adminlogin");
//const admin = require("./routes/admin");
const bodyParser = require('body-parser');
const User = require("./model-database/users").User;
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOveride = require("method-override");



const initializePassport = require("./passport-config");


initializePassport(passport);


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, '/public')));
app.enable("trust proxy");


app.use(flash());

app.use(cookieParser("secret"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
   saveUninitialized: false,
   cookie: {
     sameSite: false, // i think this is default to false
     maxAge: 60 * 60 * 1000
   }
}));

app.use(function (req, res, next) {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/login", login);
app.use("/client", client);






app.get("/",  function(req, res){
  res.render("signup");
});


app.post("/",  async function(req, res){

let databasecheck = await User.find().exec(function(err, docs) {
    if (docs.length){
      return false
    } else {
      return true
      }
  });

//check if there is data in the database
 if(databasecheck){


  let checkEmail =   await User.findOne({email: req.body.email}, function(err, user){
     if(err) return false;
     return user;
      });

  //check if username exists
  let checkUsername =   await User.findOne({username: req.body.username}, function(err, user){
      if(err) return false;
      return user;
      });


      //check if email exists
       if (checkEmail){
      //console.log("Email check");
        req.session.message = {
          type: "danger",
          intro: "Password error",
          message: "That email has already been registered"
        }

        res.redirect("/");
      }
      //check if username exists
      else if(checkUsername){
        //console.log("Email check");
        req.session.message = {
          type: "danger",
          intro: "Password error",
          message: "The Username has already been taken"
        }

        res.redirect("/");
      }

}
//end of checking the database for data

//check if any input field was not filled
 if(req.body.firstName == "" || req.body.lastName == "" || req.body.email == "" || req.body.password == "" || req.body.confirm == ""){
 //console.log("happy");
   req.session.message = {
     type: "danger",
     intro: "Empty fields",
     message: "Please insert the requested information"
   }

   res.redirect("/");
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

  res.redirect("/");
} else {


//hash password and save to the database
try{
   //console.log("Saving to db");
 const hashedPassword = await bcrypt.hash(req.body.password, 10);

//console.log(req.body);
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

 //console.log("still going");
 user.notification.push({ title: "welcome", message: "welcome To logistics. Deposit and start earning" });

 await user.save((error) => {
   if(error){
     console.log(error);
   } else {
     console.log('saved');
   }
 });





  //console.log("saved");

  res.redirect("/login");



} catch {
res.redirect("/");
}


}


});



app.listen(process.env.PORT || 3000, function(){
  console.log("App is listening on url http://localhost:3000")
});
