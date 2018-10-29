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
const env = "" + process.env.NODE_ENV;
console.log("Env: " + env);
const config = require('./config/db')[env || "dev"];
console.log(config);

var mongoose = require('mongoose');
mongoose.connect(config.DBHost);

// Set routes
var RequestController = require('./controllers/RequestController');
var UserController = require('./controllers/UserController');
var ItemController = require('./controllers/ItemController');
var LocationController = require('./controllers/LocationController');
var LoggingController = require('./controllers/LoggingController');
var FeedbackController = require('./controllers/FeedbackController');

// Set route for push notification
var PushController = require('./controllers/push');

app.use('/requests', RequestController);
app.use('/users', UserController);
app.use('/items', ItemController);
app.use('/locations', LocationController);
app.use('/logging', LoggingController);
app.use('/feedback', FeedbackController);

app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);

module.exports = app;
