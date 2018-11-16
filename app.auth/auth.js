var data = require('../app.data/data');
var crypto = require('crypto');

var cacheManager = require('cache-manager');
// storage for the cachemanager
var fsStore = require('cache-manager-fs');
// initialize caching on disk
var cache = cacheManager.caching({ store: fsStore, options: { ttl: 60 * 60 /* seconds */, maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */, path: 'diskcache', preventfill: true } });
var config = require('../config')
const captcha = require('trek-captcha');

var Auth = /** @class */ (function () {
	function Auth() {
	}
	Auth.prototype.enPassword = function () {
		var pwd = crypto.randomBytes(2).toString('hex');
		console.log('new customer SMS password: '+pwd);
        var md5 = crypto.createHash('md5').update(pwd).digest('hex');
        return md5;
    };
	Auth.prototype.$$checkin = async function (req, res, web) {
		var mobile = req.body.username;
		if(!mobile) {
			res.send({ code: 'ERR', msg: '手机号空', data: 'username' });
			return;
		}
		if(!mobile.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
			res.send({ code: 'ERR', msg: '非手机号', data: 'username' });
			return;
		}
		if( !req.user.TEL ) {
			res.send({ code: 'ERR', msg: '终端未注册, 请先注册', data: 'username' });
		}else if( req.user.TEL != mobile && req.user.USERNAME != mobile ){
			res.send({ code: 'ERR', msg: '终端已注册,请输正确账号', data: 'username' });
		}else if( req.user.STATE == 'REG' ){
			res.send({ code: 'ERR', msg: '未完成注册, 请注册', data: 'username' });
		}else if( req.user.STATE == 'LOGIN' ){
			res.send({ code: 'OK', msg: null, data:  {nick:req.user.NICKNAME, avatar:req.user.AVATAR?req.user.AVATAR:config.ANONYMOUS_AVATAR } });
		}else {
			try{
				const r = await data.userdb.update('users', { STATE:'LOGIN' }, {ID: req.user.ID});
				if (r.affectedRows == 1) {
					res.send({ code: 'OK', msg: null, data:  {nick:req.user.NICKNAME, avatar:req.user.AVATAR?req.user.AVATAR:config.ANONYMOUS_AVATAR } });
				}else {
					res.send({ code: 'ERR', msg: 'login', data: 'password' });
				}
			}catch(err){
				console.log(err);
				res.send({ code: 'ERR', msg: 'update', data: null });
			}
		}
	}
	Auth.prototype.$$registe = async function (req, res, web) {
		var mobile = req.body.username;
		const r = await captcha({ size: 5, style: 0 });
		var password = crypto.createHash('md5').update(r.token).digest('hex') ;
		if(!mobile) {
			res.send({ code: 'ERR', msg: '手机号空', data: 'username' });
			return;
		}
		if(!mobile.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
			res.send({ code: 'ERR', msg: '非手机号', data: 'username' });
			return;
		}
		if( req.user.TEL && req.user.STATE != 'REG'){
			res.send({ code: 'ERR', msg: '终端已注册,请输账号', data: 'username' });
			return;
		}
		try{
			const user = await data.userdb.update('users', { TEL: mobile, USERPWD: password, STATE:'REG' }, {ID: req.user.ID});
			if (user.affectedRows == 1) {
				let base64 = 'data:image/png;base64, '+new Buffer(r.buffer).toString('base64');
				res.send({ code: 'OK', msg: base64, data: null });
			}else {
				res.send({ code: 'ERR', msg: 'update', data: null });
			}
		}catch(err){
			console.log(err);
			res.send({ code: 'ERR', msg: 'update', data: null });
		}
	};
	Auth.prototype.$$login = async function (req, res, web) {
		var mobile = req.body.username;
		var password = crypto.createHash('md5').update(req.body.password).digest('hex') ;
		if(!mobile) {
			res.send({ code: 'ERR', msg: '手机号空', data: 'username' });
			return;
		}
		if(!mobile.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
			res.send({ code: 'ERR', msg: '非手机号', data: 'username' });
			return;
		}
		if(!password){
			res.send({ code: 'ERR', msg: '密码空', data: 'password' });
			return;
		}
		if( req.user.USERPWD != password ) {
			res.send({ code: 'ERR', msg: '密码错', data: 'password' });
			return;
		}
		try{
			const r = await data.userdb.update('users', { STATE:'LOGIN' }, {ID: req.user.ID});
			if (r.affectedRows == 1) {
				res.send({ code: 'OK', msg: null, data:  {nick:req.user.NICKNAME, avatar:req.user.AVATAR?req.user.AVATAR:config.ANONYMOUS_AVATAR } });
			}else {
				res.send({ code: 'ERR', msg: 'login', data: 'password' });
			}
			//res.cookie('token', token);
		}catch(err){
			console.log(err);
			res.send({ code: 'ERR', msg: 'update', data: null });
		}
	};
	Auth.prototype.$$logout = async function (req, res, web) {
		try{
			const r = await data.userdb.update('users', { STATE:'LOGOUT' }, {ID: req.user.ID});
			if (r.affectedRows == 1) {
				res.send({ code: 'OK', msg: null, data: null });
			}else {
				res.send({ code: 'ERR', msg: 'logout', data: null });
			}
			//res.cookie('token', token);
		}catch(err){
			console.log(err);
			res.send({ code: 'ERR', msg: 'update', data: null });
		}
	};
	Auth.prototype.$secret = async function (req, res, web) {
		try{
			const user = await data.userdb.insert('users', {});
			if (user.affectedRows == 1) {
				var token = web.sign(user.uuid);
				//res.cookie('token', token);
				res.send({ code: 'OK', msg: token, data: null });
			}else {
				res.send({ code: 'ERR', msg: 'add', data: null });
			}
		}catch(err){
			console.log(err);
			res.send({ code: 'ERR', msg: 'add', data: null });
		}
	};
	return Auth;
}());
module.exports = Auth;