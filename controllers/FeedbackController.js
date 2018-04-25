var express = require('express');
var Feedback = require('../models/Feedback');
const router = express.Router();

router.route('/')
    .post(function(req, res){

        console.log("POST: posting feedback");

        var feedback = new Feedback()
        
        feedback.feedbackText = req.body.feedbackText;

        console.log(req.body);
        console.log("Feedback text: " + req.body.feedbackText)

        feedback.save(function(error){
            res.status(200);
            res.send("Feedback added!")
        });

    });

module.exports = router;