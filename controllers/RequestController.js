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

      var request = new Request();
      request.requester = req.body.requester;
      request.helper = req.body.helper;
      request.orderStartTime = req.body.orderStartTime;
      request.orderEndTime = req.body.orderEndTime;
      request.item = req.body.item;
      request.status = req.body.status;
      request.meetingPoint = req.body.meetingPoint;
      request.timeProbabilities = req.body.timeProbabilities;
      request.pickupLocation = req.body.pickupLocation;
      request.price = req.body.price;
      request.description = req.body.description;
      request.eta = req.body.eta;

      //save request
      request.save(function(err, savedReq){
        if (err){
            console.log("Error creating new request");
            console.log(err);
            res.send(err);
        } else {
          res.send(savedReq._id);
        }
      });
    })

  //GET: Return requests
  .get((req, res) => {
    console.log("GET: /request");
    const {ObjectId} = require('mongodb');
    //const status = req.query.status || "";
    let excludingRequesterId = req.query.excluding || "000000000000000000000000";
    excludingRequesterId = ObjectId(excludingRequesterId);

    Request.find({
      //'endTime': {$gte: Date.now()},
      //'status': new RegExp(status),
      'requester': {$ne: excludingRequesterId}, //not returning requester's requests
    })
      .populate('requester')
      .populate('helper')
      .exec(function(err, dbRequests) {
        console.log("The retrieved requests are" + dbRequests)
        if (err) {
          console.log("Error getting requests");
          res.send(err);
        } else {
          res.send(dbRequests);
        }
      })
  })

router.route('/all')
  .get((req, res) => {
    Request.find()
      .exec((err, requests) => {
        if (err) {
          res.send(err);
        } else {
          res.send(requests);
        }
      })
    })
  .delete((req, res) => {
    Request.deleteMany()
      .exec((err, requests) => {
        if (err) {
          res.send(err)
        } else {
          res.send("All gone!")
        }
      })
  })

router.route('/:id')
  .get(function(req, res) {
    console.log("GET: get request with id " + req.params.id);
    Request.findById(req.params.id)
      .populate('requester')
      .populate('helper')
      .exec(function(err, request) {
        if (err) {
          console.log("Error getting request " + req.params.id);
          res.send(err);
        } else {
          res.send(request);
        }
      })
    })

  .delete(function(req, res){
    let requestId = req.params.id;
    console.log("DELETE: delete request with id " + req.params.id);

    Request.deleteOne({ _id: requestId}, function(err){
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }

      res.json({message: 'Request deleted!'});
    });
  })

  .patch(function(req, res) {
    console.log("POST: Update request " + req.params.id);
    Request.findOneAndUpdate(
      { _id: req.params.id},
      {$set:
        {
          requester: req.body.requester,
          helper: req.body.helper,
          endTime: req.body.endTime,
          status: req.body.status,
          meetingPoint: req.body.meetingPoint,
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
        .exec((err, request) => {
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

router.route('/:id/price')
.patch(function(req, res) {
  console.log("PATCH: Change price for " + req.params.id + "to " + req.body.price);

  Request.findById(req.params.id)
    .exec( (err, request) => {
      if(err) {
        console.log("Error updating request.");
        res.send(err);
        return;
      } else {
        request.price = req.body.price;
        request.save( (e) => {
          if(e) {
            res.status(400);
            res.send(`Could not update price for request ${req.params.id} to ${req.body.price}`);
            return;
          }
        });
        console.log("Request price for ID " + req.params.id + " updated");
        res.send("Request price for ID " + req.params.id + " updated");
      }
    });
});

router.route('/:id/removeHelper')
  .patch((req, res) => {
    console.log("PATCH: Remove helper for request " + req.params.id);
    Request.findById(req.params.id)
      .exec((err, request) => {
        if (err) {
          res.send(err)
        } else {
          request.helper = request.requester
          request.save((err) => {
            if (err) {
              res.send("Could not remove helper from request " + req.params.id)
            } else {
              res.send("Succeeded in removing helper.")
            }
          })
        }
      })
  })

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
      .populate('requester')
      .populate('helper')
      .exec(function(err, dbRequests) {
        if (err) {
          res.send(err);
          return;
        }

        if (dbRequests.length == 0) {
          console.log("No available tasks");
        } else {
          res.send(dbRequests[0]);
        }
      });
  })


module.exports = router;
