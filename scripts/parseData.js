var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://OTGDeveloper:Dev113!@ds153705.mlab.com:53705/otg-production", (err, client) => {
  if (client == null || err) {
    console.log("Fail: DB Null");
    return;
  }

  const database = client.db("otg-production");

  getNumOpenRequestsPerHour(database);
  //getNumTaskAcceptancesPerHour(database);
  //getAvgRequestLength(database);

  client.close();
});

function getNumOpenRequestsPerHour(db) {
  db.collection('requestsMP').find({}).toArray(function(err, requests) {
    if (err) {
      console.log("Error connecting to collection.");
      return;
    }
    var hourlyRequestsFreq = {};
    requests.forEach(function(request) {
      var start = getHour(request.orderTime);
      var end = getHour(request.endTime);

      var hour;
      for (hour = start; hour <= end; hour += 0.5) {
        if (hour in hourlyRequestsFreq) {
          hourlyRequestsFreq[hour] = hourlyRequestsFreq[hour] + 1;
        } else {
          hourlyRequestsFreq[hour] = 1;
        }
      }
    });
    console.log("Number requests open per hour:")
    for (var key in hourlyRequestsFreq) {
      console.log(`Hour ${key}: ${hourlyRequestsFreq[key]} requests`);
    }
  });
}

function getNumTaskAcceptancesPerHour(db) {
  db.collection('loggingeventsMP').find( {"eventType": "Task Accepted"} ).toArray(function(err, events) {
    if (err) {
      console.log("Error connecting to collection.");
      return;
    }
    var hourlyFreq = {};
    events.forEach(function(event) {
      var hour = getHour(event.eventTime);
      if (hour in hourlyFreq) {
        hourlyFreq[hour] = hourlyFreq[hour] + 1;
      } else {
        hourlyFreq[hour] = 1;
      }
    });
    console.log("Number task acceptances per hour:")
    for (var key in hourlyFreq) {
      console.log(`Hour ${key}: ${hourlyFreq[key]} acceptances`);
    }
  });
}

function getHour(dateObject) {
  var hour = dateObject.getHours();

  // If time has low number of minutes, don't count that hour - request not active for most of the hour
  var minute = dateObject.getMinutes();
  if (minute < 10) {
    hour--;
  } else if (minute >= 30) {
    hour += 0.5;
  }

  return hour;
}

function getAvgRequestLength(db) {
  db.collection('requestsMP').find().toArray(function(err, requests) {
    var sumMinutes = 0;
    var numRequests = 0;

    requests.forEach(function(request) {
      numRequests++;
      var reqLengthMs = request.endTime.getTime() - request.orderTime.getTime();
      sumMinutes += reqLengthMs / 1000 / 60;
    });

    average = sumMinutes / numRequests;
    console.log(average);

    return average;
  });
}

