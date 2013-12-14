var app = require('./server'),
    mongoose = require('mongoose');

//To set environment run
// $export NODE_ENV=development
//or
// $export NODE_ENV=production

if (app.get('env') === 'development') {
  app.set('db uri', 'localhost');
  app.set('db name', 'vicetest');
}

else {
  require('newrelic');
  app.set('db uri', '10.136.20.210');
  app.set('db name', 'vicetest');
}

console.log(app.get('db name'));

mongoose.connect(app.get('db uri'), app.get('db name'));
app.listen(1337);
