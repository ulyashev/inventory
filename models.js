var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var userSchema =  new Schema({ 
  name: {
      type:String, 
      unique: true,
      required: [true, "can't be blank"],
      index: true
  },
  password: {
      type:String, 
      required: [true, "can't be blank"],
  }
});

// userSchema.methods.comparePassword = function(password){
//   return bcrypt.compareSync(password, this.has_password);
// };


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
  var User = mongoose.model('User', userSchema);
  var config = require('./config');
  mongoose.connect(
    // "mongodb://localhost:27017/productsdb",
    config.database,
    {useNewUrlParser: true})
 module.exports.Product = Product;
 module.exports.User = User;