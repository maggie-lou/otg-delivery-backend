var express = require('express');

var User = require('../models/User');
var Request = require('../models/request');
var PushController = require('./push');
const router = express.Router();

router.route('/')
  .post(function(req, res){
    console.log("POST: /users");

    var user = new User();
    user.deviceId = req.body.deviceId;
    user.username = req.body.username;
    user.phoneNumber = req.body.phoneNumber;

    PushController.sendPushToMyself(`${req.body.username} signed up!`);

    user.save(function(err, userDocument){
      if(err){
        res.send(err);
        return;
      }

      console.log(userDocument);
      res.send(userDocument);
    })
  })


router.route('/:id')
  .get(function(req, res) {
    console.log("GET: /users");

    User.findById(req.params.id, function(err, user){
      if (err) {
        console.log("Error getting user " + req.params.id);
        res.send(err);
        return;
      }
      res.send(user);
    })
  })


router.route('/:id/requests')
  .get(function(req, res) {
    console.log("GET: /users/" + req.params.id +"/requests");

    // Open and expired
    // OR Non-Pending, non-completed
    Request.find({
      $and: [{
        requester: req.params.id,
      },
        {$or: [{
          status: 'Pending', 'endTime': {$gte: Date.now()}
        }, {
          status: {$nin: ["Pending", "Completed"]}
        }]}]})
      .populate('orderDescription')
      .populate('requester')
      .exec(function(err, requests) {
        if (err) {
          console.log("Error getting requests for " + req.params.id);
          res.send(err);
          return;
        }
        res.send(requests);
      })
  })


router.route('/:id/tasks')
  .get(function(req, res) {
    console.log("GET: /users/" + req.params.id +"/tasks");

    Request.find({ helper: req.params.id, status: {$ne: "Completed"} })
      .populate('orderDescription')
      .populate('requester')
      .exec(function(err, requests) {
        if (err) {
          console.log("Error getting tasks for " + req.params.id);
          res.send(err);
          return;
        }
        res.send(requests);
      })
  })


router.route('/:userId/accept/:requestId')
  .patch(function(req, res) {
    console.log("PATCH: /users/" + req.params.userId +"/accept/" + req.params.requestId);
    Request.findById(req.params.requestId)
      .populate('requester')
      .exec( (err, request) => {
        if (err) {
          res.status(500);
          res.send(`Could not find request ${req.params.requestId}. Cannot be accepted.`);
          return;
        } else if (Date.now() > request.endTime) {
          res.status(405);
          res.send("Request " + req.params.requestId + " has already expired. Cannot be accepted.");
          return;
        } else if (request.status != 'Pending') {
          res.status(405);
          res.send("Request " + req.params.requestId + " has already been accepted. Cannot be re-accepted.");
          return;
        }


          User.findById(req.params.userId, (err, helper) => {
            if (err) {
              res.status(400);
              res.send("Could not find helper " + req.params.userId + ", so request " + req.params.requestId + " could not be accepted. Its status remains pending.");
              return;
            }
            request.status = 'Accepted by ' + helper.username;
            request.helper = req.params.userId;
            request.deliveryLocation = req.body.meetingPoint;

            request.save( (err) => {
              if (err) {
                res.status(400);
                res.send("Could not accept request " + requestId + ". Its status remains pending.");
                return;
              }
              var pushNotificationMessage = `${ helper.username } accepted your request! Please meet them at ${req.body.meetingPoint} when they text you!`;
              PushController.sendPushWithMessage( [request.requester.deviceId], pushNotificationMessage);

            PushController.sendPushToMyself(`${helper.username} accepted a task submitted by ${request.requester.username}!`);
            res.send("Accepted request with ID " + req.params.requestId + " by " + req.params.userId);
          });
        });

      });
  })


// Let a helper cancel his/her ability to complete a task
router.route('/:userId/removeHelper/:requestId')
  .patch(function(req, res) {
    console.log("PATCH: /users/" + req.params.userId +"/removeHelper/" + req.params.requestId);
    Request.findOneAndUpdate( { _id: req.params.requestId}, {$set: { helper: null, status: "Pending"}})
      .populate('requester')
      .exec(function(err, oldRequest) {
        if(err) {
          console.log("Error updating request.");
          res.send(err);
          return;
        } else {
          var helperId = oldRequest.helper;
          User.findById(helperId, function(err, helperDoc){
            if(err){
              console.log("Error getting former helper for a canceled task.");
              res.send(err);
              return;
            }

            let pushNotificationMessage = `Unfortunately, ${ helperDoc.username } can no longer deliver your request for a ${ oldRequest.orderDescription }. We apologize for the inconvenience and your request can still be accepted by other helpers.`;

            let deviceToken = [oldRequest.requester.deviceId];
            PushController.sendPushWithMessage(deviceToken, pushNotificationMessage);

            res.send("Removed helper " + helperId + " from request with ID " + req.params.requestId);
          });
        }
      })
  })

router.route('/sendNotification')
  .post(function(req, res){
    console.log("POST: /users/sendNotification");

    PushController.sendPushWithMessage(req.body.deviceId, req.body.message);
    res.send("Sent notification to Device Id " + req.body.deviceId);
    })

module.exports = router;
