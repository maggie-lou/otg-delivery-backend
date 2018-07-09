process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

// Run all tests
function importTest(testName, path) {
  describe(testName, function() {
    require(path);
  });
}


describe("OTG Backend", function() {
  importTest("Request controller", './requests-spec.js');
});
