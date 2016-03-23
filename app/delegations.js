var Delegations = require('./models/delegation.js')
var Members = require('./models/member.js')
var ObjectId = require('mongodb').ObjectId
var _=require('underscore-node')
exports.getDelegations = function(req, res){
	Delegations.find({},{}, function(err, delegations){
		if (err) {
			res.json({status:'error'})
			return
		}

		if (delegations == undefined || delegations == null || delegations.length == 0) {
			res.json({status:'error', result:[]})
			return
		}
		var delegationsArray = []

		for (var i = 0; i < delegations.length; i++) {
			delegationsArray.push({
				id:delegations[i]._id,
				name:delegations[i].name,
				count:delegations[i].count,
				arrival:delegations[i].arrival,
				leave:delegations[i].leave,
			})
		}

		res.json({status:'success', result:delegationsArray})
	})
}

exports.insertDelegation = function(req, res){
	checkDelegationInfoValid(req, function(result){
		if (result.status == 'error') {
			res.json(result)
			return
		}
		_.defaults(req.query, {name:'', count:'', arrival:'', leave:''})
		var name = req.query.name,
			count = req.query.count,
			arrival = req.query.arrival,
			leave = req.query.leave

		var newDelegation = new Delegations({
			name:name,
			count:count,
			arrival:arrival,
			leave:leave
		})
	        
	    newDelegation.save(function(err, data){
	    	var result = {
	    		status:'success'
	        }

	        if (err) {
	            result.status = 'error'
	            res.json(result)
	            return
	        }else{
	            res.json(result)
	        }
	    })
	})
}

exports.updateDelegation = function(req, res){
	checkDelegationInfoValid(req, function(result){
		if (result.status == 'error') {
			res.json(result)
			return
		}
		var id = req.query.id,
			name = req.query.name,
			count = req.query.count,
			arrival = req.query.arrival,
			leave = req.query.leave
		Delegations.findById(ObjectId(id), function(err, delegation){
			if (err) {
				return
			}

			if (delegation == undefined || delegation == null) {
				res.json({status:'error'})
				return
			}

			delegation.name = name
			delegation.count = count
			delegation.arrival = arrival
			delegation.leave = leave
			delegation.save(function(err, data){
			    if (err) {
			      res.json({status:'error'})
			      return
			    }else{
			      res.json({status:'success'})
			    }
			})
		})
	})
}

exports.getDelegationById = function(req, res){
	var id = req.params.id

	Delegations.findById(id, function(err, delegation){
        if (err){
        	res.json({status:'error'})	
        	return
        }

        res.json({status:'success', result:delegation})
    })
}

exports.deleteDelegationById = function(req, res){
	var id = req.params.id

	Delegations.findById(id, function(err, delegation){
        if (err){
        	res.json({status:'error'})	
        	return
        }

        //-----------Delete Members--
		Members.find({did:id}, function(err, members){
			if (err) {
				res.json({status:'error'})
				return
			}

			if (members.length != 0 ) {
				for (var i = 0; i < members.length; i++) {
					members[i].remove(function(error, data){
			        	if (error){
			        		res.json({status:'error'})	
			        		return
			        	} 
			        })
				}
			}
			delegation.remove(function(error, data){
	        	if (error){
	        		res.json({status:'error'})	
	        		return
	        	} 
	        	res.json({status:'success'})
	        })
		})
    })
}

function checkDelegationInfoValid(req, callback){
    Delegations.find({name:req.query.name}, function(err, delegations){
        if (err){
            callback({status:'error'})
            return
        }
        if (delegations.length != 0){
            callback({status:'error', name_exist:true})
            return
        }        
        callback({status:'success'})
    })
}