// const MongoClient = require('mongodb').MongoClient;

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var app = express();
var jsonParser = bodyParser.json();
 
// app.use(express.static(__dirname + "/public"));


var Schema = mongoose.Schema;
var productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "can't be blank"],
    index: true 
  },
  qty: {
    type: Number,
    default: 0
  }
});

productSchema.plugin(uniqueValidator, {message: 'is already taken.'});
var Product = mongoose.model("Product", productSchema);
mongoose.connect(
  "mongodb://localhost:27017/productsdb",
  {useNewUrlParser: true}),
  function(err){
    if (err) return console.log(err);
    app.listen(3000, function(){
      console.log("server wait for connection");
    })
  }

// add new product
app.post("/api/product", jsonParser, function (req, res) {
     
  if(!req.body) return res.sendStatus(400);
  const productName = req.body.name;
  const productQty = req.body.qty;
  const product = new Product({name: productName, qty: productQty});
  console.log(product);
  product.save(function(err){
    if(err) {
      console.log(err);
      // err handler if already exists
      return res.status(500).send({ error: 'Name '+ productName + ' is already taken' });
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

app.listen(3000, function(){
    console.log("Server run on 3000");
});