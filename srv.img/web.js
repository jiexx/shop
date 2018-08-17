var express = require('express');
var compression= require('compression');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer({ dest: 'uploads/' }); 
//var iconv = require('iconv-lite');
var app = express();
var fs = require("fs");
const sharp = require('sharp');
var config = require('../config');
var day = require('../lib/day');
var base64 = require('../lib/base64');
const uuidv4 = require('uuid/v4');
var mkdirp = require('mkdirp');

app.use(compression());
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/lib', express.static(__dirname + '/lib'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', upload.array(), function (req, res) {
    var data = req.body;
    var imageBuffer = base64.decode(data.pic);
    var fd = uuidv4();
    fs.writeFile(config.IMG_HOST_DIR+'/'+fd, imageBuffer.data, function(err,written){
        if(!err){
            res.json({ code: 'OK', msg: fd, data: null });
            console.log(day.full(), 'OK', fd);
        }else {
            res.json({ code: 'ERR', msg: '写失败', data: null });
            console.log(day.full(), err);
        }
    });

});

app.get('/:img', upload.array(), function (req, res) {

    var img = config.IMG_HOST_DIR+'/'+req.params.img;
    if(!fs.existsSync(img)){
        var matches = img.match(/^([^_]+)_([^x]+)x(.+)$/);
        if (!matches || matches.length !== 4 || !fs.existsSync(matches[1])) {
            res.json({ code: 'ERR', msg: '文件不存在', data: null });
        }else {
            var w = parseInt(matches[2]), h = parseInt(matches[3]);
            sharp(matches[1]).resize(w, h)
            .toFile(img, (err, info) => {
                if(!err){
                    res.header("Content-Type", "image/gif");
                    res.sendFile(img,{ root: __dirname });
                }else{
                    res.json({ code: 'ERR', msg: '文件不存在', data: null });
                }
            });
        }
    }else{
        res.header("Content-Type", "image/gif");
        res.sendFile(img,{ root: __dirname });
    }
});



var server = app.listen(config.IMG_HOST_PORT, function() {
	mkdirp(config.IMG_HOST_DIR, function(err) { 
        console.log(day.full(),' DIR ERR', err);
    });
	var host = server.address().address;
	var port = server.address().port;
	console.log(day.full(),' RUNNING http://%s:%s', host, port);
});
server.on('error', function(err) { 
	console.log(day.full(),' SERVER IMG ERR:  '+err);
});
process.on('uncaughtException', function(err) {
    console.log(day.full(),' SERVER IMG Exception:'+err);
});
process.on('SIGINT', function() {
    console.log(day.full(),' SERVER IMG EXIT!');
	process.exit()
});
