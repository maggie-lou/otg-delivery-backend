var express = require('express');
const router = express.Router();

var PushController = require('./push');
const readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

router.route('/')
  .post(function(req, res) {
    console.log("Generate meeting point");

    var helperDest = req.body.helperDest;
    var requesterDestOptions = req.body.requesterDest;

    var pushNotificationMessage = `Get on your laptop and select a meeting point! The helper's destination is ${helperDest}. Requester locations: [${requesterDestOptions}].`;
    console.log(pushNotificationMessage);
    PushController.sendPushToMyself(pushNotificationMessage);

    var waitingThreshold = 90 * 1000; // 90 seconds
    var responseSent = false;

    // Default - send first destination after 90 seconds
    setTimeout(function () {
      if (!responseSent) {
        console.log(`Sending default option: ${requesterDestOptions[0]}`);
        pushNotificationMessage = "Sending default option for meeting point";
        PushController.sendPushToMyself(pushNotificationMessage);
        res.send(requesterDestOptions[0]);
      }
    }, waitingThreshold);

    // Accept meeting point from standard in
    rl.setPrompt("Type index of meeting point (0-indexed) > ");
    rl.prompt();
    rl.on('line', function(line) {
      var index = parseInt(line);
      responseSent = true;
      console.log(`Sending option: ${requesterDestOptions[index]}`);
      res.send(requesterDestOptions[index]);
    });
  })


module.exports = router;
