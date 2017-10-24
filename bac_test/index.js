import chai from 'chai';

import BacTest from '../bac_src/index';
import {Geona} from '../src/client/js/geona.js';

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
  });
});
