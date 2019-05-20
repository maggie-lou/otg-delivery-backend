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

    let meetingPoint = new Meeting();
    meetingPoint.name = req.body.name;
    meetingPoint.latitude = req.body.latitude;
    meetingPoint.longitude = req.body.longitude;
    meetingPoint.requestId = req.body.requestId;

    meetingPoint.save(function(err, meetingPointDocument){
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

    meetingPoint.find({requestId: requestId})
      .exec((err, points) => {
        if (err) {
          res.send(err);
        } else {
          res.send(points);
        }
      })
  })

module.exports = router;
