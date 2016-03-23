var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var membersSchema = new Schema({
		did:String,    // Delegation Id of Single Member
		name:String,   // Name of Member
		sex:String,		// Sex
		dob:String,    // Birthday
		job:String,    // Job
		party:String,  // Party
		school:String, // School
		university:String,//University
		fname:String, // Name of his father
		fjob:String,  // Job of his father
		mname:String, // Name of his mother
		mjob:String, // Job of his mother
		photo:String // His photo
}, {collection: 'members' });

module.exports = mongoose.model('Members', membersSchema);
          