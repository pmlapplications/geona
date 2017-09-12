import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';

import {parseLocalWmtsCapabilities} from '../../../../src/server/utils/ogc/wmts_capabilities_parser.js';


chai.use(chaiHttp);
let expect = chai.expect;

describe('server/utils/pgc/wmts_capabilities_parser', () => {
  describe('parse converted JSON with parseTitles', () => {
    it('should return a correctly-constructed Object', () => {
      let xml = fs.readFileSync(path.join(global.test.resPath, 'server/utils/ogc/WMTSCapabilitiesNGI.xml'), 'utf8');
      let expectedJson = JSON.parse(fs.readFileSync(path.join(global.test.expPath, 'server/utils/ogc/WMTSCapabilitiesNGI.json'), 'utf8'));
      let convertedXml = JSON.parse(JSON.stringify(parseLocalWmtsCapabilities(xml)));
      expect(convertedXml).to.deep.equal(expectedJson);
    });
  });
});

// describe('server/app', function() {
//   describe('GET /swagger.json', function() {
//     it('should return the swagger json', function(done) {
//       chai.request(app)
//         .get('/swagger.json')
//         .end(function(err, res) {
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
//           done();
//         });
//     });
//   });
// });
