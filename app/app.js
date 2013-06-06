var app = require('./server'),
    mongoose = require('mongoose');

mongoose.connect('localhost', 'vicetest');
app.listen(1337);
