import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../lib/server/app';

chai.use(chaiHttp);
let expect = chai.expect;

describe('app', function () {
  describe('GET /swagger.json', function () {
    it('should return the swagger json', function (done) {
      chai.request(app)
        .get('/swagger.json')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });
});
