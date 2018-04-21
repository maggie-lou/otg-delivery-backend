var express = require('express');
var LoggingEvent = require('../models/LoggingEvent');
const router = express.Router();


// Logging of Geofence entrances
router.route('/')

    //create an event log
    .post(function(req, res){

        console.log("POST: logging")

        var loggingEvent = new LoggingEvent();
        loggingEvent.username = req.body.username;
        loggingEvent.locationEntered = req.body.locationEntered;
        loggingEvent.eventTime = Date.now();
        loggingEvent.eventType = req.body.eventType;
        loggingEvent.requestId = req.body.requestId;

        //save event
        loggingEvent.save(function(err){
            //return the error in response if it exists
            if (err){
                console.log("Error logging geofence entrance event.");
                res.send(err);
            }

            res.json({message: 'Event created!'});
        });

    })

module.exports = router;
