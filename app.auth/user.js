var data = require('../app.data/data');
const http = require('../lib/http');


var User = /** @class */ (function () {
	function User() {
	}
	User.prototype.$$changeAvatar = async function (req, res, web) {
		if(!req.body.avatar) {
			res.send({ code: 'ERR', msg: '空图片', data: null });
			return;
		}
		try{
			const fd = await http.upload(req.body.avatar);
			const user = await data.userdb.update('users', {AVATAR:fd}, {ID:req.user.ID});
			if (user.affectedRows == 1) {
				res.send({ code: 'OK', msg: 'avatar', data: null });
			}else {
				res.send({ code: 'ERR', msg: 'add', data: null });
			}
		}catch(err){
			console.log(err);
			res.send({ code: 'ERR', msg: 'upload', data: null });
		}
	};
	User.prototype.$$profile = async function (req, res, web) {
		res.send({ code: 'OK', msg: 'profile', data: req.user });
	};
	User.prototype.$$changeMobile = async function (req, res, web) {
		let mobile1 = req.body.mobile1;
		let mobile2 = req.body.mobile2;
		if(!mobile1) {
			res.send({ code: 'ERR', msg: '手机空', data: 'mobile1' });
			return;
		} 
		if(!mobile2) {
			res.send({ code: 'ERR', msg: '手机空', data: 'mobile2' });
			return;
		}
		if(mobile1 != mobile2) {
			res.send({ code: 'ERR', msg: '手机号不相同', data: 'mobile2' });
			return;
		}
		if(!mobile1.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
			res.send({ code: 'ERR', msg: '非手机号', data: 'mobile1' });
			return;
		}
		if(!mobile2.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
			res.send({ code: 'ERR', msg: '非手机号', data: 'mobile2' });
			return;
		}
		
		try{
			const user = await data.userdb.select('users', {TEL:mobile1});
			if (user.length > 1) {
				res.send({ code: 'ERR', msg: '手机号已注册', data: 'mobile1' });
				return;
			}
			const r = await data.userdb.update('users', {TEL:mobile1}, {ID:req.user.ID});
			if (r.affectedRows == 1) {
				res.send({ code: 'OK', msg: 'mobile', data: null });
			}else {
				res.send({ code: 'ERR', msg: 'mobile', data: null });
			}
		}catch(err){
			console.log(err);
			res.send({ code: 'ERR', msg: 'mobile', data: null });
		}
	};
	User.prototype.$$changeProfile = async function (req, res, web) {
		res.send({ code: 'OK', msg: 'profile', data: req.user });
	};
	return User;
}());
module.exports = User;