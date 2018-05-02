var express = require('express');

var User = require('../models/User');
const router = express.Router();

router.route('/')

    .get(function(req, res){

        console.log("GET: /users");

        //Grab a user from his ID 
        let userId = req.query.userId;

        User.findById(userId, function(err, user){
            res.send(user);
        })
    })

    .post(function(req, res){

        console.log("POST: /users");

        //Create user from criteria
        let deviceId = req.body.deviceId;
        let username = req.body.username;

        var user = new User();
        user.deviceId = deviceId;
        user.username = username;

        user.save(function(err, userDocument){

            if(err){
                res.send(err);
                return;
            }

            res.status(200);
            res.send(userDocument);

        })

    })

module.exports = router;