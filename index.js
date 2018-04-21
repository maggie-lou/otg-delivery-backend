//web server imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var apn = require('apn');
//
//
// //Configure push notifications
// var options = {
//     token: {
//       key: "path/to/APNsAuthKey_XXXXXXXXXX.p8",
//       keyId: "key-id",
//       teamId: "developer-team-id"
//     },
//     production: false
//   };
//
//   var apnProvider = new apn.Provider(options);


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

var Request = require('./models/request');
var LoggingEvent = require('./models/LoggingEvent');


// Set routes
var RequestController = require('./controllers/RequestController');
var LoggingController = require('./controllers/LoggingController');

app.use('/requests', RequestController);
app.use('/logging', LoggingController);


app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);
