var file = require("../lib/file");
var modal = require("./modal");
var SQL = (new require("./sql"))();

var DB = /** @class */ (function () {
    function DB(db1,db2) {
        this.modal = []
        this.db1 = db1;
        this.db2 = db2;
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
        var sql = SQL.insert(table, json);
        var id = SQL.id();
        //var sql1 = SQL.complete(sql, this.db1, id);
        var sql2 = SQL.complete(sql, this.db2, id);
        return this.doSQL({sql:sql2,params:[]});
    };
    DB.prototype._insertSelected = function (table, id) {
        var sql = SQL.insertSelected(this.db1, this.db2, table, id);
        return this.doSQL({sql:sql,params:[]});
    };
    DB.prototype.update = function (table, id, json) {
        var that = this;
        //var sql1 = SQL.complete(sql, this.db1, id);
        var sql = SQL.complete(SQL.update(table, id, json), that.db1, id);
        return that.doSQL({sql:sql,params:[]})
            .then(function(result){
                var sql = SQL._insertSelected(that.db2, that.db1, table, id);
                that.doSQL({sql:sql,params:[]})
                .then(function(result){
                    var sql = SQL.complete(SQL.delete(table), this.db1, id);
                    return that.doSQL({sql:sql,params:[]})
                });
            });
    };
    DB.prototype.delete = function (table, id) {
        var that = this;
        var sql = SQL._insertSelected(that.db2, that.db1, table, id);
        return that.doSQL({sql:sql,params:[]})
                .then(function(result){
                    var sql = SQL.complete(SQL.delete(table), this.db1, id);
                    return that.doSQL({sql:sql,params:[]})
                });
    };
    DB.prototype.select = function (table, id) {
        var sql = SQL.complete(SQL.select(table), this.db, id);
        return this.doSQL({sql:sql,params:[]});
    };
    
    return DB;
}());

module.exports = DB;
