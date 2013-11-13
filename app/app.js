require('newrelic');

var app = require('./server'),
    mongoose = require('mongoose');

//mongoose.connect('localhost', 'vicetest');
mongoose.connect('10.192.198.253', 'vicetest');
app.listen(1337);
