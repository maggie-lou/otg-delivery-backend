const apn = require('apn');

/*
 * Determine what certificates to use and setup APN.
 */
// Looking for development or production environment
//const nodeEnv = process.env.NODE_ENV || '';
const nodeEnv = 'enterprise'

let options = {},
  topic = '';

if (nodeEnv === 'development') {
  // Development Push
  console.log('Using DEVELOPMENT push.');

  options = {
    token: {
      key: __dirname + '/../push_certificates/otgDev.p8', // Path to the key p8 file
      keyId: '28ZNR8T66U', // The Key ID of the p8 file
      teamId: 'W4E2C6X642', // The Team ID of your Apple Developer Account
    },
    production: false //working with development certificate
  };

  topic = 'edu.northwestern.delta.otgDev';
} else {
  // Enterprise push
  console.log('Using ENTERPRISE push.');

  options = {
    cert: __dirname + '/../push_certificates/cert.pem',
    key: __dirname + '/../push_certificates/key.pem',
    production: true //working with production certificate
  };

  topic = 'edu.northwestern.delta.B';
}


options.errorCallback = (err) => {
  console.log('APN Error:', err);
};

/**
 * Sends a push notification with message to list of devices.
 *
 * @param deviceTokens {array} devices to send notification to, as array of strings
 * @param message {string} message to send to each device
 * @param response {object} response object to return once notification is complete
 */
// Texts to phone
// Send to one device, array with one token
exports.sendPushWithMessage = (deviceTokens, message, response) => {
  console.log("In send push with message");
  // console.log(deviceTokens[0]);
  const apnConnection = new apn.Provider(options);

  const note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 0;
  note.sound = 'ping.aiff';
  note.alert = message;
  note.payload = {
    'messageFrom': 'OTG-server'
  };
  note.topic = topic;

  apnConnection.send(note, deviceTokens).then((result) => {
    if (response !== undefined) {
      console.log(deviceTokens);
      console.log(note);
      console.log("Success");
      response.success(result);
    }
  }).catch(error => {
    if (response !== undefined) {
      response.error(error);
    }
  });

  apnConnection.shutdown();
};

/**
 * Sends a silent push notification to client, prompting reload of data.
 *
 * @param deviceTokens {array} devices to send notification to, as array of strings
 * @param dataSet {string} data to refresh
 * @param response {object} response object to return once complete
 */
// Need to save a device token - one per user
exports.sendSilentRefreshNotification = (deviceTokens, dataSet, response) => {
  console.log("In silent push");
  const apnConnection = new apn.Provider(options);

  const note = new apn.Notification();
  note.setContentAvailable(1); // Make silent push
  note.payload = {
    'updateType': dataSet // Updating track location vs. get location updates
  };
  note.topic = topic;

  // send notification for each token
  apnConnection.send(note, deviceTokens).then((result) => {
    if (response !== undefined) {
      response.success(result);
    }
  }).catch(error => {
    if (response !== undefined) {
      response.error(error);
    }
  });

  apnConnection.shutdown();
};



exports.sendPushToMyself = (message) => {
//  console.log("In send push to myself");
  var myDeviceId = "11ECDC14490132103C3ED6F62CA0FF20722D812BE63434B98693AB95317A5F57";

  exports.sendPushWithMessage([myDeviceId], message);
};
