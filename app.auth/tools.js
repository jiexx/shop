var request = require('request');
var fs = require("fs");
var multer = require('multer'); // v1.0.5
var upload = multer({ dest: 'uploads/' });
var bodyParser = require('body-parser');
var Promise = require('promise');

var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  };

//   walk(process.argv[2], function(err, results) {
//     if (err) throw err;
//     console.log('walk', results);
//   });

function readFiles(dirname, onFileContent, onError, onFinish) {
    walk(dirname, function(err, filenames) {
        console.log('walk', filenames);
        if (err) {
            onError(err);
            return;
        }
        var n = filenames.length;
        filenames.forEach(function(filename) {
            fs.readFile(filename, 'utf-8', function(err, content) {
                n--;
                if (err) {
                    //console.log('---------2',dirname + filename);
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
                
                console.log('n', n);
                if(n === 0 && onFinish) {
                    onFinish();
                }
            });
        });
    });
}

var json = {};

function listToJson(list) {
    for(var i =0 ; i < list.length; i ++) {
        var a = list[i].split('|');
        var head = json;
        // for(var j = 0; j< a.length; j++) {
        //     if( typeof  head[a[j]+'子栏目'] !== 'object'){
        //         head[a[j]+'子栏目'] = {};
        //         head[a[j]] = true;
        //     }
        //     head = head[a[j]+'子栏目'];
        // }
        for(var j = 0; j< a.length; j++) {
            if( typeof  head[a[j]] !== 'object'){
                head[a[j]] = {};
            }
            head = head[a[j]];
        }
    }
    console.log("listToJson!!!!!!!!!!!!!!!!!",json);

    jsonClear(json);

    console.log("listToJson!!!!!!!!!!!!!!!!!",json);

    var str = '$.DEFAULTAUTH = '+JSON.stringify(json)+';';
    fs.writeFileSync('../lib/defaultAuth.js', str);
	var str2 = 'var permits = '+JSON.stringify(json)+'; module.exports = permits;';
	fs.writeFileSync('../workflow/defaultAuth.js', str2);
}

function jsonClear(json) {
    for(var i in json) {
        if( typeof json[i] === 'object'&& Object.keys(json[i]).length === 0 ) {
            console.log("json[i]",json[i]);
            //delete json[i];
            json[i] = true;
            continue ;
        }
        if( typeof json[i] === 'object'){
            jsonClear(json[i])
        }
    }
}


var list = {};

readFiles(process.argv[2], function(filename, content) {
     console.log('filename',filename);

    var re = /data-permit=["|'](.*^\s)["|']/g;
    var m;

    do {
        m = re.exec(content);
        if (m) {
            console.log(m[1]);
            list[m[1]] = 1;
        }
    } while (m);

    // console.log('list',list);

}, function(err) {
    console.log("modal ERROR!",err);
}, function() {
    // console.log('-----------------------',list);
    var a = [];
    for(var i in list) {
        a.push(i);
    }
    console.log(a);
    listToJson(a);
});

