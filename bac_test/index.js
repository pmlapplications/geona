import chai from 'chai';

import * as BacTest from '../bac_test/index';

let expect = chai.expect;

describe('bac_test/index.js', () => {
    describe('me should be an object', () => {
        let me = new BacTest('Ben');
        expect(me).to.be.an.object();
        expect(me.name).to.equal('Ben');
    });
});
