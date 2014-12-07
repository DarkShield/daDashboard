var app = require('./server'),
    mongoose = require('mongoose')

//To set environment run
// $export NODE_ENV=development
//or
// $export NODE_ENV=production

if (process.env.NODE_ENV === 'development'){
  mongoose.connect('localhost', 'vicetest');
}
else if (process.env.NODE_ENV === 'production'){
  require('newrelic');
  mongoose.connect('ec2-54-204-151-231.compute-1.amazonaws.com', 'vicetest');
}
else {
  mongoose.connect('10.136.20.210', 'dashtest');
}

app.listen(1337);