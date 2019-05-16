var express = require("express");
var bodyParser = require("body-parser");
var jwt    = require('jsonwebtoken');

var app = express();
var jsonParser = bodyParser.json();
 
// app.use(express.static(__dirname + "/public"));

var models = require("./models");
var Product = models.Product;
var User = models.User;

// add new product
app.post("/api/product", jsonParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const productName = req.body.name;
  const productQty = req.body.qty;
  const product = new Product({name: productName, qty: productQty});
  product.save(function(err){
    if(err) {
      console.log(err);
      // err handler if already exists
      return res.status(400).send({ error: 'Name '+ productName + ' is already taken' });
    }
    res.send(product);
  })
});

// get list of products
app.get("/api/products", function(req, res){
    Product.find({}, function(err, products){
      if (err) return console.log(err);
      res.send(products);
    });
});

// get one product by id
app.get("/api/products/:id", function(req, res){
  var id = req.params.id; // get id
  console.log(id);
  Product.findOne({_id:id}, function(err, product){
    if (err) return console.log(err);
    res.send(product);
  });
});


// product delete
app.delete("/api/products/:id", function(req, res){
  var id = req.params.id;
  Product.findByIdAndDelete(id, function(err, product){
    if (err) return console.log(err);
    res.send(product);
  });

});

// product edit
app.put("/api/products/", jsonParser, function(req, res){
      
  if(!req.body) return res.sendStatus(400);
   
  const Id = req.body.id;
  const newName = req.body.name;
  const newQty = req.body.qty;
  const newProduct = {name: newName, qty: newQty}
  Product.findByIdAndUpdate({_id: Id}, newProduct, {new: true}, function(err, product){
    if (err) return console.log(err);
    res.send(product);
  });
   
});

// user registration
app.post('/api/registration/', jsonParser, function(req, res) {
  // if ((!))
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

app.listen(3000, function(){
    console.log("Server run on 3000");
});