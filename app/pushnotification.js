var getJSON = require('get-json');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Members = require('./models/member.js')
var moment = require('moment');

var CronJob = require('cron').CronJob;

var dobAlarm = new CronJob({
	cronTime:'30 1,4,7 * * *',
	onTick:function(){
		checkBirthdayInfo()
	},
	start:true
});

dobAlarm.start();

//----APPLE PUSH SERVICES----////////
var apn = require('apn');
process.env['DEBUG'] = 'apn';
var options = {
	production: false,
	gateway: 'gateway.sandbox.push.apple.com',
	cert: 'app/dev_cert.pem',
	key: 'app/dev_key.pem',
	passphrase: "ramin"
};
var apnConnection = new apn.Connection(options);
var checkBirthdayInfo = exports.checkBirthdayInfo = function(req, res){
	console.log('--------Send Push Notification---------')
	console.log(new Date())
	Members.find({},{}, function(err, members){
		if (err) {
			return
		}

		if (members == undefined || members == null || members.length == 0) {
			return
		}
		var	today = new Date()
		var	todayDay = today.getDate(),
			todayMonth = today.getMonth() + 1
		var nameArray = []
		for (var i = 0; i < members.length; i++) {
			var name = members[i].name,
				dob = members[i].dob,
				dobmonth = parseInt(dob.substr(5, 2)),
				dobday = parseInt(dob.substr(8,2))
			if (dobmonth == todayMonth && dobday == todayDay)  nameArray.push(name)
		}
		User.find({},{}, function(error, users){
			if (error) return
			if (users == undefined || users.length == 0) return
			for (var i = 0; i < users.length; i++) {
				for (var j = 0; j < nameArray.length; j++) {
					sendPushNotification(users[i].token, '오늘은 ' + nameArray[j] + '동지의 생일입니다.' )
				}
			}		
		})
	})
}

function sendPushNotification(tokenId, message){
	var deviceToken = tokenId;
	var myDevice = new apn.Device(deviceToken);
	var note = new apn.Notification();
	note.expiry = Math.floor(Date.now() / 1000) + 7200;// Expires 2 hour from now.
	note.sound = "ping.aiff";
	note.alert = message;
	apnConnection.pushNotification(note, myDevice);
}