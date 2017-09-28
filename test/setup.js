import path from 'path';
import httpMocks from 'node-mocks-http';
import eventEmitter from 'eventemitter3';

import * as config from '../src/server/config';

before(function() {
  // Setup global test variables for use in tests
  global.test = {
    depPath: path.join(__dirname, '../test_dependencies/'),
    resPath: path.join(__dirname, '../test_dependencies/resources'),
    expPath: path.join(__dirname, '../test_dependencies/expected'),
  };

  // add functios for creating mock request and response objects
  global.mocks = {
    createReq: function() {
      return httpMocks.createRequest({
        headers: {
          host: '127.0.0.1:' + config.server.get('port'),
        },
        ip: '127.0.0.1',
        session: {
          passport: undefined,
        },
      });
    },
    createRes: function() {
      return httpMocks.createResponse({
        eventEmitter: eventEmitter,
      });
    },
  };
});

after(function() {
  // tasks to clean up after the testing
});
