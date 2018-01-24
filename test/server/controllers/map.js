import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';

import {resetParameterTypes} from '../../../src/server/controllers/map';

chai.use(chaiHttp);
let expect = chai.expect;

describe('server/controllers/map', function() {
  describe('getCache()', function() {
    before(function() {
      // Write a TEMPORARY_TEST_FILE.json
    });

    it('should return the file', function() {
      // look for TEMPORARY_TEST_FILE.json
      // How does this work if the server stuff returns over a network
    });
    it('should return a 404 error', function() {
      // Look for '.json'
    });

    after(function() {
      // Delete the TEMPORARY_TEST_FILE.json
    });
  });

  describe('getLayerServerFromCacheOrUrl()', function() {
    it('should make a request to the URL and find a LayerServer', function() {

    });
    it('should have saved the LayerServer', function() {

    });
    it('should make a request to the cache and find a LayerServer', function() {


      // afterwards delete cached file in preparation for next test
    });
    it('should make a request to the URL and not save the LayerServer', function() {

    });
  });

  describe('resetParameterTypes()', function() {
    it('should return a decimal number', function() {
      let float = resetParameterTypes(['3.64'])[0];
      expect(float).to.equal(3.64);
      expect(typeof float).to.equal('number');
    });
    it('should return an integer number', function() {
      let integer = resetParameterTypes(['70'])[0];
      expect(integer).to.equal(70);
      expect(typeof integer).to.equal('number');
    });
    it('should return Infinity', function() {
      let infinity = resetParameterTypes(['Infinity'])[0];
      expect(infinity).to.equal(Infinity);
    });
    it('should return negative Infinity', function() {
      let negInfinity = resetParameterTypes(['-Infinity'])[0];
      expect(negInfinity).to.equal(-Infinity);
    });
    it('should return a string', function() {
      let string = resetParameterTypes(['test'])[0];
      expect(typeof string).to.equal('string');
    });
    it('should return undefined', function() {
      let undef = resetParameterTypes(['undefined'])[0];
      expect(undef).to.equal(undefined);
      expect(typeof undef).to.equal('undefined');
    });
    it('should return null', function() {
      let nul = resetParameterTypes(['null'])[0];
      expect(nul).to.equal(null);
      expect(typeof nul).to.equal('object');
    });
    it('should return a Boolean true', function() {
      let tru = resetParameterTypes(['true'])[0];
      expect(tru).to.equal(true);
      expect(typeof tru).to.equal('boolean');
    });
    it('should return a Boolean false', function() {
      let fals = resetParameterTypes(['false'])[0];
      expect(fals).to.equal(false);
      expect(typeof fals).to.equal('boolean');
    });
  });
});
