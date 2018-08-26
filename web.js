var modal = require("./app.data/modal");
var Multer = require('multer'); // v1.0.5
var upload = Multer({ dest: 'uploads/' });

var Web = /** @class */ (function () {
    function Web(express) {
        this._express = express;
		this._app = express();
    };
    Web.prototype.run = function (config, components) {
        for (var i in components) {
            this._accept(components[i]);
        }
		this._config();
        var server = this._app.listen(config.PORT, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log(" app listening at http://%s:%s", host, port);
        });
    };
    Web.prototype._accept = function (component) {
        for (let m in component) {
            if (m[0] == '$'){
				let com = component[m];
			    if(typeof com === 'function') {
					console.log(('/'+component.constructor.name + '/' + m.substr(1,m.length)).toLowerCase());
					this._app.get(('/'+component.constructor.name + '/' + m.substr(1,m.length)).toLowerCase(), passport.authenticate('local'), function (req, res, next) {
						com.apply(component,[req, res]);
					});
				}else if(typeof com == 'object') {
					let that = this;
					com.connect('./app.data/modal')
					.then(function(modals){
						for(let point in modals) {
							console.log(point);
							that._app.post(point, upload.array(), function(req, res) {
								console.log('POINT:' + point + '  ' + JSON.stringify(req.body));
								modal.rogerSmartSql(modals[point], req.body, function(error, results) {
									res.send(results);
								});
							});
							if (true) {
								that._app.get(point, upload.array(), function(req, res) {
									console.log('POINT:' + point + '  ' + JSON.stringify(req.query));
									modal.rogerSmartSql(modals[point], req.query, function(error, results) {
										res.send(results);
									});
								});
							}
						}
					});
				}
            }
        }
    };
    Web.prototype._config = function () {
		this._app.set('view engine', 'ejs');
		//app.use('/html/css', express.static(__dirname + '/css'));
		//app.use('/js', express.static(__dirname + '/js'));
		//app.use('/images', express.static(__dirname + '/images'));
		this._app.use('/', this._express.static(__dirname + '/html'));
		var multer = require('multer'); // v1.0.5

		this._app.use(passport.initialize());
		this._app.use(passport.session());

		var bodyParser = require('body-parser');
		this._app.use(bodyParser.json());
		this._app.use(bodyParser.urlencoded({ extended: false }));
		this._app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
        this._app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
		this._app.use(function(req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Credentials', true);
			res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
			next();
		});
	};
    return Web;
}());

module.exports = Web;