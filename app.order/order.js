var data = require('../app.data/data');
const config = require('../config');
var ejs = require('ejs');
var fs = require('fs');
const uuidv4 = require('uuid/v4');
var alipay = require('./alipay');

var Order = /** @class */ (function () {
	function Order() {
		this.tplOrder = fs.readFileSync('./app.order/order.html', 'utf-8');
		this.tplError = fs.readFileSync('./app.order/error.html', 'utf-8');
		this.tplConfirm = fs.readFileSync('./app.order/confirm.html', 'utf-8');
	}
	Order.prototype.isValidPoster = function(exp){
		var matches = exp.match(/^([^,]+),(.+)$/);
		if (matches && matches.length == 3 ) {
			var d1 = Date.now();
			var d2 = new Date(matches[1]);
			var d3 = new Date(matches[2]);
			if(d1 < d3 && d1 > d2) {
				return true;
			}
			return false
		}
	}
	Order.prototype.$$start = async function (req, res, web) {
		res.header('Content-Type', 'text/html');
		const shareid = req.body.shareid;
		if(!shareid){
			res.send(ejs.render(this.tplError, { code: 'ERR', msg: 'share ID不存在', data: null, DOMAIN:config.DOMAIN }));
			return;
		}
		const productid = req.body.productid;
		if(!productid){
			res.send(ejs.render(this.tplError, { code: 'ERR', msg: '商品ID不存在', data: null, DOMAIN:config.DOMAIN }));
			return;
		}
		if(req.user.STATE != 'LOGIN') {
			let url = config.APP_DOMAIN+'?requesturl='+config.MEDIA_HOST.URL+shareid;
			res.send(ejs.render(this.tplError, { code: 'LOGIN', msg: '未登录', data: url, DOMAIN:config.DOMAIN }));
			return;
		}
		
		
		try{
			const posterid = await data.graph.getPosterId(shareid);
			if(!posterid){
				res.send(ejs.render(this.tplError, { code: 'ERR', msg: '海报ID不存在', data: '', DOMAIN:config.DOMAIN }));
				return;
			}
			const poster = await data.productdb.select('poster', {FD:posterid});
			if (poster.length != 1) {
				res.send(ejs.render(this.tplError, { code: 'ERR', msg: '海报不存在', data: '', DOMAIN:config.DOMAIN }));
				return;
			}
			// if(!this.isValidPoster(poster[0]['EXP'])) {
			// 	res.send(ejs.render(this.tplError, { code: 'ERR', msg: '销售过期', data: '', DOMAIN:config.DOMAIN }));
			// 	return;
			// }
			const product = await data.productdb.select('item', {ID:productid});
			if (product.length != 1) {
				res.send(ejs.render(this.tplError, { code: 'ERR', msg: '商品不存在', data: '', DOMAIN:config.DOMAIN }));
				return;
			}
			const d = await this.create(req.user.ID, poster[0].KEEPERID, posterid, product[0].ID, product[0].PRICE, poster[0].TITLE, poster[0].NAME ); 
			if(d) {
				res.send(ejs.render(this.tplOrder, d));
			}else {
				res.send(ejs.render(this.tplError, { code: 'ERR', msg: '订单创建失败', data: '', DOMAIN:config.DOMAIN }));
			}
		}catch(err){
			console.log(err);
			res.send(ejs.render(this.tplError, { code: 'ERR', msg: '订单启动失败', data: '', DOMAIN:config.DOMAIN }));
		}
	}
	Order.prototype.create = async function (customerid, keeperid, posterid, productid, price, title, name,) {
		const state = '待支付';
		const createtime = ''+Date.now();

		let order = {
			ID: uuidv4(),
			CUSTOMERID:customerid,
			POSTERID:posterid,
			STATE:state,
			AMOUNT:price,
			CREATETIME:createtime
		};
		const result = await data.orderdb.insert('item', order);
		if (result.affectedRows == 1) {
			return {
				DOMAIN: config.DOMAIN,
				AMOUNT: price,
				TITLE: title,
				NAME: name,
				STATE: state,
				CREATETIME: createtime,
				ORDERID: result.uuid,
				POSTERID: posterid,
				CUSTOMERID: customerid,
				KEEPERID: keeperid,
				PRODUCTID: productid,
				CREATETIME: createtime,
			};
		}else {
			return null;
		}
	}
	Order.prototype.finish = async function (orderid) {
		const state = '已支付';
		const result = await data.orderdb.update('item', {STATE:state},{ID:orderid});
		if (result.affectedRows == 1) {
			return {ORDERID: orderid};
		}else {
			return null;
		}
	}
	Order.prototype.$$pay = async function (req, res, web) {
		let name = req.body.NAME;
		let title = req.body.NAME;
		let price = req.body.AMOUNT;
		let orderid = req.body.ORDERID;
		let keeperid = req.body.KEEPERID;
		let userid = req.body.CUSTOMERID;
		let params = alipay.build(name, price, orderid, userid, keeperid);
		
		try{
			const signature = await alipay.sign(params);
			res.send({ code: 'OK', msg: 'pay', data: config.ALIPAY.host+'?'+signature });
		}catch(err){
			res.send(ejs.render(this.tplError, { code: 'ERR', msg: '订单创建失败', data: '', DOMAIN:config.DOMAIN }));
			console.log(err);
		}
	}
	Order.prototype.$callback = async function (req, res) {
		let sign = req.body['sign'];
		let signType = req.body['sign_type'];
		let outTradeNo = req.body['out_trade_no'];
		let tradeStatus = req.body['trade_status'];;

		let str = alipay.extract(req.body);

		if (!alipay.verify(str, sign)) {
			res.send('fail');
			return;
		}
		if (tradeStatus !== 'TRADE_FINISHED' || tradeStatus !== 'TRADE_FINISHED' || tradeStatus !== 'TRADE_FINISHED' || tradeStatus === 'TRADE_CLOSED') {
			res.send('fail');
			return;
		}
		try{
			const result = await this.finish(outTradeNo);
			if (result) {
				res.send('success');
			}else {
				res.send('fail');
			}
		}catch(err){
			res.send('fail');
		}

	};
	return Order;
}());
module.exports = Order;