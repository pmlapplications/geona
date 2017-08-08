import chai from 'chai';
import hbs from 'hbs';
import '../../src/server/hbs_helpers';

let expect = chai.expect;

let helpers = hbs.handlebars.helpers;

describe('hbs_helpers', function() {
  describe('General logic helpers', function() {
    describe('eq', function() {
      it('should correctly check equality', function() {
        expect(helpers.eq(1, 1)).to.be.true;
        expect(helpers.eq(1, 2)).to.be.false;
      });
    });
    describe('ne', function() {
      it('should correctly check not equality', function() {
        expect(helpers.ne(1, 2)).to.be.true;
        expect(helpers.ne(1, 1)).to.be.false;
      });
    });
    describe('lt', function() {
      it('should correctly check less than', function() {
        expect(helpers.lt(1, 2)).to.be.true;
        expect(helpers.lt(2, 1)).to.be.false;
      });
    });
    describe('gt', function() {
      it('should correctly check greater than', function() {
        expect(helpers.gt(2, 1)).to.be.true;
        expect(helpers.gt(1, 2)).to.be.false;
      });
    });
    describe('lte', function() {
      it('should correctly check less than or equal', function() {
        expect(helpers.lte(1, 1)).to.be.true;
        expect(helpers.lte(1, 2)).to.be.true;
        expect(helpers.lte(2, 1)).to.be.false;
      });
    });
    describe('gte', function() {
      it('should correctly check greater than or equal', function() {
        expect(helpers.gte(1, 1)).to.be.true;
        expect(helpers.gte(2, 1)).to.be.true;
        expect(helpers.gte(1, 2)).to.be.false;
      });
    });
    describe('and', function() {
      it('should correctly check that all args are true', function() {
        expect(helpers.and(true)).to.be.true;
        expect(helpers.and(true, true)).to.be.true;
        expect(helpers.and(true, true, true)).to.be.true;
        expect(helpers.and(true, false, true)).to.be.false;
      });
    });
    describe('or', function() {
      it('should correctly check that some args are true', function() {
        expect(helpers.or(true)).to.be.true;
        expect(helpers.or(true, false)).to.be.true;
        expect(helpers.or(false, false, true)).to.be.true;
        expect(helpers.or(true, true, true)).to.be.true;
        expect(helpers.or(false, false, false)).to.be.false;
      });
    });
  });
  describe('switch case', function() {

  });
});
