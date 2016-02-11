// 모듈을 변수에 저장합니다.
var http = require('http');
var gcm = require('node-gcm');
var fs = require('fs');

var server = http.createServer(function(req, res) {
	console.log('createserver');
	var method = req.method.toLowerCase();
	if (method == 'get')
		handleGetRequest(req, res);
	else if (method == 'post')
		handleGetRequest(req, res);
	else if (method == 'put')
		handleGetRequest(req, res);
	else if (method == 'delete')
		handleGetRequest(req, res);
	else {
		res.statusCode = 404;
		res.end('Wrong method');
	}
});


/**
 * Params: message-literal, registrationIds-array, No. of retries,
 * callback-function
 */

function handleGcm(res) {

	var message = new gcm.Message();

	var message = new gcm.Message({
		collapseKey : 'demo',
		delayWhileIdle : true,
		timeToLive : 3,
		data : {
			title : '주식 알림',
			message : '종목이 추천되었습니다',
			key1 : 'message1',
			key2 : 'message2'
		}
	});

	var sender = new gcm.Sender('AIzaSyDmYg6tJfEjW7H5u5-FVdgwFrCK-p7ecFU');
	var registrationIds = [];

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
	console.log('handleGetRequest');
	var url = req.url;
	if (url == '/sendgcm') {
		handleGcm(res);

	}
}

server.listen(30000);
