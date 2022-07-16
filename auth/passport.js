const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../modal/user_modal')

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : 'secretkey'
},
 function (jwtPayload, done) {
    console.log(jwtPayload)
   return User.find({email:jwtPayload.email})
   .then(user => 
   {
     return done(null, user);
   }
 ).catch(err => 
 {
   return done(err);
 });
}
))