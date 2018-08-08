var CSV = require("./csv");
var DB = require("./db");
var config = require('../config');

var Data = /** @class */ (function () {
    function Data() {
        this.$db = new DB(config.DB1, config.DB2);
        this.csv = {};
        this.csv['FLOWS'] = new CSV('./app.data/csv/flows.csv');
    };
    Data.prototype.execSQL = function (point, json) {
		this.$db.execSQL(point, json);
    };
	Data.prototype.doSQL = function (sqlArgs) {
		this.$db.doSQL(sqlArgs);
    };
    return Data;
}());
module.exports = new Data();
