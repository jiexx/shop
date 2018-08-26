var request = require('request');
var traverse = require('traverse');
var Promise = require('promise');
var data = require('../app.data/data');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var cacheManager = require('cache-manager');
// storage for the cachemanager
var fsStore = require('cache-manager-fs');
// initialize caching on disk
var cache = cacheManager.caching({ store: fsStore, options: { ttl: 60 * 60 /* seconds */, maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */, path: 'diskcache', preventfill: true } });


var Auth = /** @class */ (function () {
	function Auth() {
		passport.use('local-login',this.localLogin());
		passport.use('local-signup',this.localSignup());
		//passport serialize user for their session
		passport.serializeUser(function(user, done) {
			done(null, user.id);
		});
		//passport deserialize user 
		passport.deserializeUser(function(id, done) {
			data.userdb.select('users',{ID:id})
			.then((rows)=>{
				done(null, rows[0]);
			})
			.catch((err) =>{
				done(err);
			});
		});
	}
	Auth.prototype.$registe = function (req, res) {
		var mobile = req.query.mobile;
		var pwd = req.query.pwd;
		var captha = req.query.captha;
		if (!mobile) {
			var result = { code: 'ERR', msg: '输入手机号空', data: null };
			res.send(JSON.stringify(result));
		} else {
			data.$db.select({ mobile: mobile })
				.then(function (result) {
					if (result && result.mobile) {
						var result = { code: 'ERR', msg: '手机号已使用', data: null };
						res.send(JSON.stringify(result));
					} else if (!pwd) {
						var result = { code: 'ERR', msg: '密码空', data: null };
						res.send(JSON.stringify(result));
					} else if (!captha) {
						var result = { code: 'ERR', msg: '验证码空', data: null };
						res.send(JSON.stringify(result));
					} else {
						cache.get(mobile, function (err, result) {
							if (result != captha) {
								var result = { code: 'ERR', msg: '验证码错误', data: null };
								res.send(JSON.stringify(result));
							} else {
								data.$db.insert({ mobile: mobile, password: pwd })
									.then(function (result) {
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
		data.$db.select({ mobile: mobile })
			.then(function (result) {
				var token = crypto.randomBytes(4).toString('hex');
				cache.set(mobile, token, { ttl: 120 }, function (err) {
					if (err) { throw err; };
					sms();
					var result = { code: 'INFO', msg: '请输入验证码', data: token };
					res.send(JSON.stringify(result));
				});
			});
	}
	Auth.prototype.$login = function (req, res) {
		if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
		} else {
			req.session.cookie.expires = false;
		}
		res.send(req.data);
	};
	Auth.prototype.localLogin = function () {
		return new LocalStrategy(function(username, password, done) {
			data.userdb.select('users',{USERNAME:username})
			.then((rows)=>{
				if(!rows){
					done(null, false, { code: 'ERR', msg: '用户名不存在', data: null });
				}else if(rows[0].password != password){
					return done(null, false, { code: 'ERR', msg: '密码错', data: null });
				}
				return done(null, { code: 'OK', msg: '', data: rows[0] }); 
			})
			.catch((err) =>{
				done(err);
			});
		});
	};
	Auth.prototype.localSignup = function () {
		return new LocalStrategy(function(username, password, done) {
			data.userdb.select('users',{USERNAME:username})
			.then((rows)=>{
				if(!rows){
					data.userdb.insert('users',{USERNAME:username})
					.then((rows)=>{
						if(rows.affectedRows == 1) {
							return done(null, { code: 'OK', msg: '', data: rows[0] });
						}
					}).catch((err) =>{
						done(err);
					});
				}
				return done(null, false, { code: 'ERR', msg: '用户已存在', data: null });
			})
			.catch((err) =>{
				done(err);
			});
		});
	};
	return Auth;
}());
module.exports = Auth;