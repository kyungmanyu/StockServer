// 모듈을 변수에 저장합니다.
var http = require('http');
var gcm = require('node-gcm');
var fs = require('fs');
var mysql = require("mysql");
var urlvar = require("url");
var express = require('express');
var app = express();

// ------------------------------SQL INSERT
// ---------------------------------------//

function saveSql(queryData) {

	var connection = mysql.createConnection({
		host : "localhost",
		port : 3306,
		user : "root",
		password : "love0113",
		database : "tokenstorage"
	});

	var sqlQuery = "INSERT INTO tokens SET ?";
	console.log(queryData);
	var post = {
		id : queryData.id,
		token : queryData.token
	};

	console.log(post);

	connection.connect();
	var query = connection.query(sqlQuery, post, callback);
	connection.end(post);

	function callback(err, result) {
		if (err) {
			throw err
		}
		console.log("Insert Complete!");
		console.log(query.sql);
	}
}

function saveJongmok(queryData) {

	var connection = mysql.createConnection({
		host : "localhost",
		port : 3306,
		user : "root",
		password : "love0113",
		database : "tokenstorage"
	});

	var sqlQuery = "INSERT INTO jongmoktable SET ?";
	console.log(queryData);
	var post = {
		jongmok : queryData.jongmok,
		price : queryData.price
	};

	console.log(post);

	connection.connect();
	var query = connection.query(sqlQuery, post, callback);
	connection.end(post);

	function callback(err, result) {
		if (err) {
			throw err
		}
		console.log("Insert Complete!");
		console.log(query.sql);
	}
}

// -----------------------------------------------------------------------------------------------------

var server = http.createServer(app);
app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res) {
	var path = req.pathname;

	console.log('open handleGetRequest path : ' + path);

	// res.sendFile(__dirname+"/public/index.html");
	handleGetRequest(req, res);
});

app.get('/showhistory', function(req, res) {
	var path = req.pathname;

	console.log('showhistory');
	console.log('queryData res name: ' + res.name);
	fs.readFile('/StockServer-master/public/history.html',
			function(error, data) {
				if (error) {
					console.log(error);
				} else {
					res.writeHead(200, {
						'Content-Type' : 'text/html'
					});
					res.end(data);
				}
			});

});

app.get('/sendgcm', function(req, res) {
	var path = req.pathname;

	console.log('sendgcm handleGetRequest path : ' + path);
	console.log('queryData req name: ' + req.name);
	handleGetRequest(req, res);
});

app.get('/savegcm', function(req, res) {
	var path = req.pathname;

	console.log('savegcm handleGetRequest path : ' + path);
	console.log('queryData req name: ' + req.name);
	handleGetRequest(req, res);
});

app.get('/savejongmok', function(req, res) {
	var path = req.pathname;

	console.log('savejongmok handleGetRequest path : ' + path);
	console.log('queryData req name: ' + req.name);
	handleGetRequest(req, res);
});

app.get('/getjongmok', function(req, res) {
	var path = req.pathname;

	console.log('sendgcm handleGetRequest path : ' + path);
	console.log('queryData req name: ' + req.name);
	handleGetRequest(req, res);
});

/**
 * Params: message-literal, registrationIds-array, No. of retries,
 * callback-function
 */

function handleGcm(res, queryData) {

	var message = new gcm.Message();

	var message = new gcm.Message({
		collapseKey : 'demo',
		delayWhileIdle : true,
		timeToLive : 3,
		data : {
			title : queryData.title,
			message : queryData.message,
			key1 : 'message1',
			key2 : 'message2'
		}
	});

	var connection = mysql.createConnection({
		host : "localhost",
		port : 3306,
		user : "root",
		password : "love0113",
		database : "tokenstorage"
	});

	var sqlQuery = "select * from tokens";

	var sender = new gcm.Sender('AIzaSyDmYg6tJfEjW7H5u5-FVdgwFrCK-p7ecFU');
	var registrationIds = [];

	function callback(err, result) {
		if (err) {
			throw err
		}

		for (var i = 0; i < result.length; i++) {

			registrationIds.push('' + result[i].token + '');
		}
		sender.send(message, registrationIds, 4, function(err, result) {
			if (err) {
				throw err
			}
			console.log('sender message = ' + message);
			res.end(JSON.stringify(result));
			console.log(result);
		});
	}

	connection.connect();
	var query = connection.query(sqlQuery, callback);

	console.log('query = ' + query);
	connection.end();

	// At least one required
	// registrationIds
	// .push('ckbXUqb4Xss:APA91bH56YUVrXPP_wCI8CPc0oJmp5OYA3jePS8n1LE-mOSiORqKKzyqzuk_5J7piDUcrpPZ68pxYx19BvDNUbinwagJCBvPuQuXjFnnLnZ7dzUlMfccq5Ca74AP5fC-bTsMFA9B_CZN');
	// registrationIds
	// .push('eiin5Am5cso:APA91bHzJGt7PWcs96v6i6ycBk-AwcgovHYgsXaV4qc4rgkcgQuBe3CCIHohsfKbR9ZtD8C41_oNEhcfv6I4zFBfWIaYvylj-dGrCvQPE6vSu1lhOyyrhrqRWh53GwGaIjNAzeF3eb-6');

}

function getJongmok(res, queryData) {

	var connection = mysql.createConnection({
		host : "localhost",
		port : 3306,
		user : "root",
		password : "love0113",
		database : "tokenstorage"
	});

	var sqlQuery = "select * from jongmoktable";

	var sender = new gcm.Sender('AIzaSyDmYg6tJfEjW7H5u5-FVdgwFrCK-p7ecFU');
	var registrationIds = [];

	var data = [];

	function callback(err, result) {
		if (err) {
			throw err
		}

//		for (var i = 0; i < result.length; i++) {
//
//			data.push(result[i].jongmok + '/' + result[i].price + '');
//
//		}

		res.end(JSON.stringify(result));
		console.log(JSON.stringify(result));
	}

	connection.connect();
	var query = connection.query(sqlQuery, callback);

	console.log('query = ' + query);
	connection.end();

}

function handleGetRequest(req, res) {

	console.log('handleGetRequest req.url : ' + req.url);
	var url = req.url;
	var queryData = urlvar.parse(req.url, true).query;
	var pathname = urlvar.parse(req.url).pathname;

	console.log('handleGetRequest pathname : ' + pathname);
	if (pathname == '/sendgcm') {
		handleGcm(res, queryData);

	}
	if (pathname == '/savegcm') {
		console.log('queryData name: ' + queryData.name);

		saveSql(queryData)
		res.end();
	}
	if (pathname == '/savejongmok') {
		console.log('savejongmok name: ' + queryData.name);

		saveJongmok(queryData)
		res.end('ok');
	}
	if (pathname == '/getjongmok') {
		getJongmok(res, queryData);

	}

}

server.listen(9000, function() {
	console.log("server is running 9000 port...");
});