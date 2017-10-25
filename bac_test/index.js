import chai from 'chai';

import BacTest from '../bac_src/index';
import {load} from '../src/client_loader/loader.js';

let expect = chai.expect;

describe('bac_test/index.js', function() {
  describe('test functions', function() {
    it('should make me be an object', function() {
      let me = new BacTest('Ben');
      expect(me).to.be.an('object');
      expect(me.name).to.equal('Ben');
    });
  });
  describe('browser elements', function() {
    it('should find document', function() {
      expect(document).to.have.property('body');
    });
    // it('should make an openlayers map', function() {
    //   function geonaOnReady(geona) {
    //     console.log('Geona is ready.');
    //   }
    //   let config1 = {
    //     geonaVariable: 'geonaOl',
    //     onReadyCallback: 'geonaOnReady',
    //     divId: 'ol',
    //     map: {
    //       graticule: true,
    //       bingMapsApiKey: 'AgNtBFpBNF81T-ODIf_9WzE8UF_epbsfiSu9RYMbLfq_wXU_bBVAoyBw8VzfSjkd',
    //     },
    //   };
    //   let config2 = {
    //     geonaVariable: 'geonaL',
    //     divId: 'leaflet',
    //     map: {
    //       library: 'leaflet',
    //       graticule: true,
    //     },
    //   };
    //   // instantiates new loader for map
    //   load(config1);
    //   load(config2);
    // });
    // it('should detect geonaOl', function() {
    //   console.log(window.geonaOl);
    // });
  });
});
