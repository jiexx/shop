var express = require('express');
var app = express();
var config = require('./config');
var data = require('./app.data/data');
var translator = new (require('./app.workflow/translator'))(data);
//var workflow = new (require('./app.workflow/workflow'))(data,translator);
var auth = new (require('./app.auth/auth'))();
var user = new (require('./app.auth/user'))();
var order = new (require('./app.order/order'))();
var templater = new (require('./app.template/template'))();

var web = new (require('./web'))(express);



web.run(config, [data, translator, order, auth, user, templater]);








