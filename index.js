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

//-=-=-=-=-=-=-=-=-=-
// ROUTE DEFINITIONS 
//-=-=-=-=-=-=-=-=-=-

router.route('/requests')

    //create an article
    .post(function(req, res){

		console.log("POST: requests")

        var request = new Request();
        request.requester = req.body.requester;
        request.orderDescription = req.body.orderDescription;
        request.orderTime = Date.now();
        request.timeFrame = req.body.timeFrame;

        //save auction
        request.save(function(err){
            //return the error in response if it exists
            if (err){
                res.send(err);
                console.log(err);
            }

            res.json({message: 'Request created!'});
        });

    })

    //get route
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

//Route that accepts an incoming Id as a parameter 
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


app.use('/api', router);
app.listen(PORT);

console.log('Application listening on PORT: ' + PORT);
