require("dotenv").config();
const express = require("express");
const path = require("path");
const signup = require("./routes/signup");
const login = require("./routes/login");
const client = require("./routes/client");

const bodyParser = require('body-parser');
const User = require("./model-database/users").User;
const passport = require("passport");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
//const expressvalidator = require("express-validator");
const session = require("cookie-session");
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
  resave: true,
  saveUninitialized: true
}))


app.use(function (req, res, next) {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/signup", signup);
app.use("/login", login);
app.use("/client", client);






app.get("/",  function(req, res){
  res.render("home");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("App is listening on url http://localhost:3000")
});
