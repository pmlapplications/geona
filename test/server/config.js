import chai from 'chai';

import * as config from '../../src/server/config';
let serverConfig = config.server;
let clientConfig = config.clients;

let expect = chai.expect;

describe('configuration', function() {
  describe('server config', function() {
    it('be an object and include keys for port, subFolderPath and administrators email array', function() {
      expect(serverConfig).to.be.an('object');
      expect(serverConfig.getProperties()).to.be.an('object');
      expect(serverConfig.get('port')).to.be.a('number');
      expect(serverConfig.get('subFolderPath')).to.be.a('string');
      expect(serverConfig.get('OAuth')).to.be.a('array');
      expect(serverConfig.get('administrators')).to.be.a('array');
    });
  });

  describe('client config', function() {
    it('be an object with specific keys', function() {
      expect(clientConfig).to.be.an('object');
      expect(clientConfig.getProperties()).to.be.an('object');
      // TODO: test all elements of the client config once they are fairly static
    });
  });
});
