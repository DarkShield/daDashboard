// app.js
var express = require('express');
var app = express();

//Test route
app.get('/test', function(req,res){
	res.send('Running');
});

//Bind to PORT
app.listen(1337);
console.log('listening on port 1337');