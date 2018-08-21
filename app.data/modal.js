var mysql = require('mysql');
var config = require('../config');
var day = require('../lib/day');
var FdfsClient = require('fdfs');
var request = require('request');
const uuidv4 = require('uuid/v4');
var base64 = require('../lib/base64');

var fdfs = new FdfsClient({
    // tracker servers
    trackers: [{
        host: config.IMG_HOST,
        // host: '101.37.22.3',//'172.16.36.1',//'10.101.1.165',//'123.59.144.47','10.101.1.165'
        port: config.IMG_HOST_PORT
    }],
    timeout: 10000,
    //defaultExt: 'txt',
    charset: 'utf8'
});

var pool = mysql.createPool({
    host: config.DATA_HOST,
    user: config.DBUSER,
    password: config.DBPWD,
    connectionLimit: 500,
    //	acquireTimeout: 30000,
    queryFormat: function(query, values) {
        //console.log('<-------------------------');
        //console.log(query);
        if (!values) return query;
        var i = 0;
        var q = query.replace(/\?|n\?|#i/g, function(txt, key) {
            if (txt == '?') {
                return "\'" + values[i++] + "\'";
            } else if (txt == 'n?') {
                return values[i++];
            }else if (txt == '#i') {
                return "\'" + uuidv4() + "\'";
            }
            return txt;
        });
        //console.log(q);
        //console.log('------------------------->');
        return q;
    }
});

function doSql(funcArgu, onFinish) {
    pool.getConnection(function(err, conn) {
        if (err) {
            console.log(err);
            onFinish(true);
            return;
        }
        console.log("doSql: " + funcArgu.sql + "   " + JSON.stringify(funcArgu.params));
        conn.query(funcArgu.sql, funcArgu.params, function(err, results) {
            conn.release(); // always put connection back in pool after last query
            //////console.log(JSON.stringify(results));
            if (err) {
                console.log(err);
                console.log(JSON.stringify(funcArgu));
                if (onFinish) {
                    onFinish(true, results);
                }
                return;
            }
            if (onFinish) {
                onFinish(false, results);
            }
        });
    });
};

var uploadImage = function uploadImage(funcArgu, onFinish) {
    if (!funcArgu.base64) {
        onFinish('');
        return;
    }
    if(config.IMG_HOST_FDFS){
        var pic = base64.decode(funcArgu.base64);
        fdfs.upload(pic.data, { ext: 'jpg' }).then(function(fileId) {
            //console.log(fileId);
            if (onFinish) {
                onFinish(fileId);
            }
        }).catch(function(err) {
            console.log(err);
        });
    }else {
        request.post({
            url: config.IMG_URL+'upload',
            method: "POST",
            json: {pic:funcArgu.base64}
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.code == 'OK' && onFinish) {
                    onFinish(config.IMG_URL+body.msg);
                }else {
                    console.log(day.full(),body);
                }
            }else{
                console.log(day.full(),error);
            }
        });
    } 
};

var CallbackLooper = {
    clear: function() {
        for (var i in this.funcArgus) {
            for (var j in this.funcArgus[i]) {
                this.funcArgus[i][j] = null;
            }
            this.funcArgus[i] = null;
        }
        this.funcArgus = null;
    },
    loop: function() {
        var _this = this;
        ////console.log(_this.func.toString() + ' 	'+_this.i+'  '+_this.count);
        if (_this.i == _this.count) {
            if (_this.onFinish) {
                _this.onFinish(_this.funcArgus);
            }
        }
        if (_this.i < _this.count) {
            var doings = _this.funcArgus[_this.i].doing;
            for (var i in doings) {
                doings[i](_this.funcArgus[_this.i], null, _this);
            }
            _this.func(_this.funcArgus[_this.i], function() { //<--- eg. == before after callback
                if (_this.onOneFinish) {
                    var args = new Array(arguments.length + 1);
                    args[0] = _this.funcArgus[_this.i];
                    for (var i = 0; i < arguments.length; ++i) {
                        args[i + 1] = (arguments[i]);
                    }
                    _this.onOneFinish.apply(this, args);
                }

                _this.i++;
                //console.log(' 	sql'+_this.i+'  '+_this.count);
                _this.loop();
            });
        }
    },
    expand: function(funcArgus) { // must be called in onOneFinish
        if (funcArgus && funcArgus.length > 0) {
            this.count += funcArgus.length;
            this.funcArgus = this.funcArgus.concat(funcArgus);
        }
    },
    getArgus: function() {
        return this.funcArgus;
    },
    create: function(count, func, funcArgus, onFinish, onOneFinish) {
        var obj = {
            func: func,
            count: count,
            i: 0,
            onFinish: onFinish,
            onOneFinish: onOneFinish,
            loop: CallbackLooper.loop,
            expand: CallbackLooper.expand,
            funcArgus: funcArgus,
            clear: CallbackLooper.clear
        };
        return obj;
    }
};
var CallbacksLooper = {
    loop: function() {
        var _this = this;
        if (_this.i == _this.count) {
            if (_this.onFinish) {
                _this.onFinish();
            }
        }
        if (_this.i < _this.count) {
            _this.func[_this.i](_this.funcArgus[_this.i], function() {
                if (_this.onOneFinish) {
                    var args = new Array(arguments.length + 1);
                    args[0] = _this.funcArgus[_this.i];
                    for (var i = 1; i < arguments.length; ++i) {
                        args[i + 1] = (arguments[i]);
                    }
                    _this.onOneFinish.apply(this, args);
                }
                _this.i++;
                _this.loop();
            });
        }
    },
    create: function(count, func, funcArgus, onFinish, onOneFinish) {
        var obj = {
            func: func,
            count: count,
            i: 0,
            onFinish: onFinish,
            onOneFinish: onOneFinish,
            loop: CallbacksLooper.loop,
            funcArgus: funcArgus
        };
        return obj;
    }
};
var mapObj = { "\\t": "", "\"[": "[", "]\"": "]", "\"{": "{", "}\"": "}", "\\\"": "\"" };
var roger = {
    "shallow": function(obj) {
        if ("object" == typeof obj) {
            var c = {};
            for (var tag in obj) {
                //if("object" != typeof obj[tag] ) {
                c[tag] = obj[tag];
                //}
            }
            return c;
        }
        return null;
    },
    "copyArray": function(obj) {
        if (Array == obj.constructor) {
            var c = [];
            for (var tag in obj) {
                //if("object" != typeof obj[tag] ) {
                c[tag] = obj[tag];
                //}
            }
            return c;
        }
        return null;
    },
    "format": function(json) {
        //json["IMGHOST"] = IMG_HOST;
        //////console.log(json);
        return JSON.stringify(json).replace(/\"\[|\]\"|\"{|}\"|\\\"|\\t/g, function(matched) {
            return mapObj[matched];
        });
    },
    "check": function(data) { // if base data type e.g. {a:'x',b:3}
        for (var key in data) {
            var d = data[key];
            console.log('-------' + d);
            if (d != null) {
                if ("object" == typeof d && Array != d.constructor) {
                    return 2;
                }
            }
        }
        return 1;
    },
    //data has array property with object instead of array.
    //data has array property with base type. data maybe have multi array property, must be handle by tag.
    "prepare2": function(superior, tag, modal, data, out) { //prepare by data
        var copy = { tag: tag, valid: false, superior: superior, modal: modal, data: data };
        out.push(copy);
        if (data && "object" == typeof data) {
            for (var key in data) {
                var m = modal[key],
                    d = data[key];
                if (m) {
                    if ("object" == typeof d && Array != d.constructor) {
                        roger.prepare2(copy, key, m, d, out);
                    } else if (Array == d.constructor) {
                        for (var i in d) {
                            roger.prepare2(copy, key, m, d[i], out);
                        }
                    }
                }
            }
        }
    },
    "prepare1": function(superior, tag, modal, data, out) {
        var copy = { tag: tag, valid: false, superior: superior, modal: modal, data: data };
        out.push(copy);
        for (var key in modal) {
            var m = modal[key];
            if (m) {
                if ("object" == typeof m && Array != m.constructor) {
                    roger.prepare1(copy, key, m, data, out);
                }
            }
        }
    },
    //all.data <-  receive req json data
    //eg.{UserID:1234,Pics:["",""]}
    //all.list
    "before": function(list, data, onFinish) {
        var funcArgus = [];
        var funcs = [];
        for (var i in list) {
            var item = list[i];
            for (var j in item.modal) {
                if (roger.tagHandler[j] && roger.tagHandler[j].before) {
                    funcArgus.push({ item: item, vector: list });
                    funcs.push(roger.tagHandler[j].before);
                }
            }
        }
        var csl = CallbacksLooper.create(funcs.length, funcs, funcArgus, onFinish, null);
        csl.loop();
    },
    "process": function(list, onFinish) {
        var funcArgus = [];
        for (var i in list) {
            var item = list[i];
            if (item.valid) {
                var doings = [];
                for (var j in item.modal) {
                    if (roger.tagHandler[j] && roger.tagHandler[j].doing) {
                        doings.push(roger.tagHandler[j].doing);
                    }
                }
                funcArgus.push({ sql: item.sql, params: item.params, item: item, doing: doings, vector: list });
            }
        }
        var cl = CallbackLooper.create(funcArgus.length, doSql, funcArgus, onFinish,
            function(funcArgu, err, results) {
                if (!err) {
                    funcArgu.item.output = results;
                }
            });
        cl.loop();
    },
    "after": function(list, data, onFinish) {
        //console.log('after in:');
        var funcArgus = [];
        var funcs = [];
        for (var i in list) {
            var item = list[i];
            for (var j in item.modal) {
                if (roger.tagHandler[j] && roger.tagHandler[j].after) {
                    funcArgus.push({ item: item, vector: list });
                    funcs.push(roger.tagHandler[j].after);
                }
            }
        }
        var csl = CallbacksLooper.create(funcs.length, funcs, funcArgus, onFinish, null);
        csl.loop();
    },
    "clear": function(obj) {},
    "restruct": function(node, out) {
        if ('root' == node.tag) {
            node.ptr = out;
        } else {
            if (Array == node.superior.ptr.constructor) {
                node.superior.ptr[node.__idx][node.tag] = node.output;
                node.ptr = node.output;
            } else if (Array == node.output.constructor && node.output.length == 1 && !node.modal.isarray) {
                node.superior.ptr[node.tag] = node.output[0];
                node.ptr = node.output[0];
            } else {
                node.superior.ptr[node.tag] = node.output;
                node.ptr = node.output;
            }
        }
    },
    "complete": function(list, version) {
        var out = {};
        var tag = '';
        if (!version) {
            for (var i in list) {
                //console.log(list[i].tag);
                tag = list[i].tag;
                if ('root' != tag) {
                    if (out[tag]) {
                        if (Array != out[tag].constructor) {
                            var a = out[tag];
                            out[tag] = [a];
                        }
                        out[tag].push(list[i].output);
                    } else {
                        out[tag] = list[i].output;
                    }
                }
            }
        } else if (version == 2) {
            for (var i in list) {
                roger.restruct(list[i], out);
            }
        }
        var r = roger.format(out);
        list = null;
        out = null;
        //roger.clear(list);
        //roger.clear(out);
        return r;
    },
    //data <-  receive req json data
    //eg.{UserID:1234,Pics:["",""]}
    //copy <-  semi list
    //eg."Picture": {"sql": "UPDATE SET ?, ?;",	"params":["Pics", "UserID"], "files":"Pics"}
    "uploadImages": function(files, onFinish, onOneFinish) {
        var funcArgus = files;
        /*for(var i = 0 ; i < files.length; i ++) {
        	funcArgus.push({base64:files[i]});
        }*/
        var cl = CallbackLooper.create(funcArgus.length, uploadImage, funcArgus,
            onFinish,
            function(funcArgu, fileid) {
                onOneFinish(funcArgu, fileid);
            });
        cl.loop();
    },
    "replace": function(row, modal, findkey, replacement) {
        var finalParams = [];
        for (var i in modal) {
            var tag = modal[i];
            if (tag == findkey) {
                finalParams.push(replacement);
            } else {
                finalParams.push(row[i]);
            }
        }
        return finalParams;
    },
    //eg.{UserID:1234,Pics:["",""]}
    //all.list <-  semi list, extract from modal tree.
    "tagHandler": {
        // ---------------before SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
        "files": {
            before: function(funcArgu, onFinish) {
                var tags = funcArgu.item.modal.files;
                var data = funcArgu.item.data;
                var origin = funcArgu.item.modal.params;
                var params = funcArgu.item.params;
                var files = [];
                var left = [];
                for (var i in tags) {
                    var d = data[tags[i]];
                    var pos = origin.indexOf(tags[i]);
                    if (d) {
                        if (Array == d.constructor) {
                            for (var j in d) {
                                if (d[j].indexOf('data:') > -1) {
                                    files.push({ base64: d[j], index: pos, row: j });
                                } else {
                                    left.push({ fileid: d[j], index: pos, row: j });
                                }

                            }
                        } else if ('string' == typeof d) {
                            //files.push(d);
                            if (d.indexOf('data:') > -1) {
                                files.push({ base64: d, index: pos, row: 0 });
                            } else {
                                left.push({ fileid: d, index: pos, row: 0 });
                            }
                        }
                    }
                    /*else {
                                            params[pos] = null;
                    					}*/
                }
                console.log('uploadimages num:' + files.length);
                roger.uploadImages(files, function(fas) {
                    fas = fas.concat(left);
                    var p = [];
                    for (var i in fas) {
                        if (fas[i].row == 0) {
                            p[0] = params;
                        } else {
                            var copy = roger.shallow(funcArgu.item);
                            copy.params = roger.copyArray(params);
                            funcArgu.vector.push(copy);
                            p[fas[i].row] = copy.params;
                        }
                    }
                    for (var i in fas) {
                        p[fas[i].row][fas[i].index] = fas[i].fileid;
                    }
                    p = null;
                    this.clear();
                    onFinish();
                }, function(fa, fileid) { //oneFinish
                    console.log('uploadimages:' + fileid);
                    fa.fileid = fileid;
                });
            }
        },
        "params": {
            before: function(funcArgu, onFinish) {
                var params = funcArgu.item.modal.params;
                var data = funcArgu.item.data;
                var finalParams = [];
                for (var tag in params) {
                    if (typeof(data[params[tag]]) != "undefined") {
                        finalParams.push(data[params[tag]]);
                    } else {
                        finalParams.push(null);
                    }
                }
                funcArgu.item.params = finalParams;
                onFinish();
            }
        },
        "sql": {
            before: function(funcArgu, onFinish) {
                var item = funcArgu.item;
                item.valid = true;
                item.sql = item.modal.sql;
                item.params = item.modal.params;
                onFinish();
            }
        },
        // ---------------do SQL
        "findkey": {
            doing: function(funcArgu, onFinish, looper) {
                var output = funcArgu.item.superior.output;
                var findkey = funcArgu.item.modal.findkey;
                var data = funcArgu.item.data;
                //superior output is object
                if (output && 'object' == typeof output && Array != output.constructor) {

                    funcArgu.item.params = roger.replace(funcArgu.item.params, funcArgu.item.modal.params, findkey, output[findkey]);
                    funcArgu.params = funcArgu.item.params;

                } // superior output is 2d array
                else if (output && Array == output.constructor) {
                    var argus = [];
                    for (var j = 1; j < output.length; j++) {
                        var copy = roger.shallow(funcArgu.item);
                        var outkey = output[j] ? output[j][findkey] : null;
                        copy.params = roger.replace(funcArgu.item.params, funcArgu.item.modal.params, findkey, outkey);
                        var newArgu = { sql: copy.sql, params: copy.params, item: copy, doing: null };
                        newArgu.item.__idx = j;
                        funcArgu.vector.push(copy);
                        argus.push(newArgu);
                    }
                    looper.expand(argus);
                    var outkey = output[0] ? output[0][findkey] : null;
                    funcArgu.item.params = roger.replace(funcArgu.item.params, funcArgu.item.modal.params, findkey, outkey);
                    funcArgu.item.__idx = 0;
                    funcArgu.params = funcArgu.item.params;

                }
                //onFinish();
            }
        },
        // ---------------after SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
        "orderby": {
            after: function(funcArgu, onFinish) {
                var output = funcArgu.item.output;
                var orderby = funcArgu.item.modal.orderby;
                var obj = {};
                var count = 0;
                for (var i in output) {
                    var row = output[i];
                    var r = row[orderby];
                    if (r && "object" != typeof r && Array != r.constructor) {
                        var o = obj[r];
                        if (!o) {
                            obj[r] = { __index: 0, __values: [] };
                            o = obj[r];
                            count++;
                            o.__index = count;
                        }
                        o.__values.push(row);
                    }
                }
                obj['__count' + orderby] = count;
                funcArgu.item.output = obj;
                onFinish();
            }
        },
        "stoa": { //field : s1,s2.. --> [s1,s2,..]
            after: function(funcArgu, onFinish) {
                var output = funcArgu.item.output;
                var toarray = funcArgu.item.modal.stoa;
                if (Array == output.constructor) {
                    for (var i in output) {
                        for (var j in toarray) {
                            var str = output[i][toarray[j]];
                            if ('string' == typeof str) {
                                funcArgu.item.output[i][toarray[j]] = str.split(',');
                            }
                        }
                    }
                }
                onFinish();
            }
        },
        "otoa": { //field : s1,s2.. --> [s1,s2,..]
            after: function(funcArgu, onFinish) {
                var output = funcArgu.item.output;
                var toarray = funcArgu.item.modal.otoa;
                if (Array == output.constructor) {
                    var obj = {};
                    for (var j in toarray) {
                        obj[toarray[j]] = [];
                        var o = obj[toarray[j]];
                        for (var i in output) {
                            var item = output[i][toarray[j]];
                            o.push(item);
                        }
                    }
                    funcArgu.item.output = obj;
                }
                onFinish();
            }
        }
    }

}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

exports.rogerSmartSql = function(modal, data, callback) {
    var out = [];
    var version = data.version;
    if (data["pagestart"]) {
        data["pagestart"] = parseInt(data["pagestart"]);
    }

    if (data["pagesize"]) {
        data["pagesize"] = parseInt(data["pagesize"]);
    }
    if (roger.check(data) == 1) {
        roger.prepare1(null, 'root', modal, data, out);
    } else {
        roger.prepare2(null, 'root', modal, data, out);
    }
    roger.before(out, data, function() {
        //console.log('BEFORE:');
        roger.process(out, function() {
            //console.log('PROCESS:');
            roger.after(out, data, function() {
                //console.log('AFTER:');
                var results = roger.complete(out, version);
                callback(true, results);
            });
        });
    });
}
exports.doSql = doSql;
