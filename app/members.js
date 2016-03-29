var Members = require('./models/member.js')
var ObjectId = require('mongodb').ObjectId

exports.getMembers = function(req, res){
	var did = req.params.delegationId

	Members.find({did:did}, function(err, members){
		if (err) {
			res.json({status:'error'})
			return
		}

		if (members == undefined || members == null || members.length == 0) {
			res.json({status:'error', result:[]})
			return
		}
		var membersArray = []

		for (var i = 0; i < members.length; i++) {
			membersArray.push({
				id:members[i]._id,
				did:members[i].did,
				name:members[i].name,
				sex:members[i].sex,
				dob:members[i].dob,
				job:members[i].job,
				party:members[i].party,
				school:members[i].school,
				university:members[i].university,
				fname:members[i].fname,
				fjob:members[i].fjob,
				mname:members[i].mname,
				mjob:members[i].mjob,
				photo:members[i].photo
			})
		}

		res.json({status:'success', result:membersArray})
	})
}

exports.insertMember = function(req, res){
/*	checkMemberInfoValid(req, function(result){
		if (result.status == 'error') {
			res.json(result)
			return
		}*/

		var memberInfo = JSON.parse(req.body.body);

		var did = memberInfo.did,
			name = memberInfo.name,
			sex = memberInfo.sex,
			dob = memberInfo.dob,
			job = memberInfo.job,
			party = memberInfo.party,
			school = memberInfo.school,
			university = memberInfo.univ,
			fname = memberInfo.fname,
			fjob = memberInfo.fjob,
			mname = memberInfo.mname,
			mjob = memberInfo.mjob,
			photo = memberInfo.photo

		var newMember = new Members({
			did:did,
			name:name,
			sex:sex,
			dob:dob,
			job:job,
			party:party,
			school:school,
			university:university,
			fname:fname,
			fjob:fjob,
			mname:mname,
			mjob:mjob,
			photo:photo
		})
	        
	    newMember.save(function(err, data){
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
//	})
}

exports.updateMember = function(req, res){
	var memberInfo = JSON.parse(req.body.body);
	var id = memberInfo.id,
		name = memberInfo.name,
		sex = memberInfo.sex,
		dob = memberInfo.dob,
		job = memberInfo.job,
		party = memberInfo.party,
		school = memberInfo.school,
		university = memberInfo.univ,
		fname = memberInfo.fname,
		fjob = memberInfo.fjob,
		mname = memberInfo.mname,
		mjob = memberInfo.mjob,
		photo = memberInfo.photo,
		changed = memberInfo.photoChanged
	Members.findById(ObjectId(id), function(err, member){
		if (err) {
			return
		}

		if (member == undefined || member == null) {
			res.json({status:'error'})
			return
		}

		member.name = name
		member.sex = sex
		member.dob = dob
		member.job = job
		member.party = party
		member.school = school
		member.university = university
		member.fname = fname
		member.fjob = fjob
		member.mname = mname
		member.mjob = mjob
		if (changed=='true') member.photo = photo
		member.save(function(err, data){
		    if (err) {
		      res.json({status:'error'})
		      return
		    }else{
		      res.json({status:'success'})
		    }
		})
	})
}

exports.updateMemberParentData = function(req, res){
	var id = req.query.id,
		fjob = req.query.fjob,
		mjob = req.query.mjob
	Members.findById(id, function(err, member){
        if (err){
        	res.json({status:'error'})	
        	return
        }

		member.fjob = fjob
		member.mjob = mjob
		member.save(function(err, data){
		    if (err) {
		      res.json({status:'error'})
		      return
		    }else{
		      res.json({status:'success'})
		    }
		})
    })
}

exports.getMemberById = function(req, res){
	var id = req.params.id

	Members.findById(id, function(err, member){
        if (err){
        	res.json({status:'error'})	
        	return
        }

        res.json({status:'success', result:member})
    })
}

exports.deleteMemberById = function(req, res){
	var id = req.params.id

	Members.findById(id, function(err, member){
        if (err){
        	res.json({status:'error'})	
        	return
        }
        member.remove(function(error, data){
        	if (error){
        		res.json({status:'error'})	
        		return
        	} 
        	res.json({status:'success'})
        })
    })
}

function checkMemberInfoValid(req, callback){
	var memberInfo = JSON.parse(req.body.body);
    Members.find({name:memberInfo.name}, function(err, members){
        if (err){
            callback({status:'error'})
            return
        }
        if (members.length != 0){
            callback({status:'error', name_exist:true})
            return
        }        
        callback({status:'success'})
    })
}

exports.checkName = function(req, res){
	var new_name = req.query.name;
    Members.find({name:new_name}, function(err, members){
        if (err){
            res.json({status:'error'})
            return
        }
        if (members.length != 0){
            res.json({status:'error', name_exist:true})
            return
        }
        res.json({status:'success'})
    })
}