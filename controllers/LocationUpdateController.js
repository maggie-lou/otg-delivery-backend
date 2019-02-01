var express = require('express');

var LocationUpdate = require('../models/LocationUpdate');
const router = express.Router();

router.route('/')
  .post(function(req, res){
    console.log("POST: /locupdates");

    var locationUpdate = new LocationUpdate();
    locationUpdate.latitude = req.body.latitude;
    locationUpdate.longitude = req.body.longitude;
    locationUpdate.speed = req.body.speed;
    locationUpdate.direction = req.body.direction;
    locationUpdate.uncertainty = req.body.uncertainty;
    locationUpdate.timestamp = req.body.timestamp;
    locationUpdate.gmtOffset = req.body.gmtOffset;
    locationUpdate.userId = req.body.userId;

    locationUpdate.save(function(err, locationUpdateDocument){
      if(err){
        res.send(err);
        return;
      }

      // console.log(locationUpdateDocument);
      res.send(locationUpdateDocument);
    })
  })

  .get(function(req, res) {
    console.log("GET: /locupdates");
    LocationUpdate.find({})
      .exec(function(err, dbRequests) {
        if (err) {
          console.log("Error getting requests");
          res.send(err);
        }
        res.send(dbRequests);
      })
  })

module.exports = router;
