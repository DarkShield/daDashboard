/**
 * Created by mattjohansen on 8/8/14.
 */
var mongoose = require('mongoose');

var hostSchema = mongoose.Schema({
  hostname: String,
  status: String,
  blacklist: [{ip: String, time: Number}]
});

hostSchema.statics.blockHostIP = function(hostname, ip, cb){
  this.findOne({hostname: hostname}, function(err, host){
    if(!err && host){
      host.blockIP(ip, cb)
    }else{
      err.host = host;
      cb(err);
    }
  });
};

hostSchema.methods.blockIP = function(ip, cb){
  var host = this;
  if(!host.blacklist){
    //create blacklist array
    host.set('blacklist',[{ip: ip, time: 1000}]);
  }else{
    //add ip if not already blocked
    host.blacklist.addToSet({ip: ip, time: 1000});
  }
  host.save(cb);
};

module.exports = mongoose.model('Host', hostSchema);