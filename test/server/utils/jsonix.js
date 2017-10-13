import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';

import {WMS_CONTEXT} from '../../../src/server/utils/jsonix.js';

chai.use(chaiHttp);
let expect = chai.expect;

describe('server/utils/ogc/wms_capabilities_parser', function() {
  let resPath;
  let expPath;
  let unmarshaller;

  before(function() {
    resPath = path.join(global.test.resPath, 'server/utils/ogc');
    expPath = path.join(global.test.expPath, 'server/utils/ogc');
  });

  it('should correctly identify a WMS 1.3.0 capabilities', function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(10000);
    unmarshaller = WMS_CONTEXT.createUnmarshaller();
    let jsonCapabilities;
    let xmlPath = resPath + '/wms_1_3_0_capabilities_cci2.xml';
    let xml = fs.readFileSync(xmlPath, 'utf8');
    try {
      jsonCapabilities = unmarshaller.unmarshalString(xml);
      fs.writeFileSync('testJsonunmarshal130.json', jsonCapabilities);
      console.log(jsonCapabilities.value.version);
    } catch (err) {
      throw err;
    }
    expect(jsonCapabilities.value.version).to.equal('1.3.0');
  });

  it('should correctly identify a WMS 1.1.1 capabilities', function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(10000);
    unmarshaller = WMS_CONTEXT.createUnmarshaller();
    let jsonCapabilities;
    let xmlPath = resPath + '/wms_1_1_1_capabilities_cci2.xml';
    let xml = fs.readFileSync(xmlPath, 'utf8');
    try {
      jsonCapabilities = unmarshaller.unmarshalString(xml);
      fs.writeFileSync('testJsonunmarshal111.json', jsonCapabilities);
      console.log(jsonCapabilities.value.version);
    } catch (err) {
      throw err;
    }
    expect(jsonCapabilities.value.version).to.equal('1.1.1');
  });
});
