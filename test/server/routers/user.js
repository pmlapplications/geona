import chai from 'chai';
import chaiHttp from 'chai-http';

import * as config from '../../../src/server/config';
let subFolderPath = config.server.get('subFolderPath');

import * as geona from '../../../src/server/app';

chai.use(chaiHttp);
let expect = chai.expect;

describe('user routers', function() {
  /**
   * /src/server/controllers/user.js
   */
  describe('GET /user/login', function() {
    it('should return login page', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user/login')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.text).to.have.string('To continue, please login with one of the providers below');
          done();
        });
    });
  });

  describe('GET /user', function() {
    it('should return user welcome page if logged in', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should redirect user to login page if not logged in', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user')
        .end(function(err, res) {
          expect(res).to.redirectTo('http://127.0.0.1:' + config.server.get('port') + subFolderPath + '/user/login?r=/user');
          done();
        });
    });
  });

  describe('GET /user/auth/google', function() {
    it('should redirect to Google', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user/auth/google')
        .redirects(0)
        .end(function(err, res) {
          expect(res).to.redirect;
          done();
        });
    });
  });

  describe('GET /user/auth/google/callback', function() {
    it('should login the user after authenticating with Google', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user/auth/google/callback')
        .end(function(err, res) {
          // not sure how to test this yet :/
          done();
        });
    });
  });

  describe('GET /user/auth/github', function() {
    it('should redirect to GitHub', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user/auth/github')
        .redirects(0)
        .end(function(err, res) {
          expect(res).to.redirect;
          done();
        });
    });
  });

  describe('GET /user/auth/github/callback', function() {
    it('should login the user after authenticating with GitHub', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/user/auth/github/callback')
        .end(function(err, res) {
          // not sure how to test this yet :/
          done();
        });
    });
  });
});
