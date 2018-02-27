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

		console.log(req.body.requester);
		console.log(req.body.orderDescription);
		console.log(req.body.timeFrame); 

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
    
        Request.findOne().sort('orderTime').exec(function(err, request) { 
            
            if (err){
                res.send(err);
                console.log(err);
            }

            console.log(request); 

            res.json({
                        'requester': request.requester, 
                        'orderDescription': request.orderDescription
                    });

        });

    });

app.use('/api', router);
app.listen(PORT);

console.log('Application listening on PORT: ' + PORT);