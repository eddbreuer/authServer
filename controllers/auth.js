const User = require('../models/userModel');
const jwt = require('jwt-simple');


function tokenForUser(user){
   const timestamp = new Date().getTime();
   return jwt.encode({ sub: user.id, iat: timestamp }, process.env.secret)
}
exports.signin = function(req, res, next) {
   res.send({ token: tokenForUser(req.user)})
}

exports.signup = function(req, res, next) {
   const email = req.body.email;
   const password = req.body.password;

   if(!email || !password){
      return res.status(422).send({error: "You must provide email and password"});
   }

   //email exists?
   User.findOne({email: email}, function(err, existingUser){
      if(err) {return next(err);}
      //email does exist return Error
      if(existingUser) {
         return res.status(422).send({ error: 'email is in use'});
      }
      //email doesn't exist create and save record
      const user = new User({
         email: email,
         password: password
      });

      user.save(function(err){
         if(err){
            return next(err);
         }
      });
      //respond to request user was created
      res.json({ token: tokenForUser(user) })
   });
}
