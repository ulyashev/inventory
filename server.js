// const MongoClient = require('mongodb').MongoClient;

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

var app = express();
var jsonParser = bodyParser.json();
 
// app.use(express.static(__dirname + "/public"));

var Schema = mongoose.Schema;
var productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    default: 0
  }
});

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
    if(err) return console.log(err);
    res.send(product);
  })
});


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