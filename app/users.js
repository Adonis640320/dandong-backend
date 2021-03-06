var express = require('express')
var app = express()
var User = require('./models/user.js')
var _=require('underscore-node')

exports.login = function(req, res){
    if (req.query['name'] == '' || req.query['password'] == ''){
        return
    }
    User.find({name:req.query.name}, function(err, user) {
        if (err) return
        // object of the user
        if (user.length == 0 || user == undefined || user == null) {
            res.json({status:'error', username_exist:true, password_wrong:false});
            return
        }
        if(user[0].password == req.query.password){
            user[0].token = req.query.token
            user[0].save(function(error, data){
                
            })   
            var result = {
                status:'success',
                userid:user[0]._id
            }
            res.json(result)
        } 
        else{
            res.json({status:'error', username_exist:false, password_wrong:true})
        }
    })
}

exports.register = function(req, res){
    checkUserInfoValid(req, function(result){
        if (result.status == 'error') {
            res.json(result)
            return
        }

        if (req.query.name == '' || req.query.password == ''){
            return
        }
        var newUser = new User({
            name:req.query.name,
            password:req.query.password,
            token:req.query.token
        })
        newUser.save(function(err, data){
            if (err) {
                console.log("Creating New User error")
                return
            }else{
                var newResult = {
                    status:result.status,
                    userid:newUser._id
                }
                res.json(newResult)
            }
        })
    })
}

exports.getUserById = function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err) return
        res.json(user)
    })
}

exports.updateUserInfoById = function(req, res){
    if (req.query['name'] == '' || req.query['password'] == ''){
        return
    }

    User.findById(req.query.id, function(err, user){
        if (err) return
        user.name = req.query.name
        user.password = req.query.password
        user.save(function(error, data){
            if (error) {
                res.json({status:'error'})   
                return
            }
            res.json({status:'success'})
        })
    })
}

function checkUserInfoValid(req, callback){
    User.find({name:req.query.name}, function(err, user){
        if (err){
            callback({status:'error'})
            return
        }
        if (user.length != 0){
            callback({status:'error', username_exist:true})
            return
        }        
        callback({status:'success'})
    })
}