// const MongoClient    = require('mongodb').MongoClient;
// const bodyParser     = require('body-parser');

var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();
var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));
// get list of products
app.get("/api/products", function(req, res){
      
    var content = fs.readFileSync("products.json"); //, "utf8");
    var products = JSON.parse(content);
    res.send(products);
});

// get one product by id
app.get("/api/product/:id", function(req, res){
      
  var id = req.params.id; // get id
  var content = fs.readFileSync("products.json"); //, "utf8");
  var products = JSON.parse(content);
  var product = null;
  // get user by id
  for(var i=0; i<products.length; i++){
      if(products[i].id==id){
          product = products[i];
          break;
      }
  }
  // send product
  if(product){
      res.send(product);
      console.log(product);
  }
  else{
    console.log('404');
    res.status(404).send();
  }
});

// add new product
app.post("/api/products", jsonParser, function (req, res) {
     
  if(!req.body) return res.sendStatus(400);
   
  var Name = req.body.name;
  var product = {name: Name};
   
  var data = fs.readFileSync("products.json"); // "utf8");
  var products = JSON.parse(data);
   
  // max id
  var id = Math.max.apply(Math, products.map(function(o){return o.id;}))
  product.id = id+1;
  // add product to array
  products.push(product);
  var data = JSON.stringify(products);
  fs.writeFileSync("products.json", data);
  res.send(products);
});

// product delete
app.delete("/api/products/:id", function(req, res){
  var id = req.params.id;
  var data = fs.readFileSync("products.json"); //, "utf8");
  var products = JSON.parse(data);
  var index = -1;
  for(var i=0; i < products.length; i++){
      if(products[i].id==id){
          index=i;
          break;
      }
  }
  if(index > -1){
      var product = products.splice(index, 1)[0];
      var data = JSON.stringify(products);
      fs.writeFileSync("products.json", data);
      // deleted product send
      res.send(product);
  }
  else{
      res.status(404).send();
      console.log('404')
  }
});

// product edit
app.put("/api/products", jsonParser, function(req, res){
      
  if(!req.body) return res.sendStatus(400);
   
  var Id = req.body.id;
  var Name = req.body.name;
   
  var data = fs.readFileSync("products.json"); //, "utf8");
  var products = JSON.parse(data);
  var product;
  for(var i=0; i < products.length; i++){
      if(products[i].id == Id){
          product = products[i];
          break;
      }
  }
  // product's data edit
  if(product){
      product.name = Name;
      var data = JSON.stringify(products);
      fs.writeFileSync("products.json", data);
      res.send(product);
  }
  else{
      res.status(404).send(user);
  }
});

app.listen(3000, function(){
    console.log("Server run on 3000");
});