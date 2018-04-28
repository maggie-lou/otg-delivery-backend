var express = require('express');
var Request = require('../models/Request');
const router = express.Router();

// FOR TESTING
var PushController = require('./push');

router.route('/test/:message')
  .post(function(req, res) {
   // accept push token in body
    var push_tokens = [req.body.pushtoken];
    PushController.sendPushWithMessage(push_tokens, req.params.message, res);
  })

router.route('/')
    //Create a new request
    .post(function(req, res) {
        console.log("POST: request for " + req.body.requester);
        console.log(req.body);

        var request = new Request();
        request.requester = req.body.requester;
        request.orderDescription = req.body.orderDescription;
        request.orderTime = Date.now();
        request.endTime = req.body.endTime;
        request.status = req.body.status;
        //save request
        request.save(function(err){
            //return the error in response if it exists
            if (err){
                console.log("Error creating new request");
                res.send(err);
            }
            res.json({message: 'Request created!'});
        });

    })

    //Get the latest active request
    .get(function(req, res){
        console.log("GET: requests")

        Request.find({status: 'Open', 'endTime': {$gte: Date.now()}}).sort('orderTime').exec(function(err, requests) {
            if (err){
                console.log("Error getting latest active request");
                res.send(err);
            }
            res.send(requests[0]);
        });
    });



router.route('/name/:name')

  // Route that accepts a user's name as a parameter
  // And returns all unexpired requests for that name
  .get(function(req, res) {
    console.log("GET: open requests for " + req.params.name);

    Request.find({ requester: req.params.name, status: { $ne: 'Completed' }, 'endTime': {$gte: Date.now()}}, function(err, requests) {
      if (err) {
        console.log("Error getting requests for " + req.params.name);
        res.send(err);
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
  Request.findOneAndUpdate( { _id: req.params.id}, {$set: { orderDescription: req.body.order}}, {"new": true}, function (err, oldRequest) {
    if(err) {
      console.log("Error updating request.");
      res.send(err);
    } else {
      console.log("Request with ID " + req.params.id + " updated");
      res.send("Request with ID " + req.params.id + " updated");
    }
  });
});




// //Route that accepts an incoming ID as a parameter
// //And then marks that request as accepted
// router.route('/accept/:id')
//     .get(function(req, res){
//         console.log("GET: Accept request " + req.params.id);
//
//         let requestId = req.params.id;
//         Request.findById(requestId, function(err, request){
//             if(err){
//                 console.log("Error accepting request " + req.params.id);
//                 res.send(err);
//             }
//
//             //check if the request is past the expiration time
//             let isExpired = Date.now() > request.endTime;
//
//             //If it is expired, return a 404 error with that message
//             if(isExpired){
//                 res.status(404);
//                 res.send("Request expired.")
//             } else if(request.status){
//                 res.status(404);
//                 res.send("Request already accepted.");
//                 return;
//             }
//
//             //Otherwise, change the status of the request, and accept it
//             request.status = 'Accepted';
//
//             request.save(function(err){
//                 if(err)
//                     console.log(err);
//                 else{
//                     res.send("Request: " + requestId + " accepted.")
//                     console.log("Request: " + requestId + " accepted.")
//                 }
//             });
//         })
//     })


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


router.route('/accept/name/:name')
  // Get all requests for which the input name accepted the task
  .get(function(req, res) {
    console.log("GET: accepted tasks for " + req.params.name);

    Request.find({ helper: req.params.name, status: 'Accepted', 'endTime': {$gte: Date.now()}}, function(err, requests) {
    // Request.find({ helper: req.params.name}, function(err, requests) {
      if (err) {
        console.log("Error getting accepted tasks for " + req.params.name);
        res.send(err);
      }
      res.send(requests);
      });
  })

  // Allow helper to accept a task
    .post(function(req, res) {
        Request.findById(req.body.id, function(err, request){
            if(err){
                console.log("Error accepting request " + req.body.id);
                res.send(err);
            }

            //check if the request is past the expiration time
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
            request.helper = req.params.name;

            request.save(function(err){
                if(err)
                    console.log(err);
                else{
                    res.send("Accepted request with ID " + req.body.id + "by " + req.params.name);
                    console.log("Accepted request with ID " + req.body.id + "by " + req.params.name);
                }
            });
        });

    })

module.exports = router;
