var file = require("../lib/file");
var modal = require("./modal");
var q = new require("./sql");
var SQL = new q();

var config = require('../config');
var mysql = require('mysql');
var util = require('util');
var pool = mysql.createPool({
    host: config.DATA_HOST,
    user: config.DBUSER,
    password: config.DBPWD,
    connectionLimit: 500,
});


var DB = /** @class */ (function () {
    function DB(db1, db2) {
        this.modal = []
        this.dbmaster = db1;
        this.dbslave = db2;

        pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }
            }
            if (connection) connection.release()
            return
        })
        pool.query = util.promisify(pool.query);
    };
    DB.prototype.connect = function (dir) {
        var that = this;
        return new Promise(function (resolve, reject) {
            file.loadFiles(dir)
                .then(function (files) {
                    files.forEach(function (element) {
                        var point = '/' + element.filename.substring(0, element.filename.indexOf('.')).replace(/-/g, '/');
                        that.modal[point] = JSON.parse(element.contents);
                    });
                    resolve(that.modal);
                })
                .catch(function (error) {
                    console.log("modal ERROR! " + error);
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
                console.log("results: " + JSON.stringify(results));
                if (!error)
                    resolve(results);
                else
                    reject(error);
            });
        });
    };


    DB.prototype.delete = async function (table, id) {
        var sql = SQL.delete(json).finish({ db: this.dbmaster, table: table }).and({ id: json.id });
        return await pool.query(sql)
        //return this.doSQL({ sql: sql, params: [] });
    };
    DB.prototype.select = async function (table, where) {
        var sql = SQL.select().finish({ db: this.dbmaster, table: table }).and(where);
        return await pool.query(sql)
        //return this.doSQL({ sql: sql, params: [] });
    };
    DB.prototype.insert = async function (table, json) {
        if(!json['ID']){
            json['ID'] = SQL.ID();
        }
        var sql = SQL.insert(json).finish({ db: this.dbmaster, table: table });
        let result = await pool.query(sql);
        result['uuid'] = json['ID'];
        return result;
        //return this.doSQL({ sql: sql, params: [] });
    };
    DB.prototype.update = async function (table, json, where) {
        var that = this;
        var sql = SQL.update(json).finish({ db: this.dbmaster, table: table }).and(where);
        return await pool.query(sql)
        //return that.doSQL({ sql: sql, params: [] });
    };
    return DB;
}());

module.exports = DB;
