var express = require('express');
const router = express.Router();

var Feedback = require('../models/Feedback');
var User = require('../models/User');
var PushController = require('./push');

router.route('/')
    .post(function(req, res){

        console.log("POST: posting feedback");

        var feedback = new Feedback()

        feedback.feedbackText = req.body.feedbackText;

        console.log(req.body);
        console.log("Feedback text: " + req.body.feedbackText)

        feedback.save(function(error){
            res.status(200);
            res.send("Feedback added!")
        });

    });


router.route('/sendPush')
  .post(function(req, res) {
    User.
      find({}).
      exec(function(err, users) {
        var deviceIds = users.map(function(user) {
          return user.deviceId;
        });

        PushController.sendPushWithMessage(deviceIds, req.body.message);
        res.send("Push notifications sent to " + deviceIds);
      })
  })

module.exports = router;
