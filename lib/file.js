var fs = require("fs");
var path = require("path");
var Promise = require('promise');
var shortid = require('shortid');
var config = require('../config');

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

exports.makeFileDesc = function (type) {
    var dir = config.MEDIA_HOST.DIRS[String(type)];
    var fd = dir.PREFIX+shortid.generate();//uuidv4();
    var path = dir.PATH+fd;
    return {fd: fd, path: path};
};

exports.extractFileDesc = function (fd) {
    var dirs = config.MEDIA_HOST.DIRS;
    var key, path, prefix;
    for(key in dirs) {
        prefix = dirs[key].PREFIX
        if(fd.indexOf(prefix) == 0){
            path = dirs[key].PATH + fd;
            return {type: key, path: path};
        }
    }
};