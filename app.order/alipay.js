const config = require('../config');
var crypto = require('crypto');
var request = require('request');

exports.build = function (name, price, orderid, userid, keeperid) {

    let content = {
        subject:name, 
        out_trade_no:orderid, 
        total_amount:price,
        buyer_id:userid,
        seller_id:keeperid,
        product_code: 'QUICK_MSECURITY_PAY'
    };

    let params = new Map();
    params.set('app_id', config.ALIPAY.app_id);
    params.set('method', 'alipay.trade.wap.pay');
    params.set('charset', 'utf-8');
    params.set('sign_type', 'RSA2');
    params.set('timestamp', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    params.set('version', '1.0');
    params.set('notify_url', config.ALIPAY.notify_url);
    params.set('biz_content', JSON.stringify(content));

    return params;

}

exports.sign = async function (params) {
    let p = [...params].filter(([k, v]) => k !== 'sign' && v);
    p.sort();
    let str = p.map(([k, v]) => `${k}=${v}`).join('&');

    let sign = await crypto.createSign('RSA-SHA256').update(str).sign(config.ALIPAY.key, 'base64');
    params.set('sign', sign);
    let result = [...params].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return result;
}

exports.extract = function (body) {
    let params = new Map();
    for (let key in body) {
        if(key !== 'sign' && key !== 'sign_type' && req.body[key])
            params.set(key, req.body[key]);
    }
    params.sort();
    let str = params.map(([k, v]) => `${k}=${decodeURIComponent(v)}`).join('&');
    return str;
}

exports.verify = function (str, sign) {
    return crypto.createSign('RSA-SHA256').update(str).verify(config.ALIPAY.pub_key, sign, 'base64');
}

exports.pay = async (signature) => {
    new Promise((resolve, reject) => {
        request.get({
            url: config.ALIPAY.host+'?'+signature
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //res.send({ code: 'OK', msg: 'pay start', data: null });
                resolve(body);
            }else{
                reject(error);
                console.log(new Date().toISOString(), err);
            }
        })
    });
}