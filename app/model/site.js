// /model/site.js
// preliminary Site data model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
	name : String,
	baseurl : String,
	users : [ { type : Schema.ObjectID, ref : 'User' } ],
	domains : [ { type : Schema.ObjectID, ref : 'Domain' } ]
});

mongoose.model('Site', SiteSchema);