var moment = require('moment');

module.exports = {

  parseDateToTime(dateString) {
    var date = moment(dateString);
    date = date.format('h:mm a');
    return date;
  }

};
