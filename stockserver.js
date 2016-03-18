﻿// 모듈을 변수에 저장합니다.
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

	var sqlQuery = "INSERT INTO member SET ?";
	console.log(queryData);
	var post = {
		id : queryData.id,
		pw : queryData.token
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

// var server = http.createServer(function(req, res) {
//	
//	
// app.get('/',function(req,res){
// var path = req.pathname;
//			
// console.log('handleGetRequest path : ' + path);
// console.log('queryData req name: ' + req.name);
// res.sendfile(__dirname+"/index.html");
// });
//	
//	
// console.log('createserver');
// var method = req.method.toLowerCase();
// console.log('createserver method : ' + method);
// if (method == 'get')
// handleGetRequest(req, res);
// // else if (method == 'post')
// // handleGetRequest(req, res);
// // else if (method == 'put')
// // handleGetRequest(req, res);
// // else if (method == 'delete')
// // handleGetRequest(req, res);
// else {
// res.statusCode = 404;
// res.end('Wrong method');
// }
// });

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
			title : '주식 알림',
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

	connection.connect();
	var query = connection.query(sqlQuery, callback);
	connection.end();

	function callback(err, result) {
		if (err) {
			throw err
		}

		for (var i = 0; result.length; i++) {
			registrationIds
			.push(result[i].token);			
		}

	}

	// At least one required
	registrationIds
			.push('e02WCttmTRg:APA91bE4oAvxswU3J9QgfZ4wN0VNotIKDwsPDKZHWIy2kXyacP1wXSpgYjoOrSX2ZmAsXTkeyx7BaQY_qUoerKpVPLVSKnloD3eM8Ibh_ue3aovd9DMsG_miVwa-7Dgo39DOQYkCDx9F');
	registrationIds
			.push('eiin5Am5cso:APA91bHzJGt7PWcs96v6i6ycBk-AwcgovHYgsXaV4qc4rgkcgQuBe3CCIHohsfKbR9ZtD8C41_oNEhcfv6I4zFBfWIaYvylj-dGrCvQPE6vSu1lhOyyrhrqRWh53GwGaIjNAzeF3eb-6');

	sender.send(message, registrationIds, 4, function(err, result) {

		res.end(JSON.stringify(result));
		console.log(result);
	});
}

function handleGetRequest(req, res) {

	console.log('handleGetRequest req.url : ' + req.url);
	var url = req.url;
	var queryData = urlvar.parse(req.url, true).query;
	var pathname = urlvar.parse(req.url).pathname;

	console.log('handleGetRequest pathname : ' + pathname);
	if (pathname == '/sendgcm') {
		handleGcm(res , queryData);

	}
	if (pathname == '/savegcm') {
		console.log('queryData name: ' + queryData.name);

		saveSql(queryData)
		res.end();
	}

}

server.listen(3000, function() {
	console.log("server is running 3000 port...");
});
