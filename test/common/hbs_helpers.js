import chai from 'chai';
import hbs from 'hbs';
import fs from 'fs';
import {registerHelpers} from '../../src/common/hbs_helpers';

let expect = chai.expect;

registerHelpers(hbs);
let helpers = hbs.handlebars.helpers;

describe('common hbs_helpers', () => {
  describe('General logic helpers', () => {
    describe('eq', () => {
      it('should correctly check equality', () => {
        expect(helpers.eq(1, 1)).to.be.true;
        expect(helpers.eq(1, 2)).to.be.false;
      });
    });
    describe('ne', () => {
      it('should correctly check not equality', () => {
        expect(helpers.ne(1, 2)).to.be.true;
        expect(helpers.ne(1, 1)).to.be.false;
      });
    });
    describe('lt', () => {
      it('should correctly check less than', () => {
        expect(helpers.lt(1, 2)).to.be.true;
        expect(helpers.lt(2, 1)).to.be.false;
      });
    });
    describe('gt', () => {
      it('should correctly check greater than', () => {
        expect(helpers.gt(2, 1)).to.be.true;
        expect(helpers.gt(1, 2)).to.be.false;
      });
    });
    describe('lte', () => {
      it('should correctly check less than or equal', () => {
        expect(helpers.lte(1, 1)).to.be.true;
        expect(helpers.lte(1, 2)).to.be.true;
        expect(helpers.lte(2, 1)).to.be.false;
      });
    });
    describe('gte', () => {
      it('should correctly check greater than or equal', () => {
        expect(helpers.gte(1, 1)).to.be.true;
        expect(helpers.gte(2, 1)).to.be.true;
        expect(helpers.gte(1, 2)).to.be.false;
      });
    });
    describe('and', () => {
      it('should correctly check that all args are true', () => {
        expect(helpers.and(true)).to.be.true;
        expect(helpers.and(true, true)).to.be.true;
        expect(helpers.and(true, true, true)).to.be.true;
        expect(helpers.and(true, false, true)).to.be.false;
      });
    });
    describe('or', () => {
      it('should correctly check that some args are true', () => {
        expect(helpers.or(true)).to.be.true;
        expect(helpers.or(true, false)).to.be.true;
        expect(helpers.or(false, false, true)).to.be.true;
        expect(helpers.or(true, true, true)).to.be.true;
        expect(helpers.or(false, false, false)).to.be.false;
      });
    });
  });
  describe('switch case', () => {
    it('should select the correct case', () => {
      let templateFile = fs.readFileSync(global.test.resPath + '/common/hbs_helpers/switch_case.hbs', 'utf8');
      let template = hbs.handlebars.compile(templateFile);
      expect(template({color: 'purple'})).to.equal('Purple!\n');
      expect(template({color: 'blue'})).to.equal('Blue!\n');
      expect(template({color: 'red'})).to.equal('Red or green!\n');
      expect(template({color: 'green'})).to.equal('Red or green!\n');
    });
  });
});
