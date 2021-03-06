process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var server = require('../index');
var Request = require('../models/request');

describe('Requests', () => {
  var requesterId = '5afb86420759d5001400990f'
  var requestId = '5afcaa441be2bb00147e6dd0'
  var now = new Date();
  var twoHoursLater = (new Date).setHours(now.getHours() + 2);

  beforeEach((done) => {
    // Load test db with clean data
    Request.remove({}, (err) => {
      if (err) return done(err);

      var testRequest = new Request({
        _id: requestId,
        requester: requesterId,
        orderTime: now,
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
      chai.request(server)
        .post('/requests')
        .send({ 'orderDescription': 'Feed me!', 'endTime': twoHoursLater, 'status': 'Pending', 'deliveryLocation': 'home', 'deliveryLocationDetails': 'Yum!' })
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.message.should.equal('Request created!');
          done();
        });
    });
  });


  describe('/GET request', function() {
    it ('should get the requests matching the query parameters', (done) => {
      var req = new Request({
        requester: requesterId,
        orderTime: now,
        orderDescription: 'Matches query',
        endTime: twoHoursLater,
        status: 'Completed',
      });

      req.save().then( () => {
        chai.request(server)
          .get('/requests?status=Completed')
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.length(1);
            res.body[0].orderDescription.should.equal('Matches query');
            done();
          });
      })
    });
  });

  describe('/GET requests/:id', function() {
    it ('should return the request with the input id', (done) => {
      var id = '9afcaa441be2bb00147e6dd0';
      var request = new Request({
        _id: id,
        orderDescription: 'Desired request',
        endTime: twoHoursLater,
        status: 'Pending',
      });
      request.save().then( () => {
        chai.request(server)
          .get('/requests/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.orderDescription.should.equal('Desired request');
            done();
          });
      });
    });
  });

  describe('/DELETE requests/:id', function() {
    it ('should delete the request with the input id', (done) => {
      Request.count( {}, function(err, count) {
        count.should.equal(1);
      });
      chai.request(server)
        .delete('/requests/' + requestId)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.message.should.equal('Request deleted!');
          Request.count( {}, function(err, count) {
            count.should.equal(0);
            done();
          });
        });
    });

    it ('should not do anything if the desired request is not in the db', (done) => {
      Request.count( {}, function(err, count) {
        count.should.equal(1);
      });

      var notPresentRequestId = '9afcaa441be2bb00147e6dd0'
      chai.request(server)
        .delete('/requests/' + notPresentRequestId)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.message.should.equal('Request deleted!');
          Request.count( {}, function(err, count) {
            count.should.equal(1);
            done();
          });
        });
    });
  });



  describe('/PATCH requests/:id', function() {
    it ('should update the request with the input id', (done) => {
      chai.request(server)
        .patch('/requests/' + requestId)
        .send({ 'requester': requesterId, 'helper': null, 'orderDescription': 'Tamales', 'status': 'Accepted', 'endTime': twoHoursLater,  'deliveryLocation': 'Tamale haus', 'deliveryLocationDetails': 'Yum!' })
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('Request with ID ' + requestId + ' updated');
          Request.findById(requestId, function(err, coffeeRequest) {
            coffeeRequest.status.should.equal('Accepted');
            coffeeRequest.orderDescription.should.equal('Tamales');
            coffeeRequest.deliveryLocation.should.equal('Tamale haus');
            coffeeRequest.deliveryLocationDetails.should.equal('Yum!');
            done();
          });
        });
    });
  });

  describe('/PATCH requests/:id/status', function() {
    it ('should update the status of the request with the input id', (done) => {
      chai.request(server)
        .patch('/requests/' + requestId + '/status')
        .send({ 'status': 'Completed' })
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('Request status for ID ' + requestId + ' updated');
          Request.findById(requestId, function(err, coffeeRequest) {
            coffeeRequest.status.should.equal('Completed');
            coffeeRequest.orderDescription.should.equal('Pre-loaded burrito');
            coffeeRequest.deliveryLocation.should.equal('Burrito haus');
            done();
          });
        });
    });
  });

  describe('/GET requests/task/:userId', function() {
    it ('should return a pending, non-expired request that wasnt made by the current user', (done) => {
      var otherUserId = '9afcaa441be2bb00147e6dd0';
      var oneHourLater = (new Date).setHours(now.getHours() + 1);
      var req = new Request({
        requester: otherUserId,
        orderTime: oneHourLater,
        orderDescription: 'Task',
        endTime: twoHoursLater,
        status: 'Pending',
      });

      req.save().then( () => {
        chai.request(server)
          .get('/requests/task/' + requesterId)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.orderDescription.should.equal('Task');
            done();
          });
      });
    });
  });
});
