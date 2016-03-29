var mongoose   = require('mongoose');
mongoose.connect('mongodb://fabiojenni:fabio8974@ds059135.mongolab.com:59135/dandongdb');

var db = mongoose.connection;
	db.on('error', function(err){
		console.log('DandongDB connection failed with error:', err);
	});
	db.once('open', function(){
		console.log('Connected to DandongDB.');
	})
var users = require('./users.js');
var proxy = require('./proxy.js');
var pushnotification = require('./pushnotification.js');
var delegations = require('./delegations.js');
var members = require('./members.js');
module.exports = function(router) {

	// ROUTES FOR OUR API
	// =============================================================================

	// middleware to use for all requests
	router.use(function(req, res, next) {
		// do logging
		console.log('Something is happening.');
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// proxy router
	router.route('/proxy')
		.get(proxy.getData)

	router.route('/user/login')
		.get(users.login);

	router.route('/user/register')
		.get(users.register);

	router.route('/user/:id')
		.get(users.getUserById);

	router.route('/user/update')
		.get(users.updateUserInfoById);

	router.route('/push')
		.get(pushnotification.checkBirthdayInfo);

	router.route('/delegations/insert')
		.get(delegations.insertDelegation)
	
	router.route('/delegations/update')
		.get(delegations.updateDelegation)

	router.route('/delegations/delete/:id')
		.get(delegations.deleteDelegationById)

	router.route('/delegations/:id')
		.get(delegations.getDelegationById)

	router.route('/delegations')
		.get(delegations.getDelegations)

	router.route('/members/insert')
		.post(members.insertMember)

	router.route('/members/update')
		.post(members.updateMember)

	router.route('/members/delete/:id')
		.get(members.deleteMemberById)

	router.route('/members/update/parents')
		.get(members.updateMemberParentData)

	router.route('/members/single/:id')
		.get(members.getMemberById)

	router.route('/members/:delegationId')
		.get(members.getMembers)
	
	router.route('/members/check/MemberName')
		.get(members.checkNameValid)
};