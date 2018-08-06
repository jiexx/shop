var file = require('./file')
var Loader = /** @class */ (function () {
    function Loader(loc) {
        this.location = loc;
        this.modal = [];
    };
    Loader.prototype.connect = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            file.loadFiles(that.location)
            .then(function (files) {
                files.forEach(function(element) {
                    var point = '/' + element.filename.substring(0, element.filename.indexOf('.')).replace(/-/g, '/');
                    that.modal[point] = JSON.parse(element.contents);
                });
                resolve(that.modal);
            })
            .catch(function(error){
                console.log("modal ERROR!");
                reject(error);
            });
        });
    };
    return Loader;
}());

module.exports = Loader;