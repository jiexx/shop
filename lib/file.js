var fs = require("fs");
var path = require("path");
var Promise = require('promise');
exports.readFiles = function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}
function pa(items, block) {
    var promises = [];
    items.forEach(function(item,index) {
        promises.push( function(item,i) {
            return new Promise(function(resolve, reject) {
                return block.apply(this,[item,index,resolve,reject]);
            });
        }(item,index))
    });
    return Promise.all(promises);
} 
exports.loadFiles = function loadFiles(dirname) {
    return new Promise(function(resolve, reject){
        fs.readdir(dirname, function(err, filenames) {
            if (err) return reject(err);
            pa(filenames, function(filename,index,resolve,reject){
                fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
                    if (err) return reject(err);
                    return resolve({filename: filename, contents: content});
                });
            }).then(function(results){
                return resolve(results);
            }).catch(function(error){
                return reject(error);
            });
        });
    });
};