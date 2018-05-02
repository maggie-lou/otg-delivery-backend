var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var should = chai.should();

//TESTS

//Request logic
describe('Blobs', function() {
    it('should list ALL requests on /requests GET');
    it('should return OLDEST ACTIVE request on /requests GET');
  });