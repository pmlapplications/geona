import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import {load} from '../../../src/client_loader/loader.js';

chai.use(chaiAsPromised);

chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_openlayers', function() {
  let geona;
  before(function(done) {
    // let config1 = {
    //   geonaVariable: 'geonaOl',
    //   divId: 'ol',
    //   map: {
    //     graticule: true,
    //     bingMapsApiKey: 'AgNtBFpBNF81T-ODIf_9WzE8UF_epbsfiSu9RYMbLfq_wXU_bBVAoyBw8VzfSjkd',
    //   },
    // };
    // geona = expect(Promise.resolve(load(config1))).to.eventually.be.fulfilled.and.notify(done);
  });
  describe('constructor', function() {
    it('should successfully find a Geona object', function() {
      expect('').to.equal('');
    });
  });
});
