const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var userSchema =  new Schema({ 
  name: {
      type: String, 
      unique: true,
      required: [true, "can't be blank"],
      index: true
  },
  hashPassword: {
      type: String, 
      required: [true, "can't be blank"]
  },
  salt: {
    type: String,
    required: [true, "can't be blank"]
  }
});

userSchema.methods.encryptPswrd = function(password){
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
  .set(function(password){
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashPassword = this.encryptPswrd(password);
  })
  .get(function(){
    return this._plainPassword;
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
    config.database,
    {useNewUrlParser: true})

 module.exports.Product = Product;
 module.exports.User = User;
