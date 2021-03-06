// var nodeapp = require("fh-nodeapp");
// nodeapp.HostApp.init();
// nodeapp.HostApp.serveApp(require("main.js"));

//
// Copyright (c) 2011 FeedHenry Limited
//
var connect = require('fh-connect');
var util = require('util');
var fs = require('fs');
var consolelogger = require('./node_modules/fh-nodeapp/lib/consolelogger.js');
var fhserver = require('./node_modules/fh-nodeapp/lib/fhserver.js');
var feedhenry = require('./node_modules/fh-nodeapp/lib/feedhenry.js');
var feedhenryReporting = require('./node_modules/fh-nodeapp/lib/fh-reports');
var buffer = require('buffer');
var workers = []; //holds ref to worker processes
var authentication = require('./node_modules/fh-nodeapp/lib/authenticate.js');
var sync = require('./node_modules/fh-nodeapp/lib/sync-srv.js');

// support for running in node 0.4.x
var cluster;
try {
	cluster = require('cluster');
} catch (x) {
	cluster = undefined;
}


var logger = new consolelogger.ConsoleLogger(3);
var mainjs;

// TODO - need to not show fh-nodeapp specific stack here, should just be user code..

function handleError(err, funct, res) {
	res.statusCode = 500;

	console.error("Internal error in " + funct + ": " + util.inspect(err));
	if (err && err.stack) console.error(util.inspect(err.stack));

	var error = {
		msg: "Internal error in " + funct + ": " + err,
		error: JSON.stringify(err)
	};
	res.end(JSON.stringify(error));
}

function isCorsRequest(req) {
	return req.headers['origin'] || req.headers['Origin'];
}
/**
 * add the cors headers to the response
 * @param req the inbound request, needs to check to see if this is a CORs request
 * @param res the outbound response to add the headers to
 * @param preflight
 */
var addCorsHeaders = function addCorsHeaders(req, res, preflight) {
	if (isCorsRequest(req)) {
		if (req.headers['Access-Control-Allow-Origin'] === undefined)
			res.setHeader('Access-Control-Allow-Origin', "*");
		if (preflight) {
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type');
			res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
			res.setHeader('Access-Control-Allow-Credentials', 'true');
		}
	}
}

// main Routing logic
var mainRoute = connect(
	connect.router(function(app) {
		// Process GET's for jsonp
		app.get('/:func', function(req, res) {
			// if ((req.query == null) || (req.query != null && req.query._callback == null)) {
			//   res.writeHead(404);
			//   return res.end();
			// }

			var params = {};
			if (req.query != null) {
				if (req.query.params != null) {
					try {
						params = JSON.parse(req.query.params);
						params._callback = req.query._callback;
					} catch (e) {
						// "params" parameter is not a JSON object - may be a coincidence that we got a
						// standard GET request with a parameter called "params". Just use the req.query
						// obect as the params
						params = req.query;
					}
				} else {
					params = req.query;
				}

				//for js sdk, some jsonp requests will stringiy the request data and send as a query param called _jsonpdata
				//if we see it, parse it as json and send to the request
				if (req.query._jsonpdata) {
					var jsonpdata = null;
					try {
						jsonpdata = JSON.parse(decodeURIComponent(req.query._jsonpdata));
						for (var k in jsonpdata) {
							params[k] = jsonpdata[k];
						}
					} catch (e) {
						params._jsonpdata = req.query._jsonpdata;
					}
				}
			}
			return callFunction(params, req, res);
		});

		// Process POST's for ajax/web requests
		app.post('/:func', function(req, res) {
			return callFunction(req.body, req, res);
		});

		app['options']('/:func', function(req, res) {
			var headers = {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Request-With, Content-Type',
				'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
				'Access-Control-Allow-Credentials': 'true'
			};
			res.writeHead(200, headers);
			res.end("");
		});

	})
);

var getIPofClient = function(req) {
	var ret = "nonset"; // default value

	if (req.headers && req.headers['x-forwarded-for']) {
		ret = req.headers['x-forwarded-for']; // this may be a comma seperated list of addresses added by proxies and load balancers
	} else if (req.connection && req.connection.remoteAddress) {
		ret = req.connection.remoteAddress;
	}

	return ret;
};

var callFunction = function(params, req, res) {
	var funct = req.params.func;
	var responseTime = 0;
	var totalTime = 0;
	var requestTime = new Date().getTime();
	params._headers = req.headers;
	params._files = req.files;
	var msgParams = params;
	msgParams.ipAddress = getIPofClient(req);
	msgParams['agent'] = (req.headers && req.headers['user-agent']) ? req.headers['user-agent'] : '-';
	msgParams['funct'] = funct;

	addCorsHeaders(req, res);

	if (mainjs.hasOwnProperty(funct)) {
		//authentication happens here
		authentication(req, res, params).authenticate(funct, function(err, ok) {
			//we only care about err
			if (err) {
				res.writeHead(err.code, {
					"Cache-Control": "no-cache",
					"Content-Type": "application/json"
				});
				res.end(JSON.stringify(err));
				return;
			}
			try {
				mainjs[funct](params, function(err, data, headers) {
					if (err) {
						handleError(err, funct, res);
					} else {
						var contentType = 'application/json';
						if (data instanceof Buffer) {
							contentType = 'application/octet-stream';
						} else if (typeof(data) !== "string") {
							data = JSON.stringify(data);
						}

						if (params && params._callback != undefined) {
							contentType = 'text/javascript';
							data = params._callback + '(' + data + ');';
						}

						var headerz = setHeaders(headers, contentType);
						res.writeHead(200, headerz);
						res.end(data);

						responseTime = new Date().getTime();
						msgParams['status'] = 200;
						msgParams['time'] = totalTime = (responseTime - requestTime); //milisecs;
						msgParams["start"] = requestTime;
						msgParams["end"] = responseTime;
						if (data) msgParams['bytes'] = (data instanceof Buffer) ? data.length : Buffer.byteLength(data);
						else msgParams['bytes'] = 0;

						//schedule report for next tick
						try {
							feedhenryReporting.sendReport({
								func: funct,
								fullparams: msgParams,
								topic: 'fhact'
							});
						} catch (e) {}
						// also log live stat
						$fhserver.stats.timing(funct + '_request_times', msgParams['time'], true);
						$fhserver.stats.timing('__fh_all_request_times', msgParams['time'], true);
					}
				});
			} catch (x) {
				handleError(x, funct, res);
			}
		});

	} else {
		res.statusCode = 404;
		msgParams['status'] = 404;
		responseTime = new Date().getTime();
		msgParams['time'] = totalTime = (responseTime - requestTime);
		msgParams['bytes'] = 0;
		try {
			feedhenryReporting.sendReport({
				func: funct,
				fullparams: msgParams,
				topic: 'fhact'
			});
		} catch (e) {} //doing noting with exceptions as rather the messaging fail silently than cause probs for app

		res.end(JSON.stringify({
			error: "Error: no such function: " + funct
		}));

	}
};

// utility function for setting headers

function setHeaders(headers, contentType) {
	var headerz = headers || {};
	if (headerz['Content-Type'] == undefined)
		headerz['Content-Type'] = contentType;
	if (headerz['Access-Control-Allow-Origin'] == undefined)
		headerz['Access-Control-Allow-Origin'] = "*";

	// IOS 6 hotfix: http://stackoverflow.com/questions/12506897/is-safari-on-ios-6-caching-ajax-results
	if (headerz['Cache-Control'] == undefined)
		headerz['Cache-Control'] = "no-cache";
	return headerz;
}

// TODO - implement sys/info/version
var sys = connect(
	connect.router(function(app) {
		app.get('/info/ping', function(req, res) {
			res.end(JSON.stringify("OK"));
		});
		app.get('/info/memory', function(req, res) {
			res.end(JSON.stringify(process.memoryUsage()));
		});
		app.get('/info/endpoints', function(req, res) {
			var ret = {
				endpoints: []
			};
			for (var p in mainjs) {
				if (mainjs.hasOwnProperty(p) && 'function' === typeof mainjs[p]) {
					ret["endpoints"].push(p);
				}
			}
			res.end(JSON.stringify(ret));
		});
		app.get('/info/port', function(req, res) {
			// console.log("ha: " + util.inspect(ha))
			var port = ha.getPort();
			res.end("" + port);
		});
	})
);

//
// Process related functions and shutdown
//
process.on('uncaughtException', function(err) {
	var d = new Date();
	console.error(d.toString() + " UncaughtException! " + util.inspect(err));
	if (err != undefined && err.stack != undefined) {
		console.error(util.inspect(err.stack));
	}
});

function exitProcess(code) {
	console.log("exiting process " + process.pid);
	process.exit(code);
};

function shutdown() {
	try {
		if (ha) ha.stopApp(exitProcess);
		setTimeout(function() {
			exitProcess(1);
		}, 5000);
	} catch (x) {
		console.error("HostApp: Error on shutdown: " + x);
		exitProcess(2);
	}
};

process.on('SIGTERM', function() {
	shutdown();
});

process.on('SIGHUP', function() {
	shutdown();
});

function HostApp() {
	var server;
	var port;
	var instances = process.env.FH_APP_INSTANCES;

	function serveApp(main_js, cb) {

		server = hostApp(main_js);
		port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;

		server.on('error', function(err) {
			var code = 1;
			if (err.code == 'EADDRINUSE') {
				code = 9;
			}
			console.error("Unexpected server error: " + err);
			process.exit(code);
		});

		//server set up create multiples if needed.
		if (!cluster) {
			server.listen(port, function() {
				console.log("App started at: " + new Date());
			});
		} else {
			if (instances > 1) {
				if (cluster.isMaster) {
					for (var i = 0; i < instances; i++) {
						var worker = cluster.fork();
						workers.push(worker);
					}
				} else {
					//worker processes starting listening on port
					server.listen(port, function() {
						console.log("Started app instance at: " + new Date());
					});
				}
				cluster.on('death', function(worker) {
					var regenworker = cluster.fork();
					for (var i = 0; i < workers.length; i++) {
						if (workers[i] && workers[i].pid === worker.pid) workers.splice(i);
					}
					workers.push(regenworker);
				});
			} else {

				server.listen(port, function(err) {
					if (err) {
						console.error(err);
						if (cb) return cb(err);
					}
					console.log("App started at: " + new Date());
					if (cb) return cb(null, server);
				});
			}
		}
	};

	// hosts but doesn't listen (mainly used for testing, where express does the listening)

	function hostApp(main_js) {
		mainjs = main_js;

		// Attempt to treat text/plain as json
		connect.bodyParser.parse["text/plain"] = function(req, options, fn) {
			var buf = "";
			req.setEncoding("utf8");
			req.on("data", function(chunk) {
				buf += chunk;
			});

			req.on("end", function() {
				var parsedBuf;
				try {
					parsedBuf = JSON.parse(buf);
				} catch (ex) {
					// Note: ok if this fails, may not be JSON being passed
					// console.error("Error parsing: " + buf + " - " + ex);
				};

				try {
					req.body = parsedBuf ? parsedBuf : buf;
					fn();
				} catch (err) {
					fn(err);
				}
			});
		};

		server = connect()
			.use(connect.bodyParser())
			.use(connect.query())
			.use(connect.errorHandler({
				dumpExceptions: true,
				showMessage: true
			}))
			.use('/cloud', mainRoute)
			.use('/public', function(req, res, next) {
				var static = connect['static']('./cloud/public');
				var path = decodeURI(req.originalUrl);
				if (fs.existsSync('cloud' + path)) {
					return static(req, res, next);
				} else {
					// return default.png thumb
					res.end(fs.readFileSync('cloud/public/default.png'));
				}
			})
			// HealthHub pages -----------------
			.use('/doc', function(req,res,next){
				var url = './cloud/healthhub'+req.url;
				var type=url.split('.').pop();
				var path = decodeURI(url);
				var content = {
					html: 'text/html',
					css : 'text/css',
					js  : 'text/javascript',
					jpg : 'image/jpeg',
					png : 'image/png',
					gif : 'image/gif'
				};

				if(content[type]){
					type=content[type];
				} else {
					type=content.html;
				}

				if(type==='image/jpeg'||type==='image/png'||type==="image/gif"){

					var static = connect['static']('./cloud/healthhub');
					if (fs.existsSync(path)) {
						res.setHeader('Content-Type', 'image/jpeg');
						res.end(fs.readFileSync(url));
						return static(req, res, next);

					} else {
						// return default.png thumb
						console.log('NO image FOUND');
						res.end();
					}
				} else {
					console.log(url, 'type =', type);
					res.setHeader('Content-Type', type);
					var file = fs.readFileSync(path);
					res.end(file);
				}
			})//----------------------------------

			.use('/proxy/proxy/adam', function(req, res) {
				console.log('******proxy/Proxy/Adam req******');
				var url = (req.params && req.params.url) || (req.query && req.query.url) || req.url;
				console.log('URL----', url);
				if (url) {

					mainjs.subPage({
						url: url
					}, function(err, page, type) {
						if (err || !page) {
							res.end("Error retrieving page");
						}

						res.setHeader('Content-Type', type['Content-Type']);
						res.end(page);
					});
				} else {
					res.end('No url supplied');
				}
			})
			.use('/sys', sys)
			.use(function(req, res) {
				if (req.url === '/') {
					res.statusCode = 200;
					res.end("Your Cloud App is Running");
				} else {
					res.statusCode = 404;
					res.end("Error: No end point: " + req.url);
				}
			});

		$fhserver.setServer(server);
		return server;
	}

	function stopApp(callback) {
		//kill the sub instances
		for (var i = 0; i < workers.length; i++) {
			var worker = workers[i];
			worker.kill("SIGTERM");
		}
		if (!instances || instances === 1) {
			server.close();
			if (callback) return callback();
		}
	}

	function init() {
		var millicore = process.env.FH_MILLICORE || 'NO-MILLICORE-DEFINED';
		var domain = process.env.FH_DOMAIN || 'NO-DOMAIN-DEFINED';
		var instance = process.env.FH_INSTANCE || 'NO-INSTANCE-DEFINED';
		var appname = process.env.FH_APPNAME || 'NO-APPNAME-DEFINED';
		var widget = process.env.FH_WIDGET || 'NO-WIDGET-DEFINED';
		var ditch_host = process.env.FH_DITCH_HOST || 'localhost';
		var ditch_port = process.env.FH_DITCH_PORT || 80;
		var ditch_protocol = process.env.FH_DITCH_PROTOCOL || "https";
		var redis_host = process.env.FH_REDIS_HOST || "127.0.0.1";
		var redis_port = process.env.FH_REDIS_PORT || 6379;
		var redis_password = process.env.FH_REDIS_PASSWORD || '';
		var ua = process.env.FH_URBAN_AIRSHIP || '{}';
		var messaging_host = process.env.FH_MESSAGING_HOST || 'NO-MESSAGING-HOST-DEFINED';
		var messaging_cluster = process.env.FH_MESSAGING_CLUSTER || 'NO-MESSAGING-CLUSTER-DEFINED';
		var messaging_server = process.env.FH_MESSAGING_SERVER || 'NO-MESSAGING-SERVER-DEFINED';
		var messaging_recovery_file = process.env.FH_MESSAGING_RECOVERY_FILE || 'NO-RECOVERY-FILE-DEFINED';
		var messaging_protocol = process.env.FH_MESSAGING_PROTOCOL || "https";
		var messaging_backup_file = process.env.FH_MESSAGING_BACKUP_FILE || 'NO-BACKUP-FILE-DEFINED';
		var stats_host = process.env.FH_STATS_HOST || 'localhost';
		var stats_port = process.env.FH_STATS_PORT || 8125;
		var stats_protocol = process.env.FH_STATS_PROTOCOL || "https";
		var stats_enabled = process.env.FH_STATS_ENABLED || false;
		var appapikey = process.env.FH_APP_API_KEY || '';

		try {
			ua = JSON.parse(ua);
		} catch (x) {
			console.error("Error parsing FH_URBAN_AIRSHIP: " + util.inspect(ua) + " err: " + util.inspect(x));
			ua = {};
		}

		var cfg = {
			fhnodeapp: {
				appname: appname,
				millicore: millicore,
				domain: domain,
				instance: instance,
				widget: widget,
				appapikey: appapikey
			},
			fhditch: {
				host: ditch_host,
				port: ditch_port,
				protocol: ditch_protocol
			},
			redis: {
				host: redis_host,
				port: redis_port,
				password: redis_password
			},
			fhmessaging: {
				host: messaging_host,
				cluster: messaging_cluster,
				msgServer: {
					logMessageURL: messaging_server
				},
				recoveryFiles: {
					fileName: messaging_recovery_file
				},
				backupFiles: {
					fileName: messaging_backup_file
				},
				protocol: messaging_protocol
			},
			fhstats: {
				host: stats_host,
				port: stats_port,
				enabled: stats_enabled,
				protocol: stats_protocol
			},
			urbanairship: ua
		};

		$fhserver = feedhenry.FeedHenry(cfg, logger);
		$fh = $fhserver;

		process.title = "fh-" + appname;
	};

	function getPort() {
		return port;
	};

	return {
		init: init,
		stopApp: stopApp,
		hostApp: hostApp,
		serveApp: serveApp,
		getPort: getPort
	};
};

var ha = HostApp();
ha.init()
ha.serveApp(require('main.js'));