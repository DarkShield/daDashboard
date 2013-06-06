
var crypto 		= require('crypto')
//var MongoDB 	= require('mongodb').Db;
//var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var account = require('../../../../app/model/user');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'node-login';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
// max of 5 attempts, resulting in a 2 hour lock
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;

/* establish the database connection */
mongoose.connect('localhost', 'vicetest', function(err) {
//mongoose.connect('localhost', dbName, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});


/*
var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});

var accounts = db.collection('accounts');
*/


/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	account.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	account.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('invalid login');
		}	else{
            account.comparePassword(o.pass, function(err, isMatch){
                if (isMatch = 'true'){
                        callback(null, o);
                } else {
                    callback('invalid login');
                }
            });
			/*validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});*/
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
    var data = account(newData);
	account.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			account.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
//					saltAndHash(newData.pass, function(hash){
//						newData.pass = hash;
					// append date stamp when record was created //
						//newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						data.save(function(err){
                            if (err) console.log('error');
                            console.log('saved');
                            // mongoose.disconnect();
                        });
					//});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
    var data = account(newData);
	account.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			data.update(o, callback);
		}	else{
                data.save(function(err){
                if (err) console.log('error');
                console.log('saved');
                // mongoose.disconnect();
            });
		}
	});
}

// TODO make async
exports.updatePassword = function(email, newPass, callback)
{
	account.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
            var data = account(o);
            if (data) data.pass = newPass;
            data.save(function(err){
                if (err) console.log('error');
                console.log('saved');
                // mongoose.disconnect();
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	account.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	account.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	account.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	account.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	account.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return account.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	account.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	account.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
