var defaultAuth = require('./defaultAuth');

var Workflow = /** @class */ (function () {
    function Workflow(data, translator) {
        this._data = data;
		this._translator = translator;
    }
	Workflow.prototype.$start = function (req, res) {   //localhost:8999/Workflow/start
        var userid = req.query.userid;
		var optype = req.query.optype;
		var objid = req.query.objid;
		
		var that = this;
		this._data.start(userid, optype, objid)
			.then(function(r){
				console.log("65code:" + r[0]);
				if (r[0] != 'error') {
					if (r[0] == 'end') {
						console.log("code ==end");
						that._translator.approve(objid, optype, function(code, msg) {
							console.log(JSON.stringify({ code: 'translator_approve', req: req.query, res: msg }));
						});
						res.send(JSON.stringify({ code: 'end_approve', req: req.query, res: r[1] }));
					} else {
						res.send(JSON.stringify({ code: 'success_start', req: req.query, res: r[1] }));
					}
				} else {
					res.send(JSON.stringify({ code: 'error', req: req.query, res: r[1] }));
				}
			});
    };
    Workflow.prototype.$query = function (req, res) {
        var userid = req.query.userid;

		this._data.query(userid)
			.then(function(r) {
				console.log("query by uid:" + r);
				if (r[0] != 'error') {
					res.send(JSON.stringify({ code: 'success_query', req: req.query, res: r[1] }));
				} else {
					res.send(JSON.stringify({ code: 'error', req: req.query, res: r[1] }));
				}
			});
    };
    Workflow.prototype.$getDefaultAuth = function () {
        var leaves = traverse(defaultAuth).reduce(function (acc, x) {
			if (this.isLeaf) {
				var parent = this.parent;
				while(parent) {
					var path = parent.path.join('|');
					if(acc[path]===undefined) {
						acc[path] = x;
					}else if(acc[path]===true) {
						if( x === true ) {
							acc[path] = true;
						}
					}else if(acc[path]===false) {
						if(x === true ) {
							acc[path] = true;
						}
					}
					parent = parent.parent;
				}
				acc[this.path.join('|')]=x;
			}
			return acc;
		}, {});
		
		res.send(JSON.stringify(leaves));
    };
    Workflow.prototype.$approve = function () {
        var taskid = req.query.taskid;
		var typeop = req.query.typeop;
		var objid = req.query.objid;

		var that = this;
		this._data.approve(taskid)
			.then(function(code, results) {
				if (r[0] != 'error') {
					if (r[0] == 'end') {
						var d = JSON.parse(results);
						console.log('dddd:' + JSON.stringify(d));
						if (d.data && d.data.length == 1) {
							that._translator.approve(d.data[0].OBJID, d.data[0].TYPEOP, function(code, msg) {
								console.log(JSON.stringify({ code: 'translator_approve', req: req.query, res: msg }));
							});
						}
						res.send(JSON.stringify({ code: 'end_approve', req: req.query, res: JSON.parse(results) }));
					} else {
						res.send(JSON.stringify({ code: 'success_approve', req: req.query, res: JSON.parse(results) }));
					}
				} else {
					res.send(JSON.stringify({ code: 'error', req: req.query, res: JSON.parse(results) }));
				}
			});
    };
    Workflow.prototype.query_next_by_uid_op = function (uid, op) {
        var flows = this._data.csv['FLOWS'];
        return this._data.execSQL('/wflow/query/job/by/uid', { userid: uid, version: 2 })
            .then(function (results) {
            if (typeof results.job == 'string') {
                var job = results.job;
                var loc = flows.locateByValue('TYPEOP', op);
                if (loc) {
                    var col = flows.findColByRowValue(loc[1], job);
                    var next = flows.getValueByLocation(col + 3, loc[1]);
                    if (col == 7 || !next || job == 'CJGL') {
                        //onFinish('end', job);
                        return Promise.resolve(['end', job]);
                    }
                    else {
                        //onFinish('pending', next);
                        return Promise.resolve(['pending', next]);
                    }
                }
                else {
                    //onFinish('error', null);
                    return Promise.reject('error');
                }
            }
        })
            .catch(function () {
            return Promise.resolve('error');
        });
    };
    ;
    Workflow.prototype.query_next_by_taskid = function (tid) {
        var flows = this._data.csv['FLOWS'];
        return this._data.execSQL('/wflow/query/job/by/uid', { taskid: tid, version: 2 })
            .then(function (results) {
            if (typeof results.CURRJOB == 'string') {
                var currjob = results.CURRJOB;
                var op = results.TYPEOP;
                var loc = flows.locateByValue('TYPEOP', op);
                if (loc) {
                    var col = flows.findColByRowValue(loc[1], currjob);
                    var next = flows.getValueByLocation(col + 3, loc[1]);
                    if (col == 7 || !next) {
                        //onFinish('end', null);
                        return Promise.resolve(['end']);
                    }
                    else {
                        //onFinish('pending', next);
                        return Promise.resolve(['pending', next]);
                    }
                }
                else {
                    //onFinish('error', null);
                    return Promise.reject('error');
                }
            }
        })
            .catch(function () {
            return Promise.reject('error');
        });
    };
    ;
    Workflow.prototype.start = function (uid, typeop, objid) {
        console.log('uid:' + uid + 'typeop' + typeop + 'objid' + objid);
        var that = this;
        return this.query_next_by_uid_op(uid, typeop)
            .then(function (r) {
            if (r[0] == 'pending') {
                that.data.execSQL('/wflow/start', { typeop: typeop, userid: uid, job: r[1], objid: objid })
                    .then(function (results) {
                    //onFinish(error, results);
                    return Promise.resolve(['pending', results]);
                });
            }
            else if (r[0] == 'end') {
                that.data.execSQL('/wflow/start/end', { typeop: typeop, userid: uid, job: r[1], objid: objid })
                    .then(function (results) {
                    //onFinish(error, results);
                    return Promise.resolve(['end', results]);
                });
            }
            else {
                return Promise.reject('error');
            }
        }).catch(function () {
            return Promise.reject('error');
        });
    };
    ;
    Workflow.prototype.query = function (uid) {
        return this._data.execSQL('/wflow/query/tasks/by/uid', { userid: uid, version: 2 })
            .then(function (results) {
            return Promise.resolve(results);
        })
            .catch(function () {
            return Promise.reject('error');
        });
    };
    ;
    Workflow.prototype.approve = function (taskid, onFinish) {
        var that = this;
        return this.query_next_by_taskid(taskid)
            .then(function (r) {
            if (r[0] == 'pending') {
                that.data.execSQL('/wflow/approve', { currjob: r[1], taskid: taskid })
                    .then(function (results) {
                    //onFinish(error, results);
                    return Promise.resolve(['pending', results]);
                });
            }
            else if (r[0] == 'end') {
                that._data.execSQL('/wflow/end', { taskid: taskid })
                    .then(function (results) {
                    //onFinish(error, results);
                    return Promise.resolve(['end', results]);
                });
            }
            else {
                return Promise.reject('error');
            }
        }).catch(function () {
            return Promise.reject('error');
        });
    };
    return Workflow;
}());

module.exports = Workflow;