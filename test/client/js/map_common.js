import chai from 'chai';
import chaiHttp from 'chai-http';
import i18next from 'i18next';

import {selectPropertyLanguage, findNearestValidTime} from '../../../src/client/js/map_common';

chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_common', function() {
  describe('selectPropertyLanguage', function() {
    i18next.language = 'en-GB';
    it('should return the en-GB title', function() {
      let returnedTitle = selectPropertyLanguage({'en': 'TitleEn', 'en-GB': 'TitleEnGB'});
      expect(returnedTitle).to.equal('TitleEnGB');
    });
    it('should return the en title', function() {
      let returnedTitle = selectPropertyLanguage({en: 'TitleEn', fr: 'TitleFr'});
      expect(returnedTitle).to.equal('TitleEn');
    });
    it('should return the en title', function() {
      let returnedTitle = selectPropertyLanguage({und: 'TitleUnd', en: 'TitleEn'});
      expect(returnedTitle).to.equal('TitleEn');
    });
    it('should return the und title', function() {
      let returnedTitle = selectPropertyLanguage({und: 'TitleUnd', fr: 'TitleFr'});
      expect(returnedTitle).to.equal('TitleUnd');
    });
    it('should return the nl title', function() {
      let returnedTitle = selectPropertyLanguage({nl: 'TitleNl', fr: 'TitleFr'});
      expect(returnedTitle).to.equal('TitleNl');
    });
    it('should return the nl title', function() {
      let returnedTitle = selectPropertyLanguage({nl: 'TitleNl'});
      expect(returnedTitle).to.equal('TitleNl');
    });
  });

  describe('findNearestValidTime', function() {
    // We use the bare skeleton of what we need for this GeonaLayer
    let geonaLayer = {
      dimensions: {
        time: {
          default: '2008-08-08T00:00:00.000Z',
          values: [
            '1997-01-01T00:00:00.000Z',
            '2001-05-05T00:00:00.000Z',
            '2008-08-08T00:00:00.000Z',
            '2015-03-03T00:00:00.000Z',
          ],
        },
      },
    };

    it('should return 2015-03-03T00:00:00.000Z', function() {
      // Find exact time
      let time = findNearestValidTime(geonaLayer.dimensions.time.values, '2015-03-03T00:00:00.000Z');
      expect(time).to.equal('2015-03-03T00:00:00.000Z');
    });
    it('should return 1997-01-01T00:00:00.000Z', function() {
      // Find nearest time below
      let time = findNearestValidTime(geonaLayer.dimensions.time.values, '1998-03-03T00:00:00.000Z');
      expect(time).to.equal('1997-01-01T00:00:00.000Z');
    });
    it('should return 2001-05-05T00:00:00.000Z', function() {
      // Not go forwards in time, even when bordering a valid time
      let time = findNearestValidTime(geonaLayer.dimensions.time.values, '2008-08-07T00:00:00.000Z');
      expect(time).to.equal('2001-05-05T00:00:00.000Z');
    });
    it('should return undefined because the requested time is too far in the past', function() {
      let time = findNearestValidTime(geonaLayer.dimensions.time.values, '1996-08-07T00:00:00.000Z');
      expect(time).to.be.undefined;
    });
    it('should return undefined because the requested time is too far in the future', function() {
      let time = findNearestValidTime(geonaLayer.dimensions.time.values, '2200-08-07T00:00:00.000Z');
      expect(time).to.be.undefined;
    });
  });

  describe('getLayers', function() {
    // Data servers used in all respective tests
    let testUrlWms = 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?service=WMS&version=1.3.0&request=GetCapabilities';
    let testUrlWmts = 'http://viewer.globalland.vgt.vito.be/mapcache/wmts?service=WMTS&request=GetCapabilities';

    before(function() {
      // delete created file
    });

    describe('config retrieval without saving', function() {
      it('should fetch some WMS layers', function() {

      });
      it('should not have saved the retrieved WMS config', function() {

      });
      it('should fetch some WMTS layers', function() {

      });
      it('should not have saved the retrieved WMTS config', function() {

      });
    });
    describe('config retrieval with saving', function() {
      it('should fetch some WMS layers', function() {

      });
      it('should have saved the retrieved WMS config', function() {

      });
      it('should fetch some WMTS layers', function() {

      });
      it('should have saved the retrieved WMTS config', function() {

      });
    });
    describe('config retrieval from cache', function() {
      it('should fetch some WMS layers from cache', function() {

      });
      it('should fetch some WMTS layers from cache', function() {

      });
    });
  });
});
