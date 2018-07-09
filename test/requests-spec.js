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

  describe('/POST request', function() {
    it ('should add a single request', (done) => {

    });
  });

  describe('/GET request', function() {
    it ('should get the oldest request that hasnt expired', (done) => {

    });
  });

  describe('/GET request/active', function() {
    it ('should return all active requests', (done) => {

    });
  });

  describe('/GET request/userid', function() {
    it ('should return all unexpired requests for the user with the input id', (done) => {

    });
  });
  describe('/GET request/id', function() {
    it ('should return the request with the input id', (done) => {

    });
  });
  describe('/DELETE request/id/:id', function() {
    it ('should delete the request with the input id', (done) => {

    });

    it ('should not do anything if the desired request is not in the db', (done) => {

    });
  });
  describe('/POST request/status/:id', function() {
    it ('should update the given request\'s status', (done) => {
        // should not create an additional request
    });
  });
  describe('/GET request/accept/:userId', function() {
    it ('should get all requests that the given user has accepted', (done) => {
    });
  });
  describe('/POST request/accept/:userId', function() {
    it ('should assign the given user as the helper for a request', (done) => {
    });
  });
  describe('/DELETE request/helper/cancel/:requestId', function() {
    it ('should un-assign the given user as the helper for a request', (done) => {
    });
  });
  describe('/UPDATE request/update/:id', function() {
    it ('should update the desired request', (done) => {
        // should not create an additional request
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
