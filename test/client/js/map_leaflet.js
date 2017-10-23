import chai from 'chai';
import chaiHttp from 'chai-http';
import $ from 'jquery';

// import {LMap} from '../../../src/client/js/map_leaflet';

chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_leaflet', () => {
  // before(function() {
  //   console.log(window);
  //   if (window.__html__) {
  //     document.body.innerHTML = window.__html__['../index.html'];
  //   }
  // });
  // describe('constructor', function() {
  //   it('should successfully create an LMap object', function() {
  //     let map = new LMap({}, document.body);
  //     console.log(map);
  //     console.log('running constructor test');
  //     expect('').to.equal('');
  //   });
  // });

  describe('OpenLayers', function() {
    it('should exist', function() {
      $('#ol').hasClass('geona-container');
    });
  });
});
