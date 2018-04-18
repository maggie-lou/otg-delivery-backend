//web server imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//so the server can handle POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var PORT = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res){
	console.log("API has launched.");
	res.json({message: "API Base Endpoint."});
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://samboozled:sabrina@ds247648.mlab.com:47648/otg-coffee');

var Request = require('./models/request');
var LoggingEvent = require('./models/LoggingEvent');


//-=-=-=-=-=-=-=-=-=-
// ROUTE DEFINITIONS
//-=-=-=-=-=-=-=-=-=-

router.route('/requests')

    //Create a new request
    .post(function(req, res){

		console.log("POST: requests")

        var request = new Request();
        request.requester = req.body.requester;
        request.orderDescription = req.body.orderDescription;
        request.orderTime = Date.now();
        request.timeFrame = req.body.timeFrame;

        //save request
        request.save(function(err){
            //return the error in response if it exists
            if (err){
                res.send(err);
                console.log(err);
            }

            res.json({message: 'Request created!'});
        });

    })

    //Get the latest active request
    .get(function(req, res){
        console.log("GET: requests")

        Request.find({requestAccepted: false}).sort('orderTime').exec(function(err, requests) {

            if (err){
                res.send(err);
                console.log(err);
            }

            // THIS NEEDS TO BE DONE THROUGH MONGO QUERY NOT IN MEMORY
            // GOD, PLEASE CLOSE THINE EYES
            let validRequests = requests.filter(function(coffeeRequest){
                //filter out antiquated requests
                let threshholdMinutes = Number(coffeeRequest.timeFrame);
                let threshholdMs = threshholdMinutes * 60 * 1000; // ms conversion
                let msSinceRequest = Date.now() - coffeeRequest.orderTime

                return threshholdMs > msSinceRequest;
            });

            //If an active request exists
            if(validRequests.length > 0){

                let latestRequest = validRequests[validRequests.length - 1];

                res.json({
                    'requester': latestRequest.requester,
                    'orderDescription': latestRequest.orderDescription,
                    'requestId': latestRequest._id
                })
            }

            //If no active requests exist
            else {
                res.status(404);
                res.send("No records found.")
            }

        });

    });

// Route that accepts a user's name as a parameter
// And returns all unexpired requests for that name
router.route('/requests/name/:name')
  .get(function(req, res) {
    console.log("GET: open requests for " + req.params.name);

    Request.find({ requester: req.params.name }, function(err, requests) {
      if (err) res.status(500).json({ error: err});
      if (requests) {
        //filter out antiquated requests
        let unexpiredRequests = requests.filter(function(coffeeRequest){
            //filter out antiquated requests
            let threshholdMinutes = Number(coffeeRequest.timeFrame);
            let threshholdMs = threshholdMinutes * 60 * 1000; // ms conversion
            let msSinceRequest = Date.now() - coffeeRequest.orderTime

            return threshholdMs > msSinceRequest;
        });

        if(unexpiredRequests.length > 0){

            let latestRequest =unexpiredRequests[unexpiredRequests.length - 1];

            res.json({
                'requester': latestRequest.requester,
                'orderDescription': latestRequest.orderDescription,
                'requestId': latestRequest._id
            })
        }

        //If no active requests exist
        else {
            res.status(404);
            res.send("No records found.")
        }
    }});
  })

// Updates order and time frame for request with given id
router.post('/requests/update/:id', function(req, res) {
  console.log("POST: Update request " + req.params.id);
  console.log(req.body.order);
  Request.findOneAndUpdate( { _id: req.params.id}, {$set: { orderDescription: req.body.order, timeFrame: req.body.time}}, function (err, oldRequest) {
    if(err) {
      console.log("Error updating request.");
      res.status(500).json({ error: err});
    } else {
      console.log("Request with ID " + req.params.id + " updated");
      res.status(200).json("Request with ID " + req.params.id + " updated");
    }
  });
});

//Route that accepts an incoming ID as a parameter
//And then marks that request as accepted
router.route('/requests/accept/:id')
    .get(function(req, res){

        console.log("GET: accept request")

        let requestId = req.params.id;
        Request.findById(requestId, function(err, coffeeRequest){
            coffeeRequest.requestAccepted = true;
            coffeeRequest.save(function(err){
                if(err)
                    console.log(err);
                else
                    console.log("Request: " + requestId + " accepted.")
            });
        })

        res.json({message: 'Request accepted!'});

    })

router.route('/requests/:id')
    .get(function(req, res) {
      console.log("GET: get request with id " + req.params.id);
      Request.findById(req.params.id, function(err, coffeeRequest) {
        if (err) res.status(500).json({ error: err});
        if (coffeeRequest) {
            res.json({
                'requester': coffeeRequest.requester,
                'orderDescription': coffeeRequest.orderDescription,
                'requestId': coffeeRequest._id
            })
        }
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

// Endpoints that handle logging of Geofence entrances
router.route('/logging')

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
                res.send(err);
                console.log(err);
            }

            res.json({message: 'Event created!'});
        });

    })

app.use('/', router);
app.listen(PORT);

console.log('Application listening on PORT: ' + PORT);
