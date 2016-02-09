var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var UserModel = require('../models/usermodel');
var PostModel = require('../models/postmodel');

/* GET home page. */
router.get('/', function(req, res, next) {
  PostModel.find(null,function(err,posts) {
    console.log("posts: " + posts[0] + posts[1]);

    res.render('index', {
      title: '首页',
      posts : posts,
      user : req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
     });
  })
});

router.route('/reg')
    .all(checkNotLogin)
    .get(function(req, res, next) {
      res.render('reg', {title: '用户注册'});
    })
    .post(function(req, res) {
      //检查用户两次输入的口令是否一致
      if (req.body['password-repeat'] != req.body['password']) {
        req.flash('error','两次输入密码口令不一致');
        console.log("Session: ", req.session);
        return res.redirect('/reg');
      }
      //生成口令的离散值
    //  var md5 = crypto.createHash('md5');
      //var password = md5.update(req.body.password).digest('base64');

      var UserEntity = new UserModel({
        name: req.body.username,
        password: req.body.password
      });

      //检查用户名是否已经存在
      UserModel.findOne({'name':UserEntity.name}, function(err, user) {
    		if (user){
    			err = 'Username already exists.';
       }
    		if (err) {
    			req.flash('error', err);
    			return res.redirect('/reg');
    		}

    		UserEntity.save(function(err) {
    			if (err) {
    				req.flash('error', err);
    				return res.redirect('/reg');
    			}
    			req.session.user = UserEntity;
    			req.flash('success', '注册成功');
    			res.redirect('/');
    		});
    	});
    });
/* //router.get("/reg",checkNotLogin);
router.get('/reg', function(req, res) {
    res.render('reg', { title: '用户注册' });
});

//router.post("/reg",checkNotLogin);
router.post('/reg', function(req, res) {
  //检查用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error','两次输入密码口令不一致');
    console.log("Session: ", req.session);
    return res.redirect('/reg');
  }
  //生成口令的离散值
//  var md5 = crypto.createHash('md5');
  //var password = md5.update(req.body.password).digest('base64');

  var UserEntity = new UserModel({
    name: req.body.username,
    password: req.body.password
  });

  //检查用户名是否已经存在
  UserModel.findOne({'name':UserEntity.name}, function(err, user) {
		if (user){
			err = 'Username already exists.';
   }
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}

		UserEntity.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = UserEntity;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
});*/

//router.get("/login",checkNotLogin);
router.get('/login', function(req, res) {
  res.render("login",{
		title:"用户登入",
	});
});

//router.post("/login",checkNotLogin);
router.post('/login', function(req, res) {
//  var md5 = crypto.createHash('md5');
//	var password = md5.update(req.body.password).digest('base64');
  var password = req.body.password;

	UserModel.findOne({'name':req.body.username}, function(err, user) {
		if (!user) {    //返回值为用户数据?
			req.flash('error', '用户不存在');
			return res.redirect('/login');
		}
		if (user.password != password) {
			req.flash('error', '用户口令错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登入成功');
		res.redirect('/');
	});
});

//router.get("/logout",checkLogin);  //作用？
router.get("/logout",function(req,res) {
	req.session.user = null;
	req.flash('success', '登出成功');
	res.redirect('/');
});

function checkLogin(req,res,next) {
  if (!req.session.user) {
    req.flash('error','未登录');
    return res.redirect('/login');
  }
  console.log('checkLogin: already login');
  next();
}
function checkNotLogin(req,res,next) { //(req,res,next,nextt)
  if (req.session.user) {
    req.flash('error','已登入');
    return res.redirect('/');
  }
  console.log('checkNotLogin: not login');
  next();
}

router.post('/post',checkLogin);
router.post('/post', function(req, res) {
  var currentUser = req.session.user;

  var PostEntity = new PostModel ({
    user:currentUser.name,
    post:req.body.post,
    time:new Date()
  });
  //var PostEntity = new PostModel (currentUser.name,req.body.post,new Date());
  PostEntity.save(function(err) {
    if(err) {
      req.flash('error',err);
      return res.redirect('/');
    }
    req.flash('success','发表成功');
    res.redirect('/u/'+currentUser.name);
  });
});

router.get('/u/:user', function(req, res) {
  console.log(req.url);
  UserModel.findOne({'name':req.params.user}, function(err,user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    PostModel.find({'user':req.params.user}, function(err, posts) {
      //console.log(req.params.user)
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: posts,
      });
    });
  });

});

module.exports = router;
