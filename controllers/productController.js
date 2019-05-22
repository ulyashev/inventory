const Product = require('../models').Product

const addProduct =  function (req, res) {
    console.log('adduser');
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
  };

const productsList = function(req, res){
    Product.find({}, function(err, products){
      if (err) return console.log(err);
      res.send(products);
    });
};

const productById = function(req, res){
    var id = req.params.id; // get id
    console.log(id);
    Product.findOne({_id:id}, function(err, product){
      if (err) return console.log(err);
      res.send(product);
    });
  };

const productEdit = function(req, res){
    if(!req.body) return res.sendStatus(400);
    const Id = req.body.id;
    const newName = req.body.name;
    const newQty = req.body.qty;
    const newProduct = {name: newName, qty: newQty}
    Product.findByIdAndUpdate({_id: Id}, newProduct, {new: true}, function(err, product){
      if (err) return console.log(err);
      res.send(product);
    });
  };
  
const productDelete = function(req, res){
    var id = req.params.id;
    Product.findByIdAndDelete(id, function(err, product){
      if (err) return console.log(err);
      res.send(product);
    });
  };
  
module.exports.addProduct = addProduct;
module.exports.productsList = productsList;
module.exports.getById = productById;
module.exports.edit = productEdit;
module.exports.delete = productDelete;