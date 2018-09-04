//Push notifications
var PushController = require('./push');
var express = require('express');

var Request = require('../models/request');
var User = require('../models/User');
const router = express.Router();


router.route('/')
    //POST: create a new request
    .post(function(req, res) {
        console.log("POST: request for " + req.body.requester);
        console.log(req.body);

        var request = new Request();
        request.requester = req.body.requester;
        request.helper = req.body.helper;
        request.orderDescription = req.body.orderDescription;
        request.endTime = req.body.endTime;
        request.status = req.body.status;
        request.deliveryLocation = req.body.deliveryLocation;
        request.deliveryLocationDetails = req.body.deliveryLocationDetails;

        //save request
        request.save(function(err){
            //return the error in response if it exists
            if (err){
                console.log("Error creating new request");
                res.send(err);
                return;
            }
            res.json({message: 'Request created!'});
        });
    })

    .get(function(req, res) {
      var status = req.query.status || "";

      Request.find({
        'endTime': {$gte: Date.now()},
        'status': new RegExp(status),
      }, function(err, dbRequests) {
        if (err) {
          console.log("Error getting requests");
          res.send(err);
        }
        res.send(dbRequests);
      });
    })

router.route('/:id')
    .get(function(req, res) {
      console.log("GET: get request with id " + req.params.id);
      Request.findById(req.params.id, function(err, coffeeRequest) {
        if (err) {
          console.log("Error getting request " + req.params.id);
          res.send(err);
        }
        res.send(coffeeRequest)
      });
    })

    .delete(function(req, res){
        let requestId = req.params.id;
        console.log("DELETE: delete request with id " + req.params.id);

        Request.remove({ _id: requestId}, function(err){
          if (err) {
            console.log("ERROR: could not delete given resource.")
            return;
          }
        });

        res.json({message: 'Request deleted!'});
    })

  .patch(function(req, res) {
    console.log("POST: Update request " + req.params.id);
    Request.findOneAndUpdate(
      { _id: req.params.id},
      {$set:
        {
          requester: req.body.requester,
          helper: req.body.helper,
          orderDescription: req.body.orderDescription,
          endTime: req.body.endTime,
          status: req.body.status,
          deliveryLocation: req.body.deliveryLocation,
          deliveryLocationDetails: req.body.deliveryLocationDetails
        }},
      {"new": true},

      function (err, oldRequest) {
        if(err) {
          console.log("Error updating request.");
          res.send(err);
        } else {
          console.log("Request with ID " + req.params.id + " updated");
          res.send("Request with ID " + req.params.id + " updated");
        }
      });
  })


// Route that changes the status of a given request
router.route('/:id/status')
    .patch(function(req, res) {
        console.log("POST: Change request status for " + req.params.id);

        Request.findOneAndUpdate( { _id: req.params.id}, {$set: { status: req.body.status}}, {"new": true}, function (err, newRequest) {
          if(err) {
            console.log("Error updating request.");
            res.send(err);
          } else {
            console.log("Request status for ID " + req.params.id + " updated");
            res.status(200);
            res.send("Request status for ID " + req.params.id + " updated");
          }
        });

    })


router.route('/task/:userId')
  .get(function(req, res) {
    console.log("GET: requests/task/" + req.params.userId);

    Request.find({
      status: 'Pending',
      endTime: {$gte: Date.now()},
      requester: { $ne: req.params.userId }
    }).sort('orderTime').exec(function(err, dbRequests) {
      if (err) {
        res.send(err);
        return;
      }

      res.send(dbRequests[0]);
    });
  })


module.exports = router;
