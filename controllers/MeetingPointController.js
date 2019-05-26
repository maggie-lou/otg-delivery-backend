var express = require('express');
const router = express.Router();

var MeetingPoint = require('../models/MeetingPoint');

router.route('/')
  .get(function(req, res) {
    console.log("GET: /meeting");
    MeetingPoint.find({})
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

    let meetingPoint = new MeetingPoint();
    meetingPoint.latitude = req.body.latitude;
    meetingPoint.longitude = req.body.longitude;
    meetingPoint.radius = req.body.radius;
    meetingPoint.requestId = req.body.requestId;
    meetingPoint.description = req.body.description;
    meetingPoint.startTime = req.body.startTime;
    meetingPoint.endTime = req.body.endTime;

    meetingPoint.save((err, meetingPointDocument) => {
      if(err){
        res.send(err);
        return;
      }

      console.log(meetingPointDocument);
      res.send(meetingPointDocument);
    })
  })

router.route('/:requestId')
  .get((req, res) => {
    const requestId = req.params.requestId;
    console.log(`GET: /meeting/${requestId}`)

    MeetingPoint.find({requestId: requestId})
      .exec((err, points) => {
        if (err) {
          res.send(err);
        } else {
          res.send(points);
        }
      })
  })

module.exports = router;
