var data = require('../app.data/data');
var config = require('../config');
var ejs = require('ejs');
var fs = require('fs');


var Template = /** @class */ (function () {
	function Template() {
		this.tplPoster = fs.readFileSync('./app.template/poster.html', 'utf-8');
	}
	Template.prototype.$poster = function (req, res) {
		if(this.tplPoster) {
			//let posterid = shortid.generate();
			let d = {DOMAIN: config.DOMAIN, APPDOMAIN: config.APP_DOMAIN, PRODUCTNAME: req.body.NAME, TITLE: req.body.TITLE, EXP:req.body.EXP, PRICE:req.body.PRICE, PRODUCTID:req.body.PRODUCTID}
			res.send({ code: 'OK', msg: '', data: ejs.render(this.tplPoster, d) });
		}else {
			res.send({ code: 'ERR', msg: 'ejs', data: '' });
		}
	}
	Template.prototype.$$share = async function (req, res) {
		var shareid = req.body.shareid;
		try {
			var newSharedId = await data.graph.share(req.user, shareid);
			if(!newSharedId){
				res.send({ code: 'ERR', msg: 'share repeated', data: '' });
			}else {
				res.send({ code: 'OK', msg: config.MEDIA_HOST.URL+newSharedId, data: '' });
			}
		} catch (error) {
			// Runs if user.profile() rejects
			return res.status(500, {error})
		}
	}
	Template.prototype.$$avatar = function (req, res) {
		res.send({ code: 'OK', msg: 'avatar', data: {avatar:req.body.user.AVATAR,username:req.body.user.USERNAME} });
	}
	return Template;
}());
module.exports = Template;