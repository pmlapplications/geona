import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';

import {parseLocalWmsCapabilities} from '../../../../src/server/utils/ogc/wms_capabilities_parser.js';

chai.use(chaiHttp);
let expect = chai.expect;

describe('server/utils/ogc/wms_capabilities_parser', () => {
  let resPath = path.join(global.test.resPath, 'server/utils/ogc');
  let expPath = path.join(global.test.expPath, 'server/utils/ogc');

  it('should correctly parse a WMS 1.3.0 capabilities', () => {
    wmsParserTest(resPath + '/wms_1_3_0_capabilities_cci.xml', expPath + '/wms_1_3_0_capabilities_cci.json');
  });

  function wmsParserTest(xmlPath, expectedPath) {
    let xml = fs.readFileSync(xmlPath, 'utf8');
    let expectedJson = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));

    let result = JSON.parse(JSON.stringify(parseLocalWmsCapabilities(xml)));

    expect(result).to.deep.equal(expectedJson);
  }
});
