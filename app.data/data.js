var CSV = require("./csv");
var DB = require("./db");

var Data = /** @class */ (function () {
    function Data() {
        this.$db = new DB();
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
module.exports = Data;
