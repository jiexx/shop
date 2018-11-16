var crypto = require('crypto');
const now = require('nano-time');
//const uuidv4 = require('uuid/v4');
var shortid = require('shortid');


var SQL = /** @class */ (function () {
    function SQL() {
        String.prototype.finish = function (json) {
            var sql=''+this;
            for(var i in json) {
                var r1 = new RegExp('{'+i+'}', '');
                //var r2 = new RegExp('\['+i+'\]', '');
                sql = sql.replace(r1, json[i]);
                //sql = sql.replace(r2, i);
            }
            return sql;
        };
        String.prototype.and = function (json) {
            var sql=''+this;
            if(sql.indexOf('WHERE')<0) {
                sql += ' WHERE ';
                for(var i in json) {
                    sql += i+'="'+json[i]+'" AND ';
                }
                return sql.substr(0,sql.length-4);
            }else {
                for(var i in json) {
                    sql += ' AND '+i+'="'+json[i]+'" ';
                }
                return sql;
            }
        }
        String.prototype.or = function (json) {
            var sql=''+this;
            if(sql.indexOf('WHERE')<0) {
                sql += ' WHERE ';
                for(var i in json) {
                    sql += i+'="'+json[i]+'" OR ';
                }
                return sql.substr(0,sql.length-3);
            }else {
                for(var i in json) {
                    sql += ' OR '+i+'="'+json[i]+'" ';
                }
                return sql;
            }
        }
    };
    SQL.prototype.ID = function () {
        // var nano = now();
        // var token = crypto.randomBytes(64).toString('hex');
        // var md5 = crypto.createHash('md5').update(token+now).digest('hex');
        return shortid.generate();//'#i';////uuidv4();
    };
    SQL.prototype.insert = function (json) {
        var fields = '', values = '';
        for(var i in json) {
            fields += i+',';
            if(json[i]=='#i'){
                values += json[i]+',';
            }else{
                values += '"'+json[i]+'",';
            }
        }
        fields = fields.substr(0, fields.length - 1);
        values = values.substr(0, values.length - 1);
        var sql = 'INSERT INTO {db}.{table} ('+fields+') VALUES ('+values+');';
        return sql;
    };
    SQL.prototype.insertSelected = function () {
        return 'INSERT INTO {to}.{table} SELECT * FROM {from}.{table}';
    };
    SQL.prototype.update = function (json) {
        var fieldvalue = '';
        for(var i in json) {
            fieldvalue += i+'="'+json[i]+'",';
        }
        fieldvalue = fieldvalue.substr(0, fieldvalue.length - 1);
        return 'UPDATE {db}.{table} SET '+fieldvalue;
    };
    SQL.prototype.delete = function () {
        return 'DELETE FROM {db}.{table} ';
    };
    SQL.prototype.select = function () {
        var sql = 'SELECT * FROM {db}.{table} ';
        return sql;
    };
    return SQL;
}());

module.exports = SQL;
