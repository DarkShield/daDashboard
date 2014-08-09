/**
 * Created by mattjohansen on 8/8/14.
 */
var mongoose = require('mongoose');

var hostSchema = mongoose.Schema({
  hostname: String,
  status: String,
  blacklist: [{ip: String, time: Number}]
});

module.exports = mongoose.model('Host', hostSchema);