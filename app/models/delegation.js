var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var delegationsSchema = new Schema({
	name:String,
	count:String,
	arrival:String,
	leave:String
}, {collection: 'delegations' });

module.exports = mongoose.model('Delegations', delegationsSchema);