// /models/domain.js
// Preliminary Domain data model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DomainSchema = new Schema({
	name : String,
	url : String,
	users : [ { type : Schema.ObjectID, ref : 'User' } ],
	producer : String
});

DomainSchema.path('name').validate(function (name) {
  return name.length > 0;
}, 'Article title cannot be blank');

DomainSchema.path('url').validate(function (url) {
  return url.length > 0;
}, 'Article title cannot be blank');

mongoose.model('Domain', DomainSchema);