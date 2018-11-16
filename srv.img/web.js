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
var file = require('../lib/file');
//const uuidv4 = require('uuid/v4');
var mkdirp = require('mkdirp');


const gremlin = require('gremlin');
const Graph = gremlin.structure.Graph;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const graph = new Graph();
const g = graph.traversal().withRemote(new DriverRemoteConnection(config.GDB));
const __ = gremlin.process.statics;

app.use(compression());
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/poster', express.static(__dirname + '/poster'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.post('/upload', upload.array(), function (req, res) {
    
    var imageBuffer = base64.decode(req.body.pic);
    var desc = file.makeFileDesc(imageBuffer.type);

    fs.writeFile(desc.path, imageBuffer.data, function(err,written){
        if(!err){
            res.json({ code: 'OK', msg: desc.fd, data: null });
            console.log(day.full(), 'OK upload', desc.fd);
        }else {
            res.json({ code: 'ERR', msg: '写失败', data: null });
            console.log(day.full(), err);
        }
    });
});

app.get(/^\/([^\/]+).*/, upload.array(), async function (req, res) {
    var fd = req.params[0];
    //var token = req.params.token;
    var desc = file.extractFileDesc(fd);
    if(desc.type.indexOf('image') > -1){
        if(!fs.existsSync(desc.path)){
            var matches = fd.match(/^([^_]+)_([^x]+)x(.+)$/);
            if (!matches || matches.length !== 4 || !fs.existsSync(matches[1])) {
                res.json({ code: 'ERR', msg: '文件不存在', data: null });
            }else {
                var w = parseInt(matches[2]), h = parseInt(matches[3]);
                sharp(matches[1]).resize(w, h)
                .toFile(desc.path, (err, info) => {
                    if(!err){
                        res.header("Content-Type", "image/gif");
                        res.sendFile(desc.path,{ root: __dirname });
                    }else{
                        res.json({ code: 'ERR', msg: '文件不存在', data: null });
                    }
                });
            }
        }else{
            res.header("Content-Type", "image/gif");
            res.sendFile(desc.path,{ root: __dirname });
        }
    }else if(desc.type.indexOf('text') > -1){
        if(!fs.existsSync(desc.path)){
            res.json({ code: 'ERR', msg: '文件不存在', data: null });
        }else{
            res.header('Content-Type', 'text/html');
            res.sendFile(desc.path,{ root: __dirname });
        }
    }else if(desc.type.indexOf('share') > -1){
        try {
            var result = await g.E().hasLabel(fd).inV().repeat(__.in_()).until(__.has('posterid')).values('posterid').next();
            if(result && result.value){
                desc = file.extractFileDesc(result.value);
                if(!fs.existsSync(desc.path)){
                    res.json({ code: 'ERR', msg: '文件不存在', data: null });
                }else{
                    res.header('Content-Type', 'text/html');
                    res.sendFile(desc.path,{ root: __dirname });
                }
            }else {
                res.json({ code: 'ERR', msg: 'shareid', data: null });
            }
        } catch (error) {
            // Runs if user.profile() rejects
            return res.status(500, {error})
        }
    }
    
});


var server = app.listen(config.MEDIA_HOST.PORT, function() {
    var dirs = config.MEDIA_HOST.DIRS;
    for(var key in dirs) {
        var dir = dirs[key];
        mkdirp(dir.PATH, function(err) { 
            console.log(day.full(),' DIR ERR', err);
        });
    }
    
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
