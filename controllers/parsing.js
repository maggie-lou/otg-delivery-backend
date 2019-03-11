var moment = require('moment');

module.exports = {

  parseDateToTime(dateString) {
    var date = moment(dateString);
    date = date.utcOffset(-300).format('h:mm a');
    return date;
  }

};
