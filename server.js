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

  
app.listen(3000, function(){
    console.log("Server run on 3000");
});