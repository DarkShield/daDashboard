var mongoose = require('mongoose');

var reqSchema = mongoose.Schema({
  requestedtimestamp: {type: Date, default: Date.now},
  method: String,
  headers: Object,
  url: String,
  body: String,
  remoteIP: String,
  remotePort: String,
  attack: String,
  attacks: Array,
  dstc: String,
  blocked: Boolean
});

reqSchema.statics.getHostByID = function(id, callback) {
  this.findOne({_id: id}, function(err, reqDoc) {
    if (err) return callback(err);
    else return callback(reqDoc.headers.host);
  })
}

module.exports = mongoose.model('Request', reqSchema);
