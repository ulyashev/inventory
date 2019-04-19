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


  
app.listen(3000, function(){
    console.log("Server run on 3000");
});