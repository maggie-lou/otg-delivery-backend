var express = require('express');
var LoggingEvent = require('../models/LoggingEvent');
const router = express.Router();


// Logging of Geofence entrances
router.route('/')

    //create an event log
    .post(function(req, res){

        console.log("POST: logging")

        var loggingEvent = new LoggingEvent();
        loggingEvent.requesterName = req.body.requester;
        loggingEvent.location = req.body.location;
        loggingEvent.eventTime = Date.now();
        loggingEvent.eventType = req.body.eventType;
        loggingEvent.details = req.body.details;

        //save event
        loggingEvent.save(function(err){
            //return the error in response if it exists
            if (err){
                console.log("Error logging event with type " + req.body.eventType);
                res.send(err);
            }

            res.json({message: 'Event created!'});
        });

    })

module.exports = router;
