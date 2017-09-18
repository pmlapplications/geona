import chai from 'chai';
import chaiHttp from 'chai-http';
import i18next from 'i18next';

import {selectPropertyLanguage} from '../../../src/client/js/map_common';

chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_common', () => {
  describe('selectPropertyLanguage', () => {
    i18next.language = 'en-GB';
    it('should return the en-GB title', () => {
      let returnedTitle = selectPropertyLanguage({'en': 'TitleEn', 'en-GB': 'TitleEnGB'});
      expect(returnedTitle).to.equal('TitleEnGB');
    });
    it('should return the en title', () => {
      let returnedTitle = selectPropertyLanguage({en: 'TitleEn', fr: 'TitleFr'});
      expect(returnedTitle).to.equal('TitleEn');
    });
    it('should return the en title', () => {
      let returnedTitle = selectPropertyLanguage({und: 'TitleUnd', en: 'TitleEn'});
      expect(returnedTitle).to.equal('TitleEn');
    });
    it('should return the und title', () => {
      let returnedTitle = selectPropertyLanguage({und: 'TitleUnd', fr: 'TitleFr'});
      expect(returnedTitle).to.equal('TitleUnd');
    });
    it('should return the nl title', () => {
      let returnedTitle = selectPropertyLanguage({nl: 'TitleNl', fr: 'TitleFr'});
      expect(returnedTitle).to.equal('TitleNl');
    });
    it('should return the nl title', () => {
      let returnedTitle = selectPropertyLanguage({nl: 'TitleNl'});
      expect(returnedTitle).to.equal('TitleNl');
    });
  });
});

// describe('server/app', function() {
//   describe('GET /swagger.json', function() {
//     it('should return the swagger json', function(done) {
//       chai.request(app)
//         .get('/swagger.json')
//         .end(function(err, res) {
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
//           done();
//         });
//     });
//   });
// });
