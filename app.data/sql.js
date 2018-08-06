var crypto = require('crypto');
const now = require('nano-time');

var SQL = /** @class */ (function () {
    function SQL(sql) {
    };
    SQL.prototype.ID = function () {
        var nano = now();
        var token = crypto.randomBytes(64).toString('hex');
        var md5 = crypto.createHash('md5').update(token+now).digest('hex');
        return md5;
    };
    SQL.prototype.insert = function (table, json) {
        var sql = 'INSERT INTO {dbname}.'+table+' (';
        var fields = '', values = '';
        for(var i in json) {
            fields += i+',';
            values += '"'+json[i]+'",';
        }
        fields[fields.length-1]=',ID)';
        values[values.length-1]='{id});';
        sql += fields;
        sql += ' VALUES('+values;
        return sql;
    };
    SQL.prototype.complete = function (sql, db, id) {
        return sql.replace(/{dbname}/, db).replace(/{id}/, id);
    };
    SQL.prototype.insertSelected = function (db1, db2, table, id) {
        var sql = 'INSERT INTO '+db1+'.'+table+' SELECT * FROM '+db2+'.'+table+' WHERE ID='+id;
        return sql;
    };
    SQL.prototype.update = function (table, json) {
        var sql = 'UPDATE {dbname}.'+table+' SET';
        for(var i in json) {
            sql += i+'="'+json[i]+'",';
        }
        sql += ' WEHERE id={id}';
        return sql;
    };
    SQL.prototype.delete = function (table) {
        var sql = 'DELETE FROM {dbname}.'+table+' WEHERE id={id}';
        return sql;
    };
    SQL.prototype.select = function (table) {
        var sql = 'DELETE FROM {dbname}.'+table+' WEHERE id={id}';
        return sql;
    };
    return SQL;
}());

module.exports = SQL;
