var cron = require('cron');
var request = require('request');
var config = require('../config');

var post = (url, data ) => {
    return new Promise((resolve, reject) => {
        request.put({
            url: url,
			method: "PUT",
			headers: {
				'Authorization': 'sso-key dLiW2LiCuS5M_CxHUBAvhV8r7ioFCUA3FjX:CxHa9fe1z69uxFcSsfqa3b',
				'Content-Type': 'application/json',
			},
            json: data
        }, (error, response, body) => {
			console.log(new Date().toISOString(), response.statusCode, JSON.stringify(data), JSON.stringify(body));
            if (!error && response.statusCode == 200) {
                resolve(body);
            }else{
                reject(error);
            }
        })
    });
}
var get = (url ) => {
    return new Promise((resolve, reject) => {
        request.get({
			url: url,
			headers: {
				'Authorization': 'sso-key dLiW2LiCuS5M_CxHUBAvhV8r7ioFCUA3FjX:CxHa9fe1z69uxFcSsfqa3b',
				'Content-Type': 'application/json',
			},
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }else{
				console.log(new Date().toISOString(), error);
				console.log(new Date().toISOString(), body);
                reject(error);
            }
		})
    });
}

//var cronJob = cron.job("0 */10 * * * *", function(){
    // perform operation e.g. GET request http.get() etc.
async function  func() {
	try{
		const myip = await get('http://api.ipify.org', {});//https://httpbin.org/ip
		const r1 = await post('https://api.godaddy.com/v1/domains/51tui.co/records/A',
			[
				{
				"data": myip,
				"name": "@",
				"ttl": 601,
				"type": "A",
				}
			]
		);
		const r3 = await get('https://api.godaddy.com//v1/abuse/tickets'
		);
		console.log("r3",r3);
		const r2 = await post('https://api.godaddy.com/v1/domains/51tui.co/records/CNAME',
			[
			  {
				"name": "file",
				"data": "51tui.co:"+config.MEDIA_HOST.PORT,
				"ttl": 602,
				"type": "CNAME",
			  },
			  {
				"name": "app",
				"data": "51tui.co:"+config.APP_HOST.PORT,
				"ttl": 602,
				"type": "A",
			  }
			]
		);
		
		// const r2 = await post('https://api.godaddy.com/v1/domains/51tui.co/records/SRV',
		// 	[
		// 	  {
		// 		"data": "file.51tui.co",
		// 		"name": "_media",
		// 		"port": parseInt(config.MEDIA_HOST.PORT),
		// 		"priority": 1,
		// 		"protocol": "_http",
		// 		"service": "_file",
		// 		"ttl": 601,
		// 		"type": "SRV",
		// 		"weight": 1
		// 	  },
		// 	  {
		// 		"data": "www.51tui.co",
		// 		"name": "_app",
		// 		"port": parseInt(config.APP_HOST.PORT),
		// 		"priority": 1,
		// 		"protocol": "_http",
		// 		"service": "_app",
		// 		"ttl": 601,
		// 		"type": "SRV",
		// 		"weight": 1
		// 	  }
		// 	]
		// );
		// const r2 = await post('https://api.godaddy.com/v1/domains/51tui.co/records/SRV/_app._http._server',
		// 	[
		// 	  {
		// 		"data": myip,
		// 		"name": "_app",
		// 		"port": config.APP_HOST.PORT,
		// 		"priority": 1,
		// 		"protocol": "_http",
		// 		"service": "_app",
		// 		"ttl": 601,
		// 		"type": "SRV",
		// 		"weight": 1
		// 	  }
		// 	]
		// );
		console.log(new Date().toISOString(), r1);
	}catch(err){
		console.log(err);
	}
    console.info('cron job completed');
}
func();
//}); 
//cronJob.start();