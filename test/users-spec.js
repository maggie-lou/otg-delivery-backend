process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var sinon = require('sinon');

var should = chai.should();
var expect = chai.expect;

var server = require('../index');
var PushController = require('../controllers/push');
var Request = require('../models/request');
var User = require('../models/User');

describe('Users', () => {

  let now = new Date();
  let twoHoursLater = (new Date).setHours(now.getHours() + 2);
  let twoHoursAgo = (new Date).setHours(now.getHours() - 2);

  let userId = "5b526aef28eda7166b1b51ff";

  beforeEach((done) => {
    // Load test db with clean data
    User.remove({}, (err) => {
      if (err) return done(err);

      var testUser = new User({
        _id: userId,
        deviceId: "Test device Id",
        username: "Hannah",
      });

      testUser.save(function(err) {
        done();
      });
    })
  });

  afterEach(function(done) {
    User.remove({}, function(err) {
      if (err) return done(err);
    });

    Request.remove({}, function(err) {
      if (err) return done(err);
      done();
    });
  });

  describe('/GET users/:id', function() {
    it ("should return the user with the ID", (done) => {
      chai.request(server)
        .get('/users/' + userId)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.username.should.equal('Hannah');
          done();
        });
    });
  });

  describe('/POST users', function() {
    it ("should create a new user", (done) => {
      chai.request(server)
        .post('/users')
        .send({ 'deviceId': 'New Device', 'username': "Hungry" })
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });


  describe('/GET users/:id/tasks', function() {
    it ("should return all of the unexpired, uncompleted tasks for the user", (done) => {
      var task1 = new Request({
        helper: userId,
        orderDescription: 'T1',
        endTime: twoHoursLater,
        status: 'Accepted',
      });
      var task2 = new Request({
        helper: userId,
        orderDescription: 'T2',
        endTime: twoHoursLater,
        status: 'Accepted',
      });
      task1.save( () => {
        task2.save( () => {
          chai.request(server)
            .get('/users/' + userId + "/tasks")
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.have.length(2);
              res.body[0].orderDescription.should.equal("T1");
              res.body[1].orderDescription.should.equal("T2");
              done();
            });
        });
      });
    });


    it ("should not return tasks for other users", (done) => {
      var otherUserId = "6b526aef28eda7166b1b51ff";
      var task = new Request({
        helper: otherUserId,
        orderDescription: 'Other user task',
        endTime: twoHoursLater,
        status: 'Accepted',
      });
      task.save();

      chai.request(server)
        .get('/users/' + userId + "/tasks")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.length(0);
          done();
        });
    });

    it ("should not return tasks with endtimes that have passed", (done) => {
      var expiredTask = new Request({
        helper: userId,
        orderDescription: 'Expired task',
        endTime: twoHoursAgo,
        status: 'Accepted',
      });
      expiredTask.save();

      chai.request(server)
        .get('/users/' + userId + "/tasks")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.length(0);
          done();
        });
    });

    it ("should not return tasks that have been completed", (done) => {
      var completedTask = new Request({
        helper: userId,
        orderDescription: 'Completed task',
        endTime: twoHoursLater,
        status: 'Completed',
      });
      completedTask.save();

      chai.request(server)
        .get('/users/' + userId + "/tasks")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.length(0);
          done();
        });
    });
  });


  describe('/GET users/:id/requests', function() {
    it ("should return all of the unexpired, uncompleted requests for the user", (done) => {
      var req1 = new Request({
        requester: userId,
        orderDescription: 'R1',
        endTime: twoHoursLater,
        status: 'Accepted',
      });
      var req2 = new Request({
        requester: userId,
        orderDescription: 'R2',
        endTime: twoHoursLater,
        status: 'Pending',
      });
      req1.save( (err) => {
        if (err) {
          console.log(err);
          console.log("Error saving Request 1");
          done(err);
        }
        req2.save( (err) => {
          if (err) {
            console.log(err);
            console.log("Error saving Request 2");
            done(err);
          }
          chai.request(server)
            .get('/users/' + userId + "/requests")
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.have.length(2);
              res.body[0].orderDescription.should.equal("R1");
              res.body[1].orderDescription.should.equal("R2");
              done();
            });
        });
      });
    });

    it ("should not return requests for other users", (done) => {
      var otherUserId = "6b526aef28eda7166b1b51ff";
      var req = new Request({
        requester: otherUserId,
        orderDescription: 'Other user request',
        endTime: twoHoursLater,
        status: 'Pending',
      });
      req.save();

      chai.request(server)
        .get('/users/' + userId + "/requests")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.length(0);
          done();
        });
    });

    it ("should not return requests with endtimes that have passed", (done) => {
      var expiredReq = new Request({
        requester: userId,
        orderDescription: 'Expired request',
        endTime: twoHoursAgo,
        status: 'Pending',
      });
      expiredReq.save();

      chai.request(server)
        .get('/users/' + userId + "/requests")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.length(0);
          done();
        });
    });

    it ("should not return requests that have been completed", (done) => {
      var completedReq = new Request({
        requester: userId,
        orderDescription: 'Completed request',
        endTime: twoHoursLater,
        status: 'Completed',
      });
      completedReq.save();

      chai.request(server)
        .get('/users/' + userId + "/requests")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.length(0);
          done();
        });
    });
  });


  describe("/POST users/:userId/accept/:requestId", function() {
    var requesterId = "6b526aef28eda7166b1b51ff";
    var requestId = '5afcaa441be2bb00147e6dd0';

    it ("should assign the user to be the helper for the given request, change the status to Accepted, and send a push notification to the requester", (done) => {
      var requester = new User({
        _id: requesterId,
        deviceId: "Requester Device Id",
        username: "Jodie",
      });
      var req = new Request({
        _id: requestId,
        requester: requesterId,
        orderDescription: 'burrito',
        endTime: twoHoursLater,
        status: 'Pending',
      });

      var sendPushWithMessage = sinon.stub(PushController, 'sendPushWithMessage');

      requester.save().then( () => {
        return req.save();
      }).then( () => {
          chai.request(server)
            .patch('/users/' + userId + "/accept/" + requestId)
            .end(function(err, res) {
              res.should.have.status(200);
              res.text.should.equal("Accepted request with ID " + requestId + " by " + userId);

              sinon.assert.calledWith(sendPushWithMessage, ["Requester Device Id"], "Hannah accepted the request for burrito by Jodie!");

              Request.findById(requestId, function(err, req) {
                req.status.should.equal('Accepted');
                String(req.helper).should.equal(userId);
                done();
              });
            });
        });
    });

    it ("should return a 405 error code if the request's endtime has passed", (done) => {
      var req = new Request({
        _id: requestId,
        requester: requesterId,
        orderDescription: 'burrito',
        endTime: twoHoursAgo,
        status: 'Pending',
      });
      req.save( (err) => {
        if (err) done(err);

        chai.request(server)
          .patch('/users/' + userId + "/accept/" + requestId)
          .end(function(err, res) {
            res.should.have.status(405);
            res.text.should.include("has already expired. Cannot be accepted");
            done();
          });
      });
    });

    it ("should return a 405 error code if the request has already been accepted", (done) => {
      var req = new Request({
        _id: requestId,
        requester: requesterId,
        orderDescription: 'burrito',
        endTime: twoHoursLater,
        status: 'Accepted',
      });
      req.save( (err) => {
        if (err) done(err);

        chai.request(server)
          .patch('/users/' + userId + "/accept/" + requestId)
          .end(function(err, res) {
            res.should.have.status(405);
            res.text.should.include("has already been accepted. Cannot be re-accepted");
            done();
          });
      });
    });
  });

  describe("/PATCH users/:userId/removeHelper/:requestId", function() {
    it ("should remove the helper id from the request, set the request as pending, and send a push notification to the requester", (done) => {
    var requesterId = "6b526aef28eda7166b1b51ff";
    var requestId = '5afcaa441be2bb00147e6dd0';

      var requester = new User({
        _id: requesterId,
        deviceId: "Requester Device Id",
        username: "Jodie",
      });
      var req = new Request({
        _id: requestId,
        requester: requesterId,
        helper: userId,
        orderDescription: 'burrito',
        endTime: twoHoursLater,
        status: 'Pending',
      });

      var sendPushWithMessage = sinon.stub(PushController, 'sendPushWithMessage');

      requester.save().then( () => {
        return req.save();
      }).then( () => {
          chai.request(server)
            .patch('/users/' + userId + "/removeHelper/" + requestId)
            .end(function(err, res) {
              res.should.have.status(200);
              res.text.should.equal("Removed helper " + userId + " from request with ID " + requestId);

              sinon.assert.calledWith(sendPushWithMessage, ["Requester Device Id"], "Unfortunately, Hannah can no longer deliver your request for a burrito. We apologize for the inconvenience and your request can still be accepted by other helpers.");

              Request.findById(requestId, function(err, req) {
                req.status.should.equal('Pending');
                req.helper.should.equal(null);
                done();
              });
            });
        });
    });
  });
});
