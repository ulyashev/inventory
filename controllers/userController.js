const jwt    = require('jsonwebtoken');
const config = require('../config');
const User = require('../models').User;

const registration = function(req, res) {
    var userName = req.body.name;
    var userPswrd = req.body.password;
    if (userName === undefined || userPswrd === undefined) {
      return res.status(400).send({error: "name and password can't be blank"})
    };
    
    var user = new User({name: userName, password: userPswrd});
    user.save(function(err){
      if (err) {
        console.log(err);
        return res.status(400).send({error: 'Name '+ userName + ' is already taken' });
      }
      res.send(user);
    });
  };
  
const login = function(req, res) {
    var userName = req.body.name;
    var userPswrd = req.body.password;
    if (userName === undefined || userPswrd === undefined) {
      return res.status(400).send({error: "name and password can't be blank"})
    };
    User.findOne({name: userName}, function(err, user) {
      if(err) {
        console.log(err);
        return res.status(400).send(err);
      }
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = jwt.sign(user.name, config.secret, {
          });
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        } 
      }
    });
  };
  
  module.exports.registration = registration;
  module.exports.login = login;
