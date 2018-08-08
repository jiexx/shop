var request = require('request');
var traverse = require('traverse');
var Promise = require('promise');
var data = require('../app.data/data');
var crypto = require('crypto');

var cacheManager = require('cache-manager');
// storage for the cachemanager
var fsStore = require('cache-manager-fs');
// initialize caching on disk
var cache = cacheManager.caching({store: fsStore, options: {ttl: 60*60 /* seconds */, maxsize: 1000*1000*1000 /* max size in bytes on disk */, path:'diskcache', preventfill:true}});


var Auth = /** @class */ (function () {
    function Auth() {
	}
	Auth.prototype.$registe = function (req, res) {
		var mobile = req.query.mobile;
		var pwd = req.query.pwd;
		var captha = req.query.captha;
		if(!mobile) {
			var result = { code: 'ERR', msg: '输入手机号空', data: null };
			res.send(JSON.stringify(result));
		}else {
			data.$db.select({mobile:mobile})
			.then(function(result){
				if(result && result.mobile) {
					var result = { code: 'ERR', msg: '手机号已使用', data: null };
					res.send(JSON.stringify(result));
				}else if(!pwd){
					var result = { code: 'ERR', msg: '密码空', data: null };
					res.send(JSON.stringify(result));
				}else if(!captha){
					var result = { code: 'ERR', msg: '验证码空', data: null };
					res.send(JSON.stringify(result));
				}else {
					cache.get(mobile, function(err, result) {
						if(result != captha) {
							var result = { code: 'ERR', msg: '验证码错误', data: null };
							res.send(JSON.stringify(result));
						}else{
							data.$db.insert({mobile:mobile,password:pwd})
							.then(function(result){
								var result = { code: 'OK', msg: 'SUCCESS', data: null };
								res.send(JSON.stringify(result));
							});
						}
					});
				}
			})
		}
	}
	Auth.prototype.$verify = function (req, res) {
		data.$db.select({mobile:mobile})
		.then(function(result){
			var token = crypto.randomBytes(4).toString('hex');
			cache.set(mobile, token, {ttl: 120}, function(err) {
				if (err) { throw err; };
				sms();
				var result = { code: 'INFO', msg: '请输入验证码', data: token };
				res.send(JSON.stringify(result));
			});
		});
	}
    Auth.prototype.$login = function (req, res) {
        var name = req.query.username;
        var pwd = req.query.userpwd;
		request('http://localhost:8999/wuser/login?username=' + name + '&userpwd=' + pwd + '&version=2', function (error, response, body) {
			var result = { code: 'OK', msg: '', data: null };
			if (!error && response.statusCode == 200) {
				var o = JSON.parse(response.body);
				if (Object.prototype.toString.call(o.user) === '[object Array]') {
					//用户名不存在
					result.code = 'ERR';
					result.msg = '该用户名不存在';
					res.send(JSON.stringify(result));
				}else {
					if (Object.prototype.toString.call(o.userpwd) === '[object Array]') {
						//用户密码错
						result.code = 'ERR';
						result.msg = '用户密码错';
						res.send(JSON.stringify(result));
					}
					else {
						//正确
						var leaves = traverse(o.user.PERMISSION).reduce(function (acc, x) {
							if (this.isLeaf) {
								var parent = this.parent;
								while (parent) {
									var path = parent.path.join('|');
									if (acc[path] === undefined) {
										acc[path] = x;
									}
									else if (acc[path] === true) {
										if (x === true) {
											acc[path] = true;
										}
									}
									else if (acc[path] === false) {
										if (x === true) {
											acc[path] = true;
										}
									}
									parent = parent.parent;
								}
								acc[this.path.join('|')] = x;
							}
							return acc;
						}, {});
						result.code = 'OK';
						result.msg = '登录成功';
						result.data = leaves;
						res.send(JSON.stringify(result));
					}
				}
			}
		});
    };
    return Auth;
}());
module.exports = Auth;