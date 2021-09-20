const LocalStrategy = require("passport-local").Strategy;
const User = require("./model-database/users").User;
const Admin = require("./model-database/admindb");
const bcrypt = require("bcrypt");



function initialize(passport){
passport.use(new LocalStrategy(  { usernameField: 'email', passwordField: 'password',  passReqToCallback: true },
async function(req, email, password,  done){





  if(req.params.admin == "Elivino"){
  //  console.log("starting");
    //check for admin
    try{
   await Admin.findOne({ email: email }, function(err, user){
     if (err)  return done(err);
     //check if user exist
       console.log(user);
     if(!user) {
      // console.log("user false");
       return done(null, false, {message: "Wrong Email"});
     }

          //checks for password
      else if( password == user.password){
        //  console.log("check password");
         return done(null, user);
        } else {
          console.log("pass error");
          return done(null, false, {message: "password do not match"});
        }


     })
   } catch(err){
     console.log(err);
     process.exit(1);
   };

  }
    //end of check for admin


   try{
//finding client user in database
await User.findOne({ email: email }, async function(err, user){
//console.log(user);
  if (err)  return done(err);
  //check if user exist
  if(!user) {
    //console.log("second happy");
    return done(null, false, {message: 'Wrong Email'});
  };

       //checks for password
     if(await bcrypt.compare(password, user.password) ){
       //console.log("check password");
      return done(null, user);
     } else {
       return done(null, false, {message: 'passwords do not match'});
     }


  })
}catch(err){
  console.log(err);
  process.exit(1);
};
 //end of client check




}));
// end of user passport auth








//serialize
passport.serializeUser(function(user, done) {
done(null, user.id);
});

//deserialize
passport.deserializeUser( async function(id, done) {




 let admin = await Admin.findOne({ _id: id },  function(err, user){
   //console.log(user);
     if (err)  return done(err);
     }).catch(err => console.log(err));

 //for admin
 if(admin){
   try{
 await Admin.findById(id, function(err, user) {
 done(err, user);
})
} catch(err){
 console.log(err);
};
 //end of if of for admi
} else {
 //for user
 try{
  await User.findById(id, function(err, user) {
 done(err, user);
})
} catch(err){
 console.log(err)
};
//end of for user
}


});


}


module.exports = initialize;
