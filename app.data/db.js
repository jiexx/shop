var file = require("../lib/file");
var modal = require("./modal");
var SQL = (new require("./sql"))();

var DB = /** @class */ (function () {
    function DB(db1,db2) {
        this.modal = []
        this.dbmaster = db1;
        this.dbslave = db2;
    };
    DB.prototype.connect = function (dir) {
        var that = this;
        return new Promise(function (resolve, reject) {
            file.loadFiles(dir)
            .then(function (files) {
                files.forEach(function(element) {
                    var point = '/' + element.filename.substring(0, element.filename.indexOf('.')).replace(/-/g, '/');
                    that.modal[point] = JSON.parse(element.contents);
                });
                resolve(that.modal);
            })
            .catch(function(error){
                console.log("modal ERROR! "+error);
                reject(error);
            });
        });
    };
	DB.prototype.execSQL = function (point, json) {
		var that = this;
        return new Promise(function (resolve, reject) {
            modal.rogerSmartSql(that.modal[point], json, function (error, results) {
                var res = JSON.parse(results);
                console.log("res：" + JSON.stringify(res));
                if (!error)
                    resolve(res.result);
                else
                    reject(error);
            });
        });
    };
	DB.prototype.doSQL = function (sqlArgs) {
        return new Promise(function (resolve, reject) {
            modal.doSql(sqlArgs, function (error, results) {
                var res = JSON.parse(results);
                console.log("res：" + JSON.stringify(res));
                if (!error)
                    resolve(res.result);
                else
                    reject(error);
            });
        });
    };
    DB.prototype.insert = function (table, json) {
        var id = SQL.id();
        var sql2 = SQL.insert(json).finish({db:this.dbslave, table:table});;
        return this.doSQL({sql:sql2,params:[]});
    };
    DB.prototype._complete = function (table, id) {
        var sql = SQL.insertSelected().finish({from:this.dbslave, to:this.dbmaster, table:table}).and({id:id});
        return this.doSQL({sql:sql,params:[]});
    };
    DB.prototype.update = function (table, json) {
        var that = this;
        var sql = SQL.insert(json).finish({db:this.dbslave, table:table});
        return that.doSQL({sql:sql,params:[]})
            .then(function(result){
                var sql = SQL.delete(json).finish({db:this.dbmaster, table:table}).and({id:json.id});
                return that.doSQL({sql:sql,params:[]});
            });
    };
    DB.prototype.delete = function (table, id) {
        var sql = SQL.delete(json).finish({db:this.dbmaster, table:table}).and({id:json.id});
        return this.doSQL({sql:sql,params:[]});
    };
    DB.prototype.select = function (table, json) {
        var sql = SQL.select().finish({db:this.dbmaster, table:table}).and(json);
        return this.doSQL({sql:sql,params:[]});
    };
    
    return DB;
}());

module.exports = DB;
