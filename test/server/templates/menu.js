import chai from 'chai';
import _ from 'lodash';

let expect = chai.expect;

import * as menu from '../../../src/server/templates/menu.js';

describe('server templates', function() {
  describe('menu', function() {
    it('should return an object', function() {
      expect(menu.getMenu()).to.be.an('array');
    });
    it('should return an object with an appropriate \'active\' class', function() {
      let menuArray = menu.getMenu('/about');
      let activeMenuItem = _.find(menuArray, {'active': true, 'path': '/about'});

      expect(activeMenuItem).to.be.an('object');
      expect(activeMenuItem).to.have.all.keys('active', 'path', 'title');
      expect(activeMenuItem.active).to.equal(true);
      expect(activeMenuItem.path).to.equal('/about');
    });
  });
});
