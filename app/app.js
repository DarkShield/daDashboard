var app = require('./server'),
    mongoose = require('mongoose');

//To set environment run
// $export NODE_ENV=development
//or
// $export NODE_ENV=production
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development'){
  mongoose.connect('localhost', 'vicetest');
}
else if (process.env.NODE_ENV === 'production'){
  require('newrelic');
  mongoose.connect('10.136.20.210', 'vicetest');
}
else {
  mongoose.connect('10.136.20.210', 'dashtest');
}

app.listen(1337);
