var email   = require("emailjs");
var EmailServer  = email.server.connect({
   user:    "vicet3ch", 
   password:"ScottIsADick", 
   host:    "smtp.gmail.com", 
   ssl:     true

});

// send the message and get a callback with an error or details of the message that was sent
/*server.send({
   text:    "i hope this works", 
   from:    "Matt <vicet3ch@gmail.com>", 
   to:      "Matt <mattjay01@gmail.com>",
   //cc:      "else <else@gmail.com>",
   subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });
*/
module.exports = EmailServer;
