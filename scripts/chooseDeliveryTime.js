const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output:process.stdout
});

var percentRequestsCompletedTimes = {}
percentRequestsCompletedTimes[11] = 5;
percentRequestsCompletedTimes[11.5] = 5;
percentRequestsCompletedTimes[12] = 5;
percentRequestsCompletedTimes[12.5] = 8;
percentRequestsCompletedTimes[13] = 8;
percentRequestsCompletedTimes[13.5] = 8;
percentRequestsCompletedTimes[14] = 4;
percentRequestsCompletedTimes[14.5] = 4;
percentRequestsCompletedTimes[15] = 2;
percentRequestsCompletedTimes[15.5] = 4;
percentRequestsCompletedTimes[16] = 4;
percentRequestsCompletedTimes[16.5] = 3;

function chooseDeliveryTime() {
  var requestStartTime;
  var requestEndTime;
  rl.question("Enter the hour the request started, rounded to the nearest half hour and in military time. Ex. 4:40PM -> 16.5 :    < ", (answer) => {
    requestStartTime = parseInt(answer);
    rl.question("Enter the hour the request ended, rounded to the nearest half hour and in military time. Ex. 4:40PM -> 16.5 :    < ", (answerEndTime) => {
      requestEndTime = parseInt(answerEndTime);

      var probDistribution = [];
      for (var hour = requestStartTime; hour < requestEndTime; hour += 0.5) {
        var probAtHour = percentRequestsCompletedTimes[hour];
        for (var probIncrement = 1; probIncrement <= probAtHour; probIncrement++) {
          probDistribution.push(hour);
        }
      }

      var randomIndex = Math.floor(Math.random() * probDistribution.length);
      var deliveryTime = probDistribution[randomIndex];
      console.log(deliveryTime);
      rl.close();
    });
  });
}

chooseDeliveryTime()
