var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');

var app = express();
var MongoStore = require('connect-mongo')(session);
 
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

const UserController = require('./controllers/userController');
// user registration
app.post('/api/registration/', UserController.registration);

//user login
app.post('/api/login/', UserController.login);

app.listen(3000, function(){
    console.log("Server run on 3000");
});