var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/blog');
//var d = mongoose.connect;
mongoose.connect('mongodb://localhost/blog');
var db=mongoose.connection;
db.on('erro',console.error.bind(console,'connection error:'));
db.once('open',function callback(){
  console.log('success');
});

var database = {
  cookieSecret: 'microblogyuanzm',
  db: db,
  host: 'localhost'
};

module.exports = database;
