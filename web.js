var modal = require("./app.data/modal");
var data = require('./app.data/data');
var Multer = require('multer'); // v1.0.5
var upload = Multer({ dest: 'uploads/' });
var passportJWT = require("passport-jwt");
var cacheManager = require('cache-manager');
var fsStore = require('cache-manager-fs');
var cache = cacheManager.caching({ store: fsStore, options: { ttl: 60 * 60 /* seconds */, maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */, path: 'secret', preventfill: true } });
var crypto = require('crypto');

var Web = /** @class */ (function () {
    function Web(express) {
        this._express = express;
		this._app = express();
		this._jwtOptions = {
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: '123!@#'
		};
		this._passport = require("passport");
		this._jwt = require('jsonwebtoken');
	};
	Web.prototype.sign = function (id) {
		var payload = {id: id};
		return this._jwt.sign(payload, this._jwtOptions.secretOrKey);
	};
	Web.prototype.unsign = function (token) {
		return new Promise(resolve, reject =>{
			this._jwt.verify(token, this._jwtOptions.secretOrKey, function(err, decoded) {
				if(!err) resolve(decoded);
				else reject(err);
			});
		})
	};
    Web.prototype.run = function (config, components) {
		this._config();  
		//*!Configure the CORS stuff before your routes, not inside them.
        for (var i in components) {
            this._accept(components[i]);
        }
        var server = this._app.listen(config.PORT, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log(" app listening at http://%s:%s", host, port);
        });
    };
    Web.prototype._accept = function (component) {
		var that = this;
        for (let m in component) {
            if (m[0] == '$'){
				let com = component[m];
			    if(typeof com === 'function') {
					
					if(m[1] == '_'){
						console.log(('/'+component.constructor.name + '/' + m.substr(2,m.length)).toLowerCase());
						this._app.get(
							('/'+component.constructor.name + '/' + m.substr(2,m.length)).toLowerCase(), 
							this._passport.authenticate('notlogin', { session: false }), 
						function (req, res, next) {
							com.apply(component,[req, res, that]);
						});
					}else if(m[1] == '$') {
						console.log(('/'+component.constructor.name + '/' + m.substr(2,m.length)).toLowerCase());
						this._app.post(
							('/'+component.constructor.name + '/' + m.substr(2,m.length)).toLowerCase(), 
							this._passport.authenticate('logined', { session: false }), 
						function (req, res, next) {
							com.apply(component,[req, res, that]);
						});
					}else {
						console.log(('/'+component.constructor.name + '/' + m.substr(1,m.length)).toLowerCase());
						this._app.post(
							('/'+component.constructor.name + '/' + m.substr(1,m.length)).toLowerCase(), 
						function (req, res, next) {
							com.apply(component,[req, res, that]);
						});
					}
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
	Web.prototype._loginedStrategy = function () {
		var JwtStrategy = passportJWT.Strategy;
		return new JwtStrategy(this._jwtOptions, async function (jwt_payload, next) {
			console.log('payload received', jwt_payload);
			// usually this would be a database call:
			if(jwt_payload.id){
				try{
					const user = await data.userdb.select('users', { ID: jwt_payload.id });
					if (user.length == 1) {
						next(null, user[0]);
					}else {
						next(null, false);
					}
				}catch(err){
					console.log(err);
					next(null, false);
				}
			}
		});
	};
	Web.prototype._notloginStrategy = function () {
		var JwtStrategy = passportJWT.Strategy;
		return new JwtStrategy(this._jwtOptions, function (jwt_payload, next) {
			console.log('payload received', jwt_payload);
			// usually this would be a database call:
			if(jwt_payload.id){
				cache.get(jwt_payload.id, function (err, result) {
					if (err || !result || !result.ticker ) { 
						next(null, false);
						throw err; 
					};
					var curr = (new Date()).getTime();
					if ( curr - result.ticker > 500) {
						cache.set(jwt_payload.id, {ticker:curr}, { ttl: 120 }, function (err) {
							if (err) { 
								next(null, false);
								throw err; 
							};
							next(null, {state:'not login'});
						});
					}else {
						next(null, false);
					}
				});
			}
		});
	};
    Web.prototype._config = function () {
		var that = this;
		this._app.set('view engine', 'ejs');
		//app.use('/html/css', express.static(__dirname + '/css'));
		//app.use('/js', express.static(__dirname + '/js'));
		this._app.use('/', this._express.static(__dirname + '/assets'));
		//this._app.use('/', this._express.static(__dirname + '/html'));
		var multer = require('multer'); // v1.0.5

		var loginedStrategy = this._loginedStrategy();
		var notloginStrategy = this._notloginStrategy();
		this._passport.use('logined',loginedStrategy);
		this._passport.use('notlogin',notloginStrategy);

		var bodyParser = require('body-parser');
		this._app.use(bodyParser.json());
		this._app.use(bodyParser.urlencoded({ extended: false }));
		this._app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
        this._app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
		this._app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			//res.header('Access-Control-Allow-Methods','GET','POST','PUT','DELETE','OPTIONS');
			//res.header("Access-Control-Allow-Origin", req.headers.origin);
			//res.header('Access-Control-Allow-Credentials', true);
			res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
			next();
		});
		// this._app.get('/secret', function (req, res, next) {
		// 	var secret = crypto.randomBytes(8).toString('hex');
		// 	cache.set(secret, {ticker:(new Date()).getTime()}, { ttl: 120 }, function (err) {
		// 		if (err) { 
		// 			res.send({ code: 'ERR', msg: 'secret', data: null });
		// 			throw err; 
		// 		};
		// 		var token = that.sign(secret);
		// 		//res.cookie('token', token);
		// 		res.send({ code: 'OK', msg: token, data: null });
		// 	});
		// });
		
	};
    return Web;
}());

module.exports = Web;