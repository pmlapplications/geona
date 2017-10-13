import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';

import {parseLocalWmsCapabilities} from '../../../../src/server/utils/ogc/wms_capabilities_parser.js';

chai.use(chaiHttp);
let expect = chai.expect;

describe('server/utils/ogc/wms_capabilities_parser', () => {
  let resPath;
  let expPath;

  before(() => {
    resPath = path.join(global.test.resPath, 'server/utils/ogc');
    expPath = path.join(global.test.expPath, 'server/utils/ogc');
  });

  it('should correctly parse a WMS 1.3.0 capabilities', () => {
    wmsParserTest(resPath + '/wms_1_3_0_capabilities_cci.xml', expPath + '/wms_1_3_0_capabilities_cci.json');
  });

  it('should correctly parse a WMS 1.1.1 capabilities', () => {
    wmsParserTest(resPath + '/wms_1_1_1_capabilities_cci.xml', expPath + '/wms_1_1_1_capabilities_cci.json');
  });

  /**
   * This method is used to pass local files to the parseLocalWmsCapabilities method.
   * @param {String} xmlPath      The path to the local XML document, stored under test_dependencies/resources.
   * @param {String} expectedPath The path to the local JSON document, stored under test_dependencies/expected.
   */
  function wmsParserTest(xmlPath, expectedPath) {
    let xml = fs.readFileSync(xmlPath, 'utf8');
    let expectedJson = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));

    let result = JSON.parse(JSON.stringify(parseLocalWmsCapabilities(xml)));
    // console.log(JSON.stringify(result));

    expect(result).to.deep.equal(expectedJson);
  }
});
