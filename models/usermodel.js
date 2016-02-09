var mongoose = require('mongoose');
var database = require('./database')
var UserSchema = mongoose.Schema({
      name:String,
      password:String
  });
module.exports = database.db.model("User",UserSchema);
