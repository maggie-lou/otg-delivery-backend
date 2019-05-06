//web server imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //parses JSON

//so the server can handle POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Configure database and data models
const env = "" + process.env.NODE_ENV;
console.log("ENV: " + env);
const config = require('./config/db')[env || "dev"];
console.log(config);

const mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true });

// Set routes
const RequestController = require('./controllers/RequestController');
const UserController = require('./controllers/UserController');
const ItemController = require('./controllers/ItemController');
const LocationController = require('./controllers/LocationController');
const LoggingController = require('./controllers/LoggingController');
const FeedbackController = require('./controllers/FeedbackController');
const MeetingPointController = require('./controllers/MeetingPointController');
const LocationUpdateController = require('./controllers/LocationUpdateController');
const ResearcherController = require('./controllers/ResearcherController');

// Set route for push notification
//const PushController = require('./controllers/push');

app.use('/requests', RequestController);
app.use('/users', UserController);
app.use('/items', ItemController);
app.use('/locations', LocationController);
app.use('/logging', LoggingController);
app.use('/feedback', FeedbackController);
app.use('/meeting', MeetingPointController);
app.use('/locupdates', LocationUpdateController);
app.use('/researcher', ResearcherController);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);

module.exports = app;
