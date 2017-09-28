import chai from 'chai';

let expect = chai.expect;

import * as requestUtils from '../../../src/server/utils/request';

describe('server/utils/request', function() {

  // beforeEach(function() {
  //   let res = global.mocks.createResponse();
  //   let e = {
  //     message: 'This error is friendly',
  //     stack: 'This would be a massive error stack',
  //   };
  // });

  describe('displayFriendlyError', function() {
    it('should return a 500 status', function(done) {
      let res = global.mocks.createRes();
      let e = new ReferenceError('This is a good error');
      // e.stack = 'nice stack :)';

      let output = requestUtils.displayFriendlyError(e, res);
      console.log(output);
      
      expect(output).to.have.status(500);
      done();
    });
  });
});
