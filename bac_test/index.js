import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import BacTest from '../bac_src/index';
import {load} from '../src/client_loader/loader.js';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('bac_test/index.js', function() {
  describe('test functions', function() {
    it('should make me be an object', function(done) {
      let me = new BacTest('Ben');
      expect(me).to.be.an('object');
      expect(me.name).to.equal('Ben');
      done();
    });
  });
  describe('browser elements', function() {
    let geona;
    let config1;
    before(function(done) {
      this.timeout(10000);
      function geonaOnReady(geona) {
        console.log('Geona is ready.');
      }
      config1 = {
        geonaVariable: 'geonaOl',
        // onReadyCallback: 'geonaOnReady',
        divId: 'ol',
        map: {
          graticule: true,
          bingMapsApiKey: 'AgNtBFpBNF81T-ODIf_9WzE8UF_epbsfiSu9RYMbLfq_wXU_bBVAoyBw8VzfSjkd',
        },
      };
      // let config2 = {
      //   geonaVariable: 'geonaL',
      //   divId: 'leaflet',
      //   map: {
      //     library: 'leaflet',
      //     graticule: true,
      //   },
      // };
      // instantiates new loader for map

      // geona = expect(Promise.resolve(load(config1))).to.eventually.be.fulfilled.and.notify(done);
      // load(config2);
    });
    it('should find document', function(done) {
      expect(document).to.have.property('body');
      done();
    });

    it('should detect geonaOl', function(done) {
      // this.timeout(5500);
      expect(Promise.resolve(load(config1))).to.eventually.be.an('object').notify(done);
      expect(window.geonaOl).to.be.an('object');
      console.log(window.geonaOl);
      expect(window.geonaL).to.be.an('object');
      expect(global.window.geonaOl).to.be.an('object');
      expect(geona).to.be.an('object');
    });
  });
});
