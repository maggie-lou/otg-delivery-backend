//Push notifications
var PushController = require('./push');
var Parse = require('./parsing');
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
        request.orderStartTime = req.body.orderStartTime;
        request.orderEndTime = req.body.orderEndTime;
        request.item = req.body.item;
        request.status = req.body.status;
        request.deliveryLocationOptions = req.body.deliveryLocationOptions;
        request.timeProbabilities = req.body.timeProbabilities;

        //save request
        request.save(function(err, savedReq){
            //return the error in response if it exists
            if (err){
                console.log("Error creating new request");
                console.log(err);
                res.send(err);
                return;
            }

            PushController.sendPushToMyself("Request submitted. Start time: " + Parse.parseDateToTime(req.body.orderStartTime) + ". End time: " + Parse.parseDateToTime(req.body.orderEndTime) + "Item: " + req.body.item + " Meeting points: " + req.body.deliveryLocationOptions + " Request ID: " + savedReq.id);

            res.json({message: 'Request created!'});
        });
    })

    .get(function(req, res) {
      console.log("GET: /request");
const {ObjectId} = require('mongodb');
      var status = req.query.status || "";
      var excludingRequesterId = req.query.excluding || "000000000000000000000000";
      excludingRequesterId = ObjectId(excludingRequesterId);

      Request.find({
        'endTime': {$gte: Date.now()},
        'status': new RegExp(status),
        'requester': {$ne: excludingRequesterId},
      })
        .populate('orderDescription')
        .populate('requester')
        .exec(function(err, dbRequests) {
          if (err) {
            console.log("Error getting requests");
            res.send(err);
          }
          res.send(dbRequests);
        })
    })

router.route('/:id')
    .get(function(req, res) {
      console.log("GET: get request with id " + req.params.id);
      Request.findById(req.params.id)
        .populate('orderDescription')
        .populate('requester')
        .exec(function(err, request) {
          if (err) {
            console.log("Error getting request " + req.params.id);
            res.send(err);
          }
          res.send(request)
        })
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
          orderDescription: req.body.orderDescription,
          endTime: req.body.endTime,
          // status: req.body.status, // Bug where it's using cached old status
          deliveryLocation: req.body.deliveryLocation,
          deliveryLocationDetails: req.body.deliveryLocationDetails
        }},
      { new: true},

      function (err, updatedRequest) {
        if(err) {
          console.log("Error updating request.");
          res.send(err);
        } else {
          console.log("Request with ID " + req.params.id + " updated to");
          console.log(updatedRequest);
          res.send("Request with ID " + req.params.id + " updated");
        }
      });
  })


// Route that changes the status of a given request
router.route('/:id/status')
    .patch(function(req, res) {
      console.log("PATCH: Change request status for " + req.params.id + "to status " + req.body.status);

      Request.findById(req.params.id)
        .exec( (err, request) => {
          if(err) {
            console.log("Error updating request.");
            res.send(err);
            return;
          } else {
            request.status = req.body.status;
            request.save( (e) => {
              if(e) {
                res.status(400);
                res.send(`Could not update status for request ${req.params.id} to ${req.body.status}`);
                return;
              }
            });
            console.log("Request status for ID " + req.params.id + " updated");
            res.send("Request status for ID " + req.params.id + " updated");
          }
        });
    });


router.route('/task/:userId')
  .post(function(req, res) {
    console.log("GET: requests/task/" + req.params.userId);

    var eligiblePickupLocations = eval(req.body.eligiblePickupLocations); // Convert JSON to array
    Request.find({
      status: 'Pending',
      endTime: {$gte: Date.now()},
      requester: { $ne: req.params.userId },
      pickupLocation: { $in: eligiblePickupLocations },
    })
      .sort('orderTime')
      .populate('orderDescription')
      .populate('requester')
      .exec(function(err, dbRequests) {
        if (err) {
          res.send(err);
          return;
        }

        if (dbRequests.length == 0) {
          console.log("No available tasks");
        } else {
          console.log(dbRequests[0]);
        }
        res.send(dbRequests[0]);
      });
  })


module.exports = router;
