import chai from 'chai';
import chaiHttp from 'chai-http';

import * as config from '../../src/server/config';
let subFolderPath = config.server.get('subFolderPath');

import app from '../../src/server/app';

chai.use(chaiHttp);
let expect = chai.expect;

describe('server/app', function() {
  describe('GET /swagger.json', function() {
    it('should return the swagger json', function(done) {
      chai.request(app)
        .get(subFolderPath + '/swagger.json')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });
  describe('GET /index.html', function() {
    it('should return the index page', function(done) {
      chai.request(app)
        .get(subFolderPath + '/')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    });
  });
  describe('GET /js/bundle.js', function() {
    it('should return the js bundle', function(done) {
      chai.request(app)
        .get(subFolderPath + '/js/bundle.js')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
