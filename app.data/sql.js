var crypto = require('crypto');
const now = require('nano-time');

var SQL = /** @class */ (function () {
    function SQL() {
        String.prototype.finish = function (json) {
            var sql=''+this;
            for(var i in json) {
                var r1 = new RegExp('{'+i+'}', '');
                var r2 = new RegExp('['+i+']', '');
                sql = sql.replace(r1, json[i]);
                sql = sql.replace(r2, i);
            }
            return sql;
        };
        String.prototype.and = function (json) {
            var sql=''+this;
            for(var i in json) {
                sql += ' AND '+i+'="'+json[i]+'"';
            }
            if(sql.indexOf('WHERE')<0) {
                sql += ' WHERE '+sql.substr(5,sql.length-1);
            }
            return sql;
        }
        String.prototype.or = function (json) {
            var sql=''+this;
            for(var i in json) {
                sql += ' OR '+i+'="'+json[i]+'"';
            }
            if(sql.indexOf('WHERE')<0) {
                sql += ' WHERE '+sql.substr(4,sql.length-1);
            }
            return sql;
        }
    };
    SQL.prototype.ID = function () {
        var nano = now();
        var token = crypto.randomBytes(64).toString('hex');
        var md5 = crypto.createHash('md5').update(token+now).digest('hex');
        return md5;
    };
    SQL.prototype.insert = function (json) {
        var fields = '', values = '';
        for(var i in json) {
            fields += i+',';
            values += json[i]+',';
        }
        fields[fields.length-1] = ' ';
        values[values.length-1] = ' ';
        var sql = 'INSERT INTO {db}.{table} ('+fields+') VALUES ('+values+');';
        return sql;
    };
    SQL.prototype.insertSelected = function () {
        return 'INSERT INTO {to}.{table} SELECT * FROM {from}.{table}';
    };
    SQL.prototype.update = function (json) {
        var fieldvalue = '';
        for(var i in json) {
            fieldvalue += i+'='+json[i]+',';
        }
        fieldvalue[fieldvalue.length-1] = ';';
        return 'UPDATE {db}.{table} SET '+fieldvalue;
    };
    SQL.prototype.delete = function () {
        return 'DELETE FROM {db}.{table} ';
    };
    SQL.prototype.select = function () {
        var sql = 'SELECT FROM {db}.{table} ';
        return sql;
    };
    return SQL;
}());

module.exports = SQL;
