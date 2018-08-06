var request = require('request');
var traverse = require('traverse');
var Promise = require('promise');
var Auth = /** @class */ (function () {
    function Auth() {
    }
    Auth.prototype.$login = function (req, res) {
        var name = req.query.username;
        var pwd = req.query.userpwd;
		request('http://localhost:8999/wuser/login?username=' + name + '&userpwd=' + pwd + '&version=2', function (error, response, body) {
			var result = { code: 'OK', msg: '', data: null };
			if (!error && response.statusCode == 200) {
				var o = JSON.parse(response.body);
				if (Object.prototype.toString.call(o.user) === '[object Array]') {
					//用户名不存在
					result.code = 'ERR';
					result.msg = '该用户名不存在';
					res.send(JSON.stringify(result));
				}else {
					if (Object.prototype.toString.call(o.userpwd) === '[object Array]') {
						//用户密码错
						result.code = 'ERR';
						result.msg = '用户密码错';
						res.send(JSON.stringify(result));
					}
					else {
						//正确
						var leaves = traverse(o.user.PERMISSION).reduce(function (acc, x) {
							if (this.isLeaf) {
								var parent = this.parent;
								while (parent) {
									var path = parent.path.join('|');
									if (acc[path] === undefined) {
										acc[path] = x;
									}
									else if (acc[path] === true) {
										if (x === true) {
											acc[path] = true;
										}
									}
									else if (acc[path] === false) {
										if (x === true) {
											acc[path] = true;
										}
									}
									parent = parent.parent;
								}
								acc[this.path.join('|')] = x;
							}
							return acc;
						}, {});
						result.code = 'OK';
						result.msg = '登录成功';
						result.data = leaves;
						res.send(JSON.stringify(result));
					}
				}
			}
		});
    };
    return Auth;
}());
module.exports = Auth;