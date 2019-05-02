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

      // console.log(locationDocument); // Note: Very noisy
      res.send(locationDocument);
    })
  })

  .get(function(req, res) {
    console.log("GET: /location");
    Location.find({})
      .exec(function(err, locations) {
        if (err) {
          console.log("Error getting locations");
          res.send(err);
        }
        res.send(locations);
      })
  })

  .delete((req, res) => {
    console.log("DELETE: /location");
    Location.deleteMany({})
      .exec((err, locations) => {
        if (err) {
          console.log("Error deleting locations");
          res.send(err);
        }
        res.send(locations);
      })
  })

router.route('/name')
  .get((req, res) => {
    console.log("GET: /locations/name");
    Location.findOne({'name': req.body.name})
      .exec(function(err, location) {
        if (err) {
          console.log("Error getting location");
          res.send(err);
        }
        res.send(location);
      })
  })
  .delete((req, res) => {
    console.log("DELETE: /locations/name");
    Location.deleteOne({'name': req.body.name})
    .exec(function(err, location) {
      if (err) {
        console.log("Error deleting location");
        res.send(err);
      }
      res.send(location);
    })
  })

module.exports = router;
