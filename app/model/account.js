// /models/account.js
// preliminary Account data model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	name : String,
    sites : [ { type : Schema.ObjectID, ref : 'Site' } ],
	users : [ { type : Schema.ObjectID, ref : 'User' } ]
});

mongoose.model('Account', AccountSchema);