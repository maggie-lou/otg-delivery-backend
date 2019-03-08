var express = require('express');
var PushController = require('./push');
const router = express.Router();


router.route('/accept/:requestId')
  .post(function(req, res) {
    console.log("POST: /researcher/" + "/accept/" + req.params.requestId);
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

        request.status = `Accepted by Helper (~15min to Meeting)`;
        request.deliveryLocation = req.body.meetingPoint;

        request.save( (err) => {
          if (err) {
            res.status(400);
            res.send("Could not accept request " + requestId + ". Its status remains pending.");
            return;
          }
          var pushNotificationMessage = `Your helper is on their way! Your meeting point is: ${req.body.meetingPoint}. Estimated delivery time: Within 15 minutes.`;
          PushController.sendPushWithMessage( [request.requester.deviceId], pushNotificationMessage);

          res.send("Accepted request with ID " + req.params.requestId );
        });
      });

  })

module.exports = router;
