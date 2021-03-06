var express = require('express');
const router = express.Router();

var Meeting = require('../models/MeetingPoint');

router.route('/')
  .get(function(req, res) {
    console.log("GET: /meeting");
    Meeting.find({})
      .exec(function(err, dbRequests) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        console.log(dbRequests);
        res.send(dbRequests);
      })
  })

  .post(function(req, res){
    console.log("POST: /meeting");

    var meetingPoint = new Meeting();
    meetingPoint.name = req.body.name;
    meetingPoint.latitude = req.body.latitude;
    meetingPoint.longitude = req.body.longitude;

    meetingPoint.save(function(err, meetingPointDocument){
      if(err){
        res.send(err);
        return;
      }

      console.log(meetingPointDocument);
      res.send(meetingPointDocument);
    })
  })


module.exports = router;
