var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var jwt    = require('jsonwebtoken');
var mongoose = require('mongoose');

var app = express();
var MongoStore = require('connect-mongo')(session);
 
// app.use(express.static(__dirname + "/public"));

var models = require("./models");
var Product = models.Product;
var User = models.User;
var config = require('./config');

// sessions
app.use(
  session({
    // maxAge: 10 * 60 * 1000,
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      url: config.database,
      autoRemove: 'disabled'
    })
  })
);
const jsonParser = bodyParser.json();
app.use(jsonParser);

const ProductController = require('./controllers/productController');
// add new product
app.post("/api/product", ProductController.addProduct);

// get list of products
app.get("/api/products", ProductController.productsList);

// get one product by id
app.get("/api/products/:id", ProductController.getById);

// product delete
app.delete("/api/products/:id", ProductController.delete);

// product edit
app.put("/api/products/", ProductController.edit);

// user registration
app.post('/api/registration/', function(req, res) {
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
});

//user login
app.post('/api/login/', function(req, res) {
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
});

app.listen(3000, function(){
    console.log("Server run on 3000");
});