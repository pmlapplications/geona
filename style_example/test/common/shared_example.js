import chai from 'chai';

import {reverseString} from '../../lib/common/shared_example';

let expect = chai.expect;

describe('shared_example', function() {
  describe('reverseString', function() {
    it('should correctly reverse a string', function() {
      let reversedString = reverseString('hello');
      expect(reversedString).to.equal('olleh');
    });
  });
});
