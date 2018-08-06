var csv = require('fast-csv');

var CSV = /** @class */ (function () {
    function CSV(file) {
        this.D = [];
        this.title = [];
        this.num = 0;
        var that = this;
        console.log(JSON.stringify(that));
        csv.fromPath(file)
        .on("data", function (data) {
            //console.log(data);
            if (that.num == 0) {
                that.title = data;
            }
            else {
                that.D[that.num - 1] = {};
                for (var i in data) {
                    that.D[that.num - 1][that.title[i]] = data[i].toString("utf8");
                }
            }
            that.num++;
        })
        .on("end", function () {
            console.log("done");
            //console.log(JSON.stringify(_this));
        });
    };
    CSV.prototype.load = function (column_title, value) {
    
    };
    CSV.prototype.locate_by_value = function (column_title, value) {
        var x = -1, y = -1;
        if (typeof column_title != 'string' || typeof value != 'string') {
            return null;
        }
        for (var i in this.title) {
            if (column_title == this.title[i]) {
                x = i;
            }
        }
        for (var i in this.D) {
            if (this.D[i][column_title] == value) {
                y = i;
            }
        }
        return x > -1 && y > -1 ? [parseInt(x), parseInt(y)] : null;
    };
    ;
    CSV.prototype.find_col_by_row_value = function (row, value) {
        var d = this.D[row];
        for (var i in d) {
            if (d[i] == value) {
                return parseInt(i);
            }
        }
        return -1;
    };
    ;
    CSV.prototype.get_value_by_location = function (x, y) {
        if (x < this.title.length && x > -1) {
            if (y < this.D.length && y > -1) {
                return this.D[y][this.title[x]];
            }
        }
        return null;
    };
    return CSV;
}());

module.exports = CSV;
