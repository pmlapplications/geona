import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';

import $ from 'jquery';
import {load} from '../../../src/client_loader/loader.js';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_openlayers', function() {
  let geona;
  before(function(done) {
    this.timeout(5000); // eslint-disable-line no-invalid-this

    /**
     * Called when the map has finished creation and exists as an object.
     * @param {*} geonaParam Unused here, not sure if it's used in normal circumstances.
     */
    function geonaOnReady() {
      console.log('Geona is ready.');
      geona = window.geonaTest;
      done();
    }
    window.geonaOnReady = geonaOnReady;


    let config1 = {
      geonaVariable: 'geonaTest',
      onReadyCallback: 'geonaOnReady',
      divId: 'oltest',
      map: {
        graticule: true,
        bingMapsApiKey: 'AgNtBFpBNF81T-ODIf_9WzE8UF_epbsfiSu9RYMbLfq_wXU_bBVAoyBw8VzfSjkd',
        basemap: 'none',
        countryBorders: 'none',
        data: [],
        basemaps: [
          {
            PROTOCOL: 'wms',
            identifier: 'terrain-light',
            title: {
              und: 'EOX',
            },
            attribution: {
              title: 'EOX',
              onlineResource: 'Terrain Light { Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a> }',
            },
            projections: ['EPSG:4326'],
            formats: ['image/jpeg'],
            isTemporal: false,
            layerServer: {
              layers: ['terrain-light'],
              version: '1.1.1',
              url: 'https://tiles.maps.eox.at/wms/?',
            },
          },
        ],
        borders: [
          {
            identifier: 'line_black',
            PROTOCOL: 'wms',
            title: {
              und: 'Black border lines',
            },
            projections: ['EPSG:4326', 'EPSG:3857'],
            formats: ['image/png'],
            isTemporal: false,
            styles: 'line_black',
            layerServer: {
              layers: ['rsg:full_10m_borders'],
              version: '1.1.0',
              url: 'https://rsg.pml.ac.uk/geoserver/wms?',
            },
          },
        ],
        dataLayers: [],
      },
    };

    Promise.resolve(load(config1)).catch(function(err) {
      console.log('err:');
      console.error(err);
      done();
    });
  });

  describe('test setup completion', function() {
    it('should find the Geona object on the window', function() {
      expect(window.geonaTest).to.be.an('object');
    });
    it('should find that the variable \'geona\' points to the Geona object on the window', function() {
      expect(geona).to.deep.equal(window.geonaTest);
    });
    it('should find two layers - one basemap and one country borders layer'

    );
  });

  describe('getLayersFromWms()', function() {

  });

  describe('addLayer()', function() {
    it('should have four layers in the _mapLayers FeatureGroup', function() {
      // addLayer(layer1);
      // addLayer(layer2);
      // addLayer(layer3);
      // addLayer(layer4);

      // expect(geonaL.map._mapLayers.getLayers().length).to.equal(4);
    });
  });
});
