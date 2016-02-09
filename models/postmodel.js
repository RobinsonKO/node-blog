var database = require('./database')
var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
      user: String,
      post: String,
      time: Date
  });
/*
db = mongoose.connect('mongodb://localhost/blog');
var Schema = mongoose.Schema;
var PostSchema = Schema({
     name:String,
     password:String,
     time:Date
})
var PostModel = db.model("Post",PostSchema);
var PostEntity = new PostModel({
     name:'jack',
     password:'123',
     time:new Time();
})
//module.exports = mongoose.model("Post",PostSchema);
*/
module.exports = database.db.model("Post",PostSchema);
