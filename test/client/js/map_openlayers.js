import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';

import $ from 'jquery';
import {load} from '../../../src/client_loader/loader.js';

import {getLayersFromWms, getLayersFromWmts} from '../../../src/client/js/map_common.js';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_openlayers', function() {
  // Shorthand for window.geonaTest, used in the actual tests
  let geona;

  before(function(done) {
    this.timeout(5000); // eslint-disable-line no-invalid-this

    /**
     * Called when the map has finished creation and exists as an object.
     */
    function geonaOnReady() {
      console.log('Geona is ready.');
      geona = window.geonaOlTest;
      done();
    }
    window.geonaOnReady = geonaOnReady;

    // TODO put into file
    let config1 = {
      geonaVariable: 'geonaOlTest',
      onReadyCallback: 'geonaOnReady',
      divId: 'oltest',
      map: {
        library: 'openlayers',
        graticule: true,
        bingMapsApiKey: 'AgNtBFpBNF81T-ODIf_9WzE8UF_epbsfiSu9RYMbLfq_wXU_bBVAoyBw8VzfSjkd',
        basemap: 'none',
        borders: 'none',
        data: [],
        basemapLayers: [
          {
            protocol: 'wms',
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
        bordersLayers: [
          {
            identifier: 'line_black',
            protocol: 'wms',
            title: {
              und: 'Black border lines',
            },
            projections: ['EPSG:4326', 'EPSG:3857'],
            formats: ['image/png'],
            isTemporal: false,
            styles: [
              {
                name: 'line_black',
              },
            ],
            layerServer: {
              layers: ['rsg:full_10m_borders'],
              version: '1.1.0',
              url: 'https://rsg.pml.ac.uk/geoserver/wms?',
            },
          },
        ],
        dataLayers: [
          {
            'identifier': 'Rrs_412',
            'protocol': 'wms',
            'title': {
              'und': 'surface_ratio_of_upwelling_radiance_emerging_from_sea_water_to_downwelling_radiative_flux_in_air',
            },
            'abstract': {
              'und': 'Sea surface reflectance defined as the ratio of water-leaving radiance to surface irradiance at 412 nm.',
            },
            'styles': [
              {
                'name': 'boxfill/cmocean_speed',
                'title': 'boxfill/cmocean_speed',
                'abstract': 'boxfill style, using the cmocean_speed palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/ncview',
                'title': 'boxfill/ncview',
                'abstract': 'boxfill style, using the ncview palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/occam',
                'title': 'boxfill/occam',
                'abstract': 'boxfill style, using the occam palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_algae',
                'title': 'boxfill/cmocean_algae',
                'abstract': 'boxfill style, using the cmocean_algae palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_oxy',
                'title': 'boxfill/cmocean_oxy',
                'abstract': 'boxfill style, using the cmocean_oxy palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_haline',
                'title': 'boxfill/cmocean_haline',
                'abstract': 'boxfill style, using the cmocean_haline palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/sst_36',
                'title': 'boxfill/sst_36',
                'abstract': 'boxfill style, using the sst_36 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_dense',
                'title': 'boxfill/cmocean_dense',
                'abstract': 'boxfill style, using the cmocean_dense palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/orange-descending',
                'title': 'boxfill/orange-descending',
                'abstract': 'boxfill style, using the orange-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cci_blue_red',
                'title': 'boxfill/cci_blue_red',
                'abstract': 'boxfill style, using the cci_blue_red palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_turbid',
                'title': 'boxfill/cmocean_turbid',
                'abstract': 'boxfill style, using the cmocean_turbid palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_tempo',
                'title': 'boxfill/cmocean_tempo',
                'abstract': 'boxfill style, using the cmocean_tempo palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_deep',
                'title': 'boxfill/cmocean_deep',
                'abstract': 'boxfill style, using the cmocean_deep palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_curl',
                'title': 'boxfill/cmocean_curl',
                'abstract': 'boxfill style, using the cmocean_curl palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_thermal',
                'title': 'boxfill/cmocean_thermal',
                'abstract': 'boxfill style, using the cmocean_thermal palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/blue-descending',
                'title': 'boxfill/blue-descending',
                'abstract': 'boxfill style, using the blue-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/redblue-reverse',
                'title': 'boxfill/redblue-reverse',
                'abstract': 'boxfill style, using the redblue-reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/soil-moisture',
                'title': 'boxfill/soil-moisture',
                'abstract': 'boxfill style, using the soil-moisture palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_phase',
                'title': 'boxfill/cmocean_phase',
                'abstract': 'boxfill style, using the cmocean_phase palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/alg',
                'title': 'boxfill/alg',
                'abstract': 'boxfill style, using the alg palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cci_main',
                'title': 'boxfill/cci_main',
                'abstract': 'boxfill style, using the cci_main palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/orange',
                'title': 'boxfill/orange',
                'abstract': 'boxfill style, using the orange palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/greyscale',
                'title': 'boxfill/greyscale',
                'abstract': 'boxfill style, using the greyscale palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/greyscale-reverse',
                'title': 'boxfill/greyscale-reverse',
                'abstract': 'boxfill style, using the greyscale-reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/balance-blue',
                'title': 'boxfill/balance-blue',
                'abstract': 'boxfill style, using the balance-blue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_ice',
                'title': 'boxfill/cmocean_ice',
                'abstract': 'boxfill style, using the cmocean_ice palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_delta',
                'title': 'boxfill/cmocean_delta',
                'abstract': 'boxfill style, using the cmocean_delta palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_balance',
                'title': 'boxfill/cmocean_balance',
                'abstract': 'boxfill style, using the cmocean_balance palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_solar',
                'title': 'boxfill/cmocean_solar',
                'abstract': 'boxfill style, using the cmocean_solar palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/occam_pastel-30',
                'title': 'boxfill/occam_pastel-30',
                'abstract': 'boxfill style, using the occam_pastel-30 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/ferret',
                'title': 'boxfill/ferret',
                'abstract': 'boxfill style, using the ferret palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/redblue',
                'title': 'boxfill/redblue',
                'abstract': 'boxfill style, using the redblue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/colour-blind-safe',
                'title': 'boxfill/colour-blind-safe',
                'abstract': 'boxfill style, using the colour-blind-safe palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/alg2',
                'title': 'boxfill/alg2',
                'abstract': 'boxfill style, using the alg2 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_gray',
                'title': 'boxfill/cmocean_gray',
                'abstract': 'boxfill style, using the cmocean_gray palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/blue',
                'title': 'boxfill/blue',
                'abstract': 'boxfill style, using the blue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_matter',
                'title': 'boxfill/cmocean_matter',
                'abstract': 'boxfill style, using the cmocean_matter palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_amp',
                'title': 'boxfill/cmocean_amp',
                'abstract': 'boxfill style, using the cmocean_amp palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/green-descending',
                'title': 'boxfill/green-descending',
                'abstract': 'boxfill style, using the green-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_balance_reverse',
                'title': 'boxfill/cmocean_balance_reverse',
                'abstract': 'boxfill style, using the cmocean_balance_reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/rainbow',
                'title': 'boxfill/rainbow',
                'abstract': 'boxfill style, using the rainbow palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
            ],
            'projections': [
              'EPSG:4326',
              'CRS:84',
              'EPSG:41001',
              'EPSG:27700',
              'EPSG:3408',
              'EPSG:3409',
              'EPSG:3857',
              'EPSG:900913',
              'EPSG:32661',
              'EPSG:32761',
            ],
            'boundingBox': {
              'minLat': '-89.97916412353516',
              'minLon': '-179.9791717529297',
              'maxLat': '89.97916412353516',
              'maxLon': '179.9791717529297',
            },
            'dimensions': {
              'time': {
                'units': 'unknown',
                'default': '2015-12-27T00:00:00.000Z',
                'multipleValues': true,
                'nearestValue': false,
                'current': true,
                'values': [
                  '1998-01-01T00:00:00.000Z',
                  '2005-07-30T00:00:00.000Z',
                  '2015-12-27T00:00:00.000Z',
                ],
              },
            },
            'layerServer': {
              layers: ['Rrs_412'],
              version: '1.3.0',
              url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY',
            },
          },
          {
            'identifier': 'Rrs_443',
            'protocol': 'wms',
            'title': {
              'und': 'surface_ratio_of_upwelling_radiance_emerging_from_sea_water_to_downwelling_radiative_flux_in_air',
            },
            'abstract': {
              'und': 'Sea surface reflectance defined as the ratio of water-leaving radiance to surface irradiance at 443 nm.',
            },
            'styles': [
              {
                'name': 'boxfill/cmocean_speed',
                'title': 'boxfill/cmocean_speed',
                'abstract': 'boxfill style, using the cmocean_speed palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/ncview',
                'title': 'boxfill/ncview',
                'abstract': 'boxfill style, using the ncview palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/occam',
                'title': 'boxfill/occam',
                'abstract': 'boxfill style, using the occam palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_algae',
                'title': 'boxfill/cmocean_algae',
                'abstract': 'boxfill style, using the cmocean_algae palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_oxy',
                'title': 'boxfill/cmocean_oxy',
                'abstract': 'boxfill style, using the cmocean_oxy palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_haline',
                'title': 'boxfill/cmocean_haline',
                'abstract': 'boxfill style, using the cmocean_haline palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/sst_36',
                'title': 'boxfill/sst_36',
                'abstract': 'boxfill style, using the sst_36 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_dense',
                'title': 'boxfill/cmocean_dense',
                'abstract': 'boxfill style, using the cmocean_dense palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/orange-descending',
                'title': 'boxfill/orange-descending',
                'abstract': 'boxfill style, using the orange-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cci_blue_red',
                'title': 'boxfill/cci_blue_red',
                'abstract': 'boxfill style, using the cci_blue_red palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_turbid',
                'title': 'boxfill/cmocean_turbid',
                'abstract': 'boxfill style, using the cmocean_turbid palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_tempo',
                'title': 'boxfill/cmocean_tempo',
                'abstract': 'boxfill style, using the cmocean_tempo palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_deep',
                'title': 'boxfill/cmocean_deep',
                'abstract': 'boxfill style, using the cmocean_deep palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_curl',
                'title': 'boxfill/cmocean_curl',
                'abstract': 'boxfill style, using the cmocean_curl palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_thermal',
                'title': 'boxfill/cmocean_thermal',
                'abstract': 'boxfill style, using the cmocean_thermal palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/blue-descending',
                'title': 'boxfill/blue-descending',
                'abstract': 'boxfill style, using the blue-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/redblue-reverse',
                'title': 'boxfill/redblue-reverse',
                'abstract': 'boxfill style, using the redblue-reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/soil-moisture',
                'title': 'boxfill/soil-moisture',
                'abstract': 'boxfill style, using the soil-moisture palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_phase',
                'title': 'boxfill/cmocean_phase',
                'abstract': 'boxfill style, using the cmocean_phase palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/alg',
                'title': 'boxfill/alg',
                'abstract': 'boxfill style, using the alg palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cci_main',
                'title': 'boxfill/cci_main',
                'abstract': 'boxfill style, using the cci_main palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/orange',
                'title': 'boxfill/orange',
                'abstract': 'boxfill style, using the orange palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/greyscale',
                'title': 'boxfill/greyscale',
                'abstract': 'boxfill style, using the greyscale palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/greyscale-reverse',
                'title': 'boxfill/greyscale-reverse',
                'abstract': 'boxfill style, using the greyscale-reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/balance-blue',
                'title': 'boxfill/balance-blue',
                'abstract': 'boxfill style, using the balance-blue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_ice',
                'title': 'boxfill/cmocean_ice',
                'abstract': 'boxfill style, using the cmocean_ice palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_delta',
                'title': 'boxfill/cmocean_delta',
                'abstract': 'boxfill style, using the cmocean_delta palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_balance',
                'title': 'boxfill/cmocean_balance',
                'abstract': 'boxfill style, using the cmocean_balance palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_solar',
                'title': 'boxfill/cmocean_solar',
                'abstract': 'boxfill style, using the cmocean_solar palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/occam_pastel-30',
                'title': 'boxfill/occam_pastel-30',
                'abstract': 'boxfill style, using the occam_pastel-30 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/ferret',
                'title': 'boxfill/ferret',
                'abstract': 'boxfill style, using the ferret palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/redblue',
                'title': 'boxfill/redblue',
                'abstract': 'boxfill style, using the redblue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/colour-blind-safe',
                'title': 'boxfill/colour-blind-safe',
                'abstract': 'boxfill style, using the colour-blind-safe palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/alg2',
                'title': 'boxfill/alg2',
                'abstract': 'boxfill style, using the alg2 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_gray',
                'title': 'boxfill/cmocean_gray',
                'abstract': 'boxfill style, using the cmocean_gray palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/blue',
                'title': 'boxfill/blue',
                'abstract': 'boxfill style, using the blue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_matter',
                'title': 'boxfill/cmocean_matter',
                'abstract': 'boxfill style, using the cmocean_matter palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_amp',
                'title': 'boxfill/cmocean_amp',
                'abstract': 'boxfill style, using the cmocean_amp palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/green-descending',
                'title': 'boxfill/green-descending',
                'abstract': 'boxfill style, using the green-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_balance_reverse',
                'title': 'boxfill/cmocean_balance_reverse',
                'abstract': 'boxfill style, using the cmocean_balance_reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/rainbow',
                'title': 'boxfill/rainbow',
                'abstract': 'boxfill style, using the rainbow palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
            ],
            'projections': [
              'EPSG:4326',
              'CRS:84',
              'EPSG:41001',
              'EPSG:27700',
              'EPSG:3408',
              'EPSG:3409',
              'EPSG:3857',
              'EPSG:900913',
              'EPSG:32661',
              'EPSG:32761',
            ],
            'boundingBox': {
              'minLat': '-89.97916412353516',
              'minLon': '-179.9791717529297',
              'maxLat': '89.97916412353516',
              'maxLon': '179.9791717529297',
            },
            'dimensions': {
              'time': {
                'units': 'unknown',
                'default': '2015-12-27T00:00:00.000Z',
                'multipleValues': true,
                'nearestValue': false,
                'current': true,
                'values': [
                  '1999-12-27T00:00:00.000Z',
                  '2010-01-26T00:00:00.000Z',
                  '2015-12-22T00:00:00.000Z',
                  '2015-12-27T00:00:00.000Z',
                ],
              },
            },
            'layerServer': {
              layers: ['Rrs_443'],
              version: '1.3.0',
              url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY',
            },
          },
          {
            'identifier': 'Rrs_490',
            'protocol': 'wms',
            'title': {
              'und': 'surface_ratio_of_upwelling_radiance_emerging_from_sea_water_to_downwelling_radiative_flux_in_air',
            },
            'abstract': {
              'und': 'Sea surface reflectance defined as the ratio of water-leaving radiance to surface irradiance at 490 nm.',
            },
            'styles': [
              {
                'name': 'boxfill/cmocean_speed',
                'title': 'boxfill/cmocean_speed',
                'abstract': 'boxfill style, using the cmocean_speed palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/ncview',
                'title': 'boxfill/ncview',
                'abstract': 'boxfill style, using the ncview palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/occam',
                'title': 'boxfill/occam',
                'abstract': 'boxfill style, using the occam palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_algae',
                'title': 'boxfill/cmocean_algae',
                'abstract': 'boxfill style, using the cmocean_algae palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_oxy',
                'title': 'boxfill/cmocean_oxy',
                'abstract': 'boxfill style, using the cmocean_oxy palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_haline',
                'title': 'boxfill/cmocean_haline',
                'abstract': 'boxfill style, using the cmocean_haline palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/sst_36',
                'title': 'boxfill/sst_36',
                'abstract': 'boxfill style, using the sst_36 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_dense',
                'title': 'boxfill/cmocean_dense',
                'abstract': 'boxfill style, using the cmocean_dense palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/orange-descending',
                'title': 'boxfill/orange-descending',
                'abstract': 'boxfill style, using the orange-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cci_blue_red',
                'title': 'boxfill/cci_blue_red',
                'abstract': 'boxfill style, using the cci_blue_red palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_turbid',
                'title': 'boxfill/cmocean_turbid',
                'abstract': 'boxfill style, using the cmocean_turbid palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_tempo',
                'title': 'boxfill/cmocean_tempo',
                'abstract': 'boxfill style, using the cmocean_tempo palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_deep',
                'title': 'boxfill/cmocean_deep',
                'abstract': 'boxfill style, using the cmocean_deep palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_curl',
                'title': 'boxfill/cmocean_curl',
                'abstract': 'boxfill style, using the cmocean_curl palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_thermal',
                'title': 'boxfill/cmocean_thermal',
                'abstract': 'boxfill style, using the cmocean_thermal palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/blue-descending',
                'title': 'boxfill/blue-descending',
                'abstract': 'boxfill style, using the blue-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/redblue-reverse',
                'title': 'boxfill/redblue-reverse',
                'abstract': 'boxfill style, using the redblue-reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/soil-moisture',
                'title': 'boxfill/soil-moisture',
                'abstract': 'boxfill style, using the soil-moisture palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_phase',
                'title': 'boxfill/cmocean_phase',
                'abstract': 'boxfill style, using the cmocean_phase palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/alg',
                'title': 'boxfill/alg',
                'abstract': 'boxfill style, using the alg palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cci_main',
                'title': 'boxfill/cci_main',
                'abstract': 'boxfill style, using the cci_main palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/orange',
                'title': 'boxfill/orange',
                'abstract': 'boxfill style, using the orange palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/greyscale',
                'title': 'boxfill/greyscale',
                'abstract': 'boxfill style, using the greyscale palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/greyscale-reverse',
                'title': 'boxfill/greyscale-reverse',
                'abstract': 'boxfill style, using the greyscale-reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/balance-blue',
                'title': 'boxfill/balance-blue',
                'abstract': 'boxfill style, using the balance-blue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_ice',
                'title': 'boxfill/cmocean_ice',
                'abstract': 'boxfill style, using the cmocean_ice palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_delta',
                'title': 'boxfill/cmocean_delta',
                'abstract': 'boxfill style, using the cmocean_delta palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_balance',
                'title': 'boxfill/cmocean_balance',
                'abstract': 'boxfill style, using the cmocean_balance palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_solar',
                'title': 'boxfill/cmocean_solar',
                'abstract': 'boxfill style, using the cmocean_solar palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/occam_pastel-30',
                'title': 'boxfill/occam_pastel-30',
                'abstract': 'boxfill style, using the occam_pastel-30 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/ferret',
                'title': 'boxfill/ferret',
                'abstract': 'boxfill style, using the ferret palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/redblue',
                'title': 'boxfill/redblue',
                'abstract': 'boxfill style, using the redblue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/colour-blind-safe',
                'title': 'boxfill/colour-blind-safe',
                'abstract': 'boxfill style, using the colour-blind-safe palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/alg2',
                'title': 'boxfill/alg2',
                'abstract': 'boxfill style, using the alg2 palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_gray',
                'title': 'boxfill/cmocean_gray',
                'abstract': 'boxfill style, using the cmocean_gray palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/blue',
                'title': 'boxfill/blue',
                'abstract': 'boxfill style, using the blue palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_matter',
                'title': 'boxfill/cmocean_matter',
                'abstract': 'boxfill style, using the cmocean_matter palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_amp',
                'title': 'boxfill/cmocean_amp',
                'abstract': 'boxfill style, using the cmocean_amp palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/green-descending',
                'title': 'boxfill/green-descending',
                'abstract': 'boxfill style, using the green-descending palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/cmocean_balance_reverse',
                'title': 'boxfill/cmocean_balance_reverse',
                'abstract': 'boxfill style, using the cmocean_balance_reverse palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
              {
                'name': 'boxfill/rainbow',
                'title': 'boxfill/rainbow',
                'abstract': 'boxfill style, using the rainbow palette ',
                'legendUrl': [
                  {
                    'width': '110',
                    'height': '264',
                    'format': {
                      'TYPE_NAME': 'WMS_1_1_1.Format',
                      'value': 'image/png',
                    },
                    'onlineResource': {

                    },
                  },
                ],
              },
            ],
            'projections': [
              'EPSG:4326',
              'CRS:84',
              'EPSG:41001',
              'EPSG:27700',
              'EPSG:3408',
              'EPSG:3409',
              'EPSG:3857',
              'EPSG:900913',
              'EPSG:32661',
              'EPSG:32761',
            ],
            'boundingBox': {
              'minLat': '-89.97916412353516',
              'minLon': '-179.9791717529297',
              'maxLat': '89.97916412353516',
              'maxLon': '179.9791717529297',
            },
            'dimensions': {
              'time': {
                'units': 'unknown',
                'default': '1997-09-04T00:00:00.000Z',
                'multipleValues': true,
                'nearestValue': false,
                'current': true,
                'values': [
                  '1997-09-04T00:00:00.000Z',
                  '2001-04-01T00:00:00.000Z',
                  '2008-08-08T00:00:00.000Z',
                  '2015-12-27T00:00:00.000Z',
                ],
              },
            },
            'layerServer': {
              layers: ['Rrs_490'],
              version: '1.3.0',
              url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY',
            },
          },
        ],
      },
    };

    Promise.resolve(load(config1)).catch(function(err) {
      console.error(err);
      done();
    });
  });

  describe('constructor', function() {
    // Add new config to test default loading basemaps, data and borders
    after(function() {
      // Remove it all I guess
    });
  });

  describe('test setup completion', function() {
    it('should find the Geona object on the window', function() {
      expect(window.geonaOlTest).to.be.an('object');
    });
    it('should find that the variable \'geona\' points to the Geona object on the window', function() {
      expect(geona).to.deep.equal(window.geonaOlTest);
    });
    it('should find seven layers in _availableLayers', function() {
      let availableLayersArray = Object.keys(geona.map._availableLayers);
      expect(availableLayersArray.length).to.equal(7);
    });
  });

  describe('addLayer()', function() {
    // The data layer we are adding to the map
    let dataLayer;
    // The list of layers on the map - could replace _activeLayers?
    let mapLayers;

    before(function() {
      dataLayer = geona.map._availableLayers.Rrs_412;
      geona.map.addLayer(dataLayer);
    });

    it('should have added a data layer to the map', function() {
      mapLayers = geona.map._map.getLayers();
      // Also tests that there isn't another layer on the map (index 0 should be the only one with data)
      expect(mapLayers.getArray()[0].get('identifier')).to.equal(dataLayer.identifier);
    });
    it('should have added that layer to _availableLayers', function() {
      expect(geona.map._availableLayers[dataLayer.identifier]).to.not.be.undefined;
    });
    it('should have added that layer to _activeLayers', function() {
      expect(geona.map._activeLayers[dataLayer.identifier]).to.not.be.undefined;
    });
    it('should only have one layer on the map', function() {
      expect(mapLayers.getArray().length).to.equal(1);
      expect(Object.keys(geona.map._activeLayers).length).to.equal(1);
    });
    it('should add the basemap modifier to basemaps', function() {
      geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
      expect(geona.map._activeLayers['terrain-light'].get('modifier')).to.equal('basemap');
    });
    it('should display the correct attribution for basemaps', function() {
      let html = geona.map._map.getLayers().getArray()[1].getSource().getAttributions()[0].getHTML();
      expect(html).to.deep.equal('Geona | ' + geona.map.config.basemapLayers[0].attribution.onlineResource);
    });
    it('should add the borders modifier to borders layers', function() {
      geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
      expect(geona.map._activeLayers.line_black.get('modifier')).to.equal('borders');
    });
    it('should remove the previous basemap when a new basemap is added', function() {
      geona.map.addLayer(geona.map._availableLayers.s2cloudless, 'basemap');
      // Amount of expects might be a bit overkill
      expect(geona.map._activeLayers.s2cloudless).to.not.be.undefined;
      expect(geona.map._activeLayers['terrain-light']).to.be.undefined;
      let numberOfBasemapModifiers = 0;
      for (let layer of geona.map._map.getLayers().getArray()) {
        if (layer.get('modifier') === 'basemap') {
          numberOfBasemapModifiers += 1;
          expect(numberOfBasemapModifiers).to.equal(1);
        }
      }
    });
    it('should remove the previous borders when a new borders layer is added', function() {
      geona.map.addLayer(geona.map._availableLayers.line, 'borders');
      // Amount of expects might be a bit overkill
      expect(geona.map._activeLayers.line_black).to.be.undefined;
      expect(geona.map._activeLayers.line).to.not.be.undefined;
      let numberOfBordersModifiers = 0;
      for (let layer of geona.map._map.getLayers().getArray()) {
        if (layer.get('modifier') === 'borders') {
          numberOfBordersModifiers += 1;
          expect(numberOfBordersModifiers).to.equal(1);
        }
      }
    });
  });

  describe('removeLayer()', function() {
    let data;
    let basemap;
    let borders;

    before(function() {
      for (let layer of geona.map._map.getLayers().getArray()) {
        if (layer.get('modifier') === undefined) {
          data = layer;
        } else if (layer.get('modifier') === 'basemap') {
          basemap = layer;
        } else if (layer.get('modifier') === 'borders') {
          borders = layer;
        }
      }
    });

    it('should remove the layer from the map', function() {
      geona.map.removeLayer(data.get('identifier'));
      expect(geona.map._map.getLayers().getArray()).to.not.include(data);
    });
    it('should remove the layer from the _activeLayers', function() {
      expect(geona.map._activeLayers[data.get('identifier')]).to.be.undefined;
    });
    it('should remove the basemap from the map', function() {
      geona.map.removeLayer(basemap.get('identifier'));
      expect(geona.map._map.getLayers().getArray()).to.not.include(basemap);
    });
    it('should remove the basemap from the _activeLayers', function() {
      expect(geona.map._activeLayers[basemap.get('identifier')]).to.be.undefined;
    });
    it('should set the config basemap to be \'none\'', function() {
      expect(geona.map.config.basemap).to.equal('none');
    });
    it('should remove the borders from the map', function() {
      geona.map.removeLayer(borders.get('identifier'));
      expect(geona.map._map.getLayers().getArray()).to.not.include(borders);
    });
    it('should remove the borders from the _activeLayers', function() {
      expect(geona.map._activeLayers[borders.get('identifier')]).to.be.undefined;
    });
    it('should set the config borders to be \'none\'', function() {
      expect(geona.map.config.borders).to.equal('none');
    });
  });

  // These tests might have too much duplication (i.e. could be made to test in fewer lines of code).
  // They also might not be comprehensive, as reorderLayers() deals with a variety of situations.
  // TODO tests for zIndices where a data layer has been removed from the middle of the stack
  describe('reorderLayers()', function() {
    describe('reordering - 1x basemap, 1x borders, 0x data', function() {
      before(function() {
        // Basic setup with one basemap and one borders layer.
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
        geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') < lowestZIndex) {
            lowestZIndex = layer.get('zIndex');
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 0) {
            expect(layer.get('modifier')).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 1', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') > highestZIndex) {
            highestZIndex = layer.get('zIndex');
          }
        }
        expect(highestZIndex).to.equal(1);
      });
      it('should find a borders layer at zIndex 1', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 1) {
            expect(layer.get('modifier')).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('terrain-light');
        geona.map.removeLayer('line_black');
      });
    });

    describe('reordering - 1x basemap, 1x borders, 1x data', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
        geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
        geona.map.addLayer(geona.map._availableLayers.Rrs_412);
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') < lowestZIndex) {
            lowestZIndex = layer.get('zIndex');
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 0) {
            expect(layer.get('modifier')).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 2', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') > highestZIndex) {
            highestZIndex = layer.get('zIndex');
          }
        }
        expect(highestZIndex).to.equal(2);
      });
      it('should find a borders layer at zIndex 2', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 2) {
            expect(layer.get('modifier')).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, 2, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1, 2]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('terrain-light');
        geona.map.removeLayer('line_black');
        geona.map.removeLayer('Rrs_412');
      });
    });

    describe('reordering - 1x data, 1x borders, 1x basemap', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(geona.map._availableLayers.Rrs_412);
        geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') < lowestZIndex) {
            lowestZIndex = layer.get('zIndex');
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 0) {
            expect(layer.get('modifier')).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 2', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') > highestZIndex) {
            highestZIndex = layer.get('zIndex');
          }
        }
        expect(highestZIndex).to.equal(2);
      });
      it('should find a borders layer at zIndex 2', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 2) {
            expect(layer.get('modifier')).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, 2, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1, 2]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('Rrs_412');
        geona.map.removeLayer('line_black');
        geona.map.removeLayer('terrain-light');
      });
    });

    describe('reordering - 1x data, 1x borders, 1x basemap, basemap removed', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
        geona.map.addLayer(geona.map._availableLayers.Rrs_412);
        geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
        geona.map.removeLayer('terrain-light');
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') < lowestZIndex) {
            lowestZIndex = layer.get('zIndex');
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a data layer at zIndex 0', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 0) {
            expect(layer.get('modifier')).to.be.undefined;
          }
        }
      });
      it('should have set the highest zIndex to be 1', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') > highestZIndex) {
            highestZIndex = layer.get('zIndex');
          }
        }
        expect(highestZIndex).to.equal(1);
      });
      it('should find a borders layer at zIndex 1', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 1) {
            expect(layer.get('modifier')).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('Rrs_412');
        geona.map.removeLayer('line_black');
      });
    });

    describe('reordering - 1x borders, 1x data, 1x basemap, borders removed', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
        geona.map.addLayer(geona.map._availableLayers.Rrs_412);
        geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
        geona.map.removeLayer('line_black');
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') < lowestZIndex) {
            lowestZIndex = layer.get('zIndex');
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 0) {
            expect(layer.get('modifier')).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 1', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') > highestZIndex) {
            highestZIndex = layer.get('zIndex');
          }
        }
        expect(highestZIndex).to.equal(1);
      });
      it('should find a data layer at zIndex 1', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 1) {
            expect(layer.get('modifier')).to.be.undefined;
          }
        }
      });
      it('should find zIndex values of 0, 1, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('Rrs_412');
        geona.map.removeLayer('terrain-light');
      });
    });

    describe('reordering - 1x borders, 1x data, 1x basemap, 2x data', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(geona.map._availableLayers.line_black, 'borders');
        geona.map.addLayer(geona.map._availableLayers.Rrs_412);
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
        geona.map.addLayer(geona.map._availableLayers.Rrs_443);
        geona.map.addLayer(geona.map._availableLayers.Rrs_490);
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') < lowestZIndex) {
            lowestZIndex = layer.get('zIndex');
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 0) {
            expect(layer.get('modifier')).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 4', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') > highestZIndex) {
            highestZIndex = layer.get('zIndex');
          }
        }
        expect(highestZIndex).to.equal(4);
      });
      it('should find a data layer at zIndex 4', function() {
        for (let layer of geona.map._map.getLayers().getArray()) {
          if (layer.get('zIndex') === 1) {
            expect(layer.get('modifier')).to.be.undefined;
          }
        }
      });
      it('should find zIndex values of 0, 1, 2, 3, 4, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1, 2, 3, 4]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('line_black');
        geona.map.removeLayer('Rrs_443');
        geona.map.removeLayer('Rrs_490');
        geona.map.removeLayer('Rrs_412');
        geona.map.removeLayer('terrain-light');
      });
    });
  });

  // TODO map common tests for findNearestValidTime
  describe('loadNearestValidTime', function() {
    // These variables are used as shorthand for the layers in the tests.
    // They are redefined in each test to keep them up-to-date with any changes we make during the tests.
    let rrs412;
    let rrs490;

    before(function() {
      // Add a basemap, two data layers, and a borders layer.
      geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
      geona.map.addLayer(geona.map._availableLayers.Rrs_412, 'hasTime');
      geona.map.addLayer(geona.map._availableLayers.Rrs_490, 'hasTime');
      geona.map.addLayer(geona.map._availableLayers.line, 'borders');
    });

    it('should throw an error that the layer is undefined', function() {
      expect(function() {
        geona.map.loadNearestValidTime('', '2017-01-01T00:00:00.000Z');
      }).to.throw(Error);
    });
    it('should throw an error that the layer is not on the map', function() {
      expect(function() {
        geona.map.loadNearestValidTime('Rrs_443', '2017-01-01T00:00:00.000Z');
      }).to.throw(Error);
    });
    it('should throw an error that the layer is a basemap', function() {
      expect(function() {
        geona.map.loadNearestValidTime('terrain-light', '2017-01-01T00:00:00.000Z');
      }).to.throw(Error);
    });
    it('should throw an error that the layer is a borders layer', function() {
      expect(function() {
        geona.map.loadNearestValidTime('line', '2017-01-01T00:00:00.000Z');
      }).to.throw(Error);
    });
    it('should find that the layer time for the first layer added is set to the default', function() {
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.get('layerTime')).to.equal('2015-12-27T00:00:00.000Z');
    });
    it('should find that the layer time for the second layer added is set to the nearest valid time as the first layer', function() {
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.get('layerTime')).to.equal('2015-12-27T00:00:00.000Z');
    });
    it('should change the Rrs_412 layer time to 1998-01-01T00:00:00.000Z', function() {
      geona.map.loadNearestValidTime('Rrs_412', '1998-01-01T00:00:00.000Z');
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.get('layerTime')).to.equal('1998-01-01T00:00:00.000Z');
    });
    it('should change the Rrs_490 layer time to 2001-04-01T00:00:00.000Z', function() {
      geona.map.loadNearestValidTime('Rrs_490', '2001-04-01T00:00:00.000Z');
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.get('layerTime')).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should hide the layers because there is no valid time', function() {
      geona.map.loadNearestValidTime('Rrs_490', '1900-12-27T00:00:00.000Z');
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.getVisible()).to.equal(false);
      expect(rrs490.get('shown')).to.equal(true);

      // For the purposes of the next tests, we will hide this layer before moving it to the invalid time
      geona.map.hideLayer('Rrs_412');
      geona.map.loadNearestValidTime('Rrs_412', '1900-12-27T00:00:00.000Z');
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.getVisible()).to.equal(false);
      expect(rrs412.get('shown')).to.equal(false);
    });
    it('should keep the layer times the same as their previous time after being hidden', function() {
      rrs490 = geona.map._activeLayers.Rrs_490;
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs490.get('layerTime')).to.equal('2001-04-01T00:00:00.000Z');
      expect(rrs412.get('layerTime')).to.equal('1998-01-01T00:00:00.000Z');
    });
    it('should have set the map time to the requested time because there is no valid time', function() {
      expect(geona.map._mapTime).to.equal('1900-12-27T00:00:00.000Z');
    });
    it('should make the layer visible', function() {
      geona.map.loadNearestValidTime('Rrs_490', '2010-01-01T00:00:00.000Z');
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.getVisible()).to.equal(true);
      expect(rrs490.get('shown')).to.equal(true);
    });
    it('should have set the map time to the time of the only visible layer', function() {
      expect(geona.map._mapTime).to.equal('2008-08-08T00:00:00.000Z');
    });
    it('should keep the layer hidden if the layer had been hidden prior to moving out of valid time', function() {
      // This test relies on layer Rrs_412 being hidden prior to moving out of valid time
      geona.map.loadNearestValidTime('Rrs_412', '1998-01-01T00:00:00.000Z');
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.getVisible()).to.equal(false);
      expect(rrs412.get('shown')).to.equal(false);
    });

    after(function() {
      geona.map.removeLayer('terrain-light');
      geona.map.removeLayer('Rrs_412');
      geona.map.removeLayer('Rrs_490');
      geona.map.removeLayer('line');
    });
  });

  describe('loadLayersToNearestValidTime', function() {
    before(function() {
      // Add a basemap, two data layers, and a borders layer.
      geona.map.addLayer(geona.map._availableLayers['terrain-light'], 'basemap');
      geona.map.addLayer(geona.map._availableLayers.Rrs_412, 'hasTime');
      geona.map.addLayer(geona.map._availableLayers.Rrs_490, 'hasTime');
      geona.map.addLayer(geona.map._availableLayers.line, 'borders');
    });

    it('should set the layers to valid times', function() {
      geona.map.loadLayersToNearestValidTime('2001-04-01T00:00:00.000Z');
      let rrs412 = geona.map._activeLayers.Rrs_412;
      let rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs412.get('layerTime')).to.equal('1998-01-01T00:00:00.000Z');
      expect(rrs490.get('layerTime')).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should set the map time to 2001-04-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should hide both layers', function() {
      geona.map.loadLayersToNearestValidTime('1900-01-01T00:00:00.000Z');
      let rrs412 = geona.map._activeLayers.Rrs_412;
      let rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs412.getVisible()).to.equal(false);
      expect(rrs490.getVisible()).to.equal(false);
    });
    it('should set the map time to 1900-01-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('1900-01-01T00:00:00.000Z');
    });

    after(function() {
      geona.map.removeLayer('terrain-light');
      geona.map.removeLayer('Rrs_412');
      geona.map.removeLayer('Rrs_490');
      geona.map.removeLayer('line');
    });
  });

  describe('getLayersFromWms()', function() {
    let wmsLayers;
    before(function(done) {
      this.timeout(10000); // eslint-disable-line no-invalid-this
      getLayersFromWms('https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY')
        .then(function(layers) {
          wmsLayers = layers;
          done();
        })
        .catch(function(err) {
          console.error(err);
          done();
        });
    });

    it('should have found some layers', function() {
      expect(wmsLayers.layers.length).to.be.above(0);
    });
    it('should add one of the retrieved layers to the map', function() {
      geona.map.addLayer(wmsLayers.layers[0]);

      let firstMapLayer = geona.map._map.getLayers().getArray()[0];
      expect(firstMapLayer.get('identifier')).to.equal(wmsLayers.layers[0].identifier);
    });
    // TODO add test for saving layers once functionality implemented
    // it('should save the layers found', function() {});

    after(function() {
      // Clear all layers from the map
      let layer = geona.map._map.getLayers().getArray()[0];
      geona.map.removeLayer(layer.get('identifier'));
    });
  });

  describe('getLayersFromWmts()', function() {
    let wmtsLayers;
    before(function(done) {
      this.timeout(10000); // eslint-disable-line no-invalid-this
      getLayersFromWmts('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?VERSION=1.0.0&Request=GetCapabilities&Service=WMTS')
        .then(function(layers) {
          wmtsLayers = layers;
          done();
        })
        .catch(function(err) {
          console.error(err);
          done();
        });
    });

    it('should have found some layers', function() {
      expect(wmtsLayers.layers.length).to.be.above(0);
    });
    it('should add one of the retrieved layers to the map', function() {
      geona.map.addLayer(wmtsLayers.layers[0]);

      let firstMapLayer = geona.map._map.getLayers().getArray()[0];
      expect(firstMapLayer.get('identifier')).to.equal(wmtsLayers.layers[0].identifier);
    });
    // TODO add test for saving layers once functionality implemented
    // it('should save the layers found', function() {});

    after(function() {
      // Clear the layer we added from the map
      let layer = geona.map._map.getLayers().getArray()[0];
      geona.map.removeLayer(layer.get('identifier'));
    });
  });
});
