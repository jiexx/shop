var CSV = require("./csv");
var DB = require("./db");
var config = require('../config');
var Graph = require('./graph')

var Data = /** @class */ (function () {
    function Data() {
        this.$db = new DB();
        this.userdb = new DB(config.USERDB1, config.USERDB2);
        this.graph = new Graph();
        this.orderdb = new DB(config.ORDERDB1, config.ORDERDB2);
        this.productdb = new DB(config.PRODCUTDB1, config.PRODCUTDB2);
        this.csv = {FLOWS: new CSV('./app.data/csv/flows.csv')};
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
