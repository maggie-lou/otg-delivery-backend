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


// Configure database and data models
var mongoose = require('mongoose');
mongoose.connect('mongodb://samboozled:sabrina@ds247648.mlab.com:47648/otg-coffee');

// Set routes
var RequestController = require('./controllers/RequestController');
var UserController = require('./controllers/UserController');
var LoggingController = require('./controllers/LoggingController');
var FeedbackController = require('./controllers/FeedbackController');

// Set route for push notification
var PushController = require('./controllers/push');

app.use('/requests', RequestController);
app.use('/users', UserController);
app.use('/logging', LoggingController);
app.use('/feedback', FeedbackController);

app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);