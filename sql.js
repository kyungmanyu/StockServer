
var mysql = require("mysql");



	var connection = mysql.createConnection({
		host : "localhost",
		port : 3306,
		user : "root",
		password : "love0113",
		database : "nodejs"
	});

	var sqlQuery = "select * from member";
	// var post = {id : "kim3", pw : "1333", name : "noname"};
//	console.log(queryData);
//	var post = {id : queryData.id , pw : queryData.pw , name : queryData.name};

//	console.log(post);
	
	connection.connect();
	var query = connection.query(sqlQuery, callback);
	connection.end();
	
	function callback(err, result) {
		if (err) {
			throw err
		}
		console.log("result length : "+result.length);
		for(var i=0; result.length;i++){
			console.log(result[i].id);
		}
		console.log("Insert Complete!");
		
	}
