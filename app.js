//加载依赖库，原来这个类库都封装在connect中，现在需要单独加载
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash'); //配置到session中
var partials = require('express-partials');
var database = require('./models/database');



//加载路由控制
var routes = require('./routes/index');
var users = require('./routes/users');


//创建项目实例
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//定义日志和输出级别
app.use(logger('dev'));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//定义cookie解析器
app.use(cookieParser());
//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: database.cookieSecret,
    store: new MongoStore({
        mongooseConnection: database.db
    })
}));
/*app.use(session({
        secret: 'keyboard cat',
        key: 'sid',
        cookie: { secure: true }
      })
    );   //配置session到内存中
*/

app.use(partials());   //在route之前 使用ejs
app.use(flash());




app.use(function(req, res, next){
  console.log("Comes to DynamicHelper");
  console.log("Session: ", req.session);
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});


//匹配路径和路由
app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;      //输出模型app
