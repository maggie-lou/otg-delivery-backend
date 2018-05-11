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

    //GET: get oldest request that hasn't expired
    .get(function(req, res){
        console.log("GET: /requests")

        Request.find({status: 'Pending', 'endTime': {$gte: Date.now()}}).sort('orderTime').exec(function(err, requests) {
            if (err){
                console.log("Error getting latest active request");
                res.send(err);
                return;
            }
            res.send(requests[0]);
        });
    });



router.route('/userid/:userId')

  // Route that accepts a user's name as a parameter
  // And returns all unexpired requests for that name
  .get(function(req, res) {
    console.log("GET: pending requests for " + req.params.userId);

    Request.find({ requester: req.params.userId, status: { $ne: 'Completed' }, 'endTime': {$gte: Date.now()}}, function(err, requests) {
      if (err) {
        console.log("Error getting requests for " + req.params.userId);
        res.send(err);
        return;
      }
      res.send(requests);
      });
    })




router.route('/id/:id')
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
        console.log("DELETE: delete request")

        let requestId = req.params.id;
        Request.remove({ _id: requestId}, function(err){
            console.log("ERROR: could not delete given resource.")
        });

        res.json({message: 'Request deleted!'});
    })


// Updates order description for request with given id
router.post('/update/:id', function(req, res) {
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
            console.log("Updated request with params: " + req.body)
            res.send("Request with ID " + req.params.id + " updated");
        }
    });
});


// Route that changes the status of a given request
router.route('/status/:id')
    .post(function(req, res) {
        console.log("POST: Change request status for " + req.params.id);

        Request.findOneAndUpdate( { _id: req.params.id}, {$set: { status: req.body.status}}, {"new": true}, function (err, newRequest) {
          if(err) {
            console.log("Error updating request.");
            res.send(err);
          } else {
            console.log("Request status for ID " + req.params.id + " updated");
            res.send("Request status for ID " + req.params.id + " updated");

            // Right now, not checking if you are trying to accept an expired request
          }
        });

    })


router.route('/accept/:userId')
  // Get all requests for which the input name accepted the task
  .get(function(req, res) {
    console.log("GET: accepted tasks for " + req.params.userId);

    Request.find({ helper: req.params.userId, status: 'Accepted', 'endTime': {$gte: Date.now()}}, function(err, requests) {
      if (err) {
        console.log("Error getting accepted tasks for " + req.params.userId);
        res.send(err);
      }
      res.send(requests);
    });
  })

    //Allow helper to accept a task
    .post(function(req, res) {
        Request.findById(req.body.id)
            .populate('requester')
            .exec(function(err, request){

                if(err){
                    console.log("Error accepting request " + req.body.id);
                    console.log(err);
                    res.send(err);
                    return;
                }

                //Check if the request is past the expiration time
                let isExpired = Date.now() > request.endTime;

                //If it is expired, return a 404 error with that message
                if(isExpired){
                    res.status(404);
                    res.send("Request expired - cannot accept.")
                } else if(request.status == 'Accepted'){
                    res.status(404);
                    res.send("Request already accepted.");
                    return;
                }

                //Otherwise, change the status of the request, and accept it
                request.status = 'Accepted';
                request.helper = req.params.userId;

                request.save(function(err){

                    if(err)
                        console.log(err);

                    else{

                        console.log("USER ID PARAMSSS: " + req.params.userId);
                        User.findById(req.params.userId, function(err, helperDoc){

                            if(err){
                                console.log(err);
                                res.send(err);
                                return;
                            }

                            //Grab our requester, and their device ID
                            console.log("Requester: " + request.requester.deviceId);
                            console.log("Helper: -=-=-=-");
                            console.log(helperDoc);
                            //Notify user that his order was accepted
                            let pushNotificationMessage = `${ helperDoc.username } accepted order request for ${ request.orderDescription }!`;

                            console.log(`SENDING PUSH NOTIFICATION FOR USER: ${ pushNotificationMessage }`);
                            let deviceToken = [request.requester.deviceId];
                            PushController.sendPushWithMessage(deviceToken, pushNotificationMessage);

                            res.send("Accepted request with ID " + req.body.id + " by " + req.params.userId);
                            console.log("Accepted request with ID " + req.body.id + " by " + req.params.userId);

                        });


                    }
                });
            });
    })



router.route('/helper/cancel/:requestId')
    // Let a helper cancel his/her ability to complete a task
    .delete(function(req, res) {
      // Remove a helper's name from the database entry
        console.log("DELETE: Remove helper from request " + req.params.requestId);

        Request.findOneAndUpdate( { _id: req.params.requestId}, {$set: { helper: null, status: "Pending"}}, {"new": true}, function (err, newRequest) {
          if(err) {
            console.log("Error updating request.");
            res.send(err);
            return;
          } else {
            console.log("Removed helper for request ID " + req.params.requestId);
            res.send("Removed helper for request ID " + req.params.requestId);

            // Right now, not checking if you are trying to accept an expired request
          }
        });
    })

module.exports = router;
