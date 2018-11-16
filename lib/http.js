const request = require('request');
const config = require('../config');

exports.upload = async (value) => 
    new Promise((resolve, reject) => {
        request.post({
            url: config.MEDIA_HOST.URL+'upload',
            method: "POST",
            json: {pic:value}
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.code == 'OK') {
                    if(resolve)resolve(config.MEDIA_HOST.URL+body.msg);
                }else {
                    if(reject)reject(body);
                    console.log(day.full(),body);
                }
            }else{
                if(reject)reject(error);
                console.log(day.full(),error);
            }
        });
    })