import chai from 'chai';
import chaiHttp from 'chai-http';

import * as config from '../../../src/server/config';
let subFolderPath = config.server.get('subFolderPath');

import * as geona from '../../../src/server/app';

chai.use(chaiHttp);
let expect = chai.expect;

describe('settings routers', function() {
  /**
   * /src/server/controllers/settings.js
   */
  describe('GET /settings/config', function() {
    it('should return client config as JSON', function(done) {
      chai.request(geona.server)
        .get(subFolderPath + '/settings/config')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });
});
