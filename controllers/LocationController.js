var express = require('express');

var Location = require('../models/Location');
const router = express.Router();

router.route('/')
  .post(function(req, res){
    console.log("POST: /locations");

    var location = new Location();
    location.name = req.body.name;
    location.latitude = req.body.latitude;
    location.longitude = req.body.longitude;

    location.save(function(err, locationDocument){
      if(err){
        res.send(err);
        return;
      }

      console.log(locationDocument);
      res.send(locationDocument);
    })
  })

module.exports = router;
