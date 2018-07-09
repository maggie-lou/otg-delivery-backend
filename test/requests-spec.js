process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var server = require('../index');
var Request = require('../models/request');

describe('Requests', () => {
  beforeEach((done) => {
    // Load test db with clean data
    Request.remove({}, (err) => {
      if (err) return done(err);
      var now = new Date();
      var twoHoursLater = (new Date).setHours(now.getHours() + 2);

      var testRequest = new Request({
        orderTime: now,
        _id: 'Requester ID',
        orderDescription: 'Pre-loaded burrito',
        endTime: twoHoursLater,
        status: 'Pending',
        deliveryLocation: 'Burrito haus',
        deliveryLocationDetails: 'Please bring ASAP',
      });

      testRequest.save(function(err) {
        done();
      });

    })

  });

  afterEach(function(done) {
    Request.remove({}, function(err) {
      if (err) return done(err);
      done();
    });
  });


  describe('/GET request', function() {
      it('should list all requests on /requests GET', (done) => {
        // Before - load db with test data
        // Hard code value of JSON that we expect
        chai.request(server)
          .get('/requests/active')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            console.log(res.body);

            done();
          });
      });
      it('should return OLDEST ACTIVE request on /requests GET');
    });

});
