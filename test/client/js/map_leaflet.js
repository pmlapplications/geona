import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import 'jquery';

import {load} from '../../../src/client_loader/loader.js';

import {getLayersFromWms} from '../../../src/client/js/map_common.js';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_leaflet', function() {
  // Shorthand for window.geonaTest, used in the actual tests
  let geona;

  before(function(done) {
    this.timeout(5000); // eslint-disable-line no-invalid-this

    /**
     * Called when the map has finished creation and exists as an object.
     */
    function geonaOnReady() {
      console.log('Geona is ready.');
      geona = window.geonaLeafTest;
      done();
    }
    window.geonaOnReady = geonaOnReady;


    let config1 = {
      geonaVariable: 'geonaLeafTest',
      onReadyCallback: 'geonaOnReady',
      divId: 'leaftest',
      map: {
        library: 'leaflet',
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
                  '1997-09-04T00:00:00.000Z',
                  '1997-09-09T00:00:00.000Z',
                  '1997-09-15T00:00:00.000Z',
                  '1997-09-18T00:00:00.000Z',
                  '1997-09-23T00:00:00.000Z',
                  '1997-09-28T00:00:00.000Z',
                  '1997-10-03T00:00:00.000Z',
                  '1997-10-08T00:00:00.000Z',
                  '1997-10-19T00:00:00.000Z',
                  '1997-10-23T00:00:00.000Z',
                  '1997-10-28T00:00:00.000Z',
                  '1997-11-02T00:00:00.000Z',
                  '1997-11-07T00:00:00.000Z',
                  '1997-11-12T00:00:00.000Z',
                  '1997-11-17T00:00:00.000Z',
                  '1997-11-22T00:00:00.000Z',
                  '1997-11-27T00:00:00.000Z',
                  '1997-12-02T00:00:00.000Z',
                  '1997-12-07T00:00:00.000Z',
                  '1997-12-12T00:00:00.000Z',
                  '1997-12-17T00:00:00.000Z',
                  '1997-12-22T00:00:00.000Z',
                  '1997-12-27T00:00:00.000Z',
                  '1998-01-01T00:00:00.000Z',
                  '1998-01-06T00:00:00.000Z',
                  '1998-01-11T00:00:00.000Z',
                  '1998-01-16T00:00:00.000Z',
                  '1998-01-21T00:00:00.000Z',
                  '1998-01-26T00:00:00.000Z',
                  '1998-01-31T00:00:00.000Z',
                  '1998-02-05T00:00:00.000Z',
                  '1998-02-10T00:00:00.000Z',
                  '1998-02-15T00:00:00.000Z',
                  '1998-02-20T00:00:00.000Z',
                  '1998-02-25T00:00:00.000Z',
                  '1998-03-02T00:00:00.000Z',
                  '1998-03-07T00:00:00.000Z',
                  '1998-03-12T00:00:00.000Z',
                  '1998-03-17T00:00:00.000Z',
                  '1998-03-22T00:00:00.000Z',
                  '1998-03-27T00:00:00.000Z',
                  '1998-04-01T00:00:00.000Z',
                  '1998-04-06T00:00:00.000Z',
                  '1998-04-11T00:00:00.000Z',
                  '1998-04-16T00:00:00.000Z',
                  '1998-04-21T00:00:00.000Z',
                  '1998-04-26T00:00:00.000Z',
                  '1998-05-01T00:00:00.000Z',
                  '1998-05-06T00:00:00.000Z',
                  '1998-05-11T00:00:00.000Z',
                  '1998-05-16T00:00:00.000Z',
                  '1998-05-21T00:00:00.000Z',
                  '1998-05-26T00:00:00.000Z',
                  '1998-05-31T00:00:00.000Z',
                  '1998-06-05T00:00:00.000Z',
                  '1998-06-10T00:00:00.000Z',
                  '1998-06-15T00:00:00.000Z',
                  '1998-06-20T00:00:00.000Z',
                  '1998-06-25T00:00:00.000Z',
                  '1998-06-30T00:00:00.000Z',
                  '1998-07-05T00:00:00.000Z',
                  '1998-07-11T00:00:00.000Z',
                  '1998-07-15T00:00:00.000Z',
                  '1998-07-20T00:00:00.000Z',
                  '1998-07-25T00:00:00.000Z',
                  '1998-07-30T00:00:00.000Z',
                  '1998-08-04T00:00:00.000Z',
                  '1998-08-09T00:00:00.000Z',
                  '1998-08-14T00:00:00.000Z',
                  '1998-08-19T00:00:00.000Z',
                  '1998-08-24T00:00:00.000Z',
                  '1998-08-29T00:00:00.000Z',
                  '1998-09-03T00:00:00.000Z',
                  '1998-09-08T00:00:00.000Z',
                  '1998-09-13T00:00:00.000Z',
                  '1998-09-18T00:00:00.000Z',
                  '1998-09-23T00:00:00.000Z',
                  '1998-09-28T00:00:00.000Z',
                  '1998-10-03T00:00:00.000Z',
                  '1998-10-08T00:00:00.000Z',
                  '1998-10-13T00:00:00.000Z',
                  '1998-10-18T00:00:00.000Z',
                  '1998-10-23T00:00:00.000Z',
                  '1998-10-28T00:00:00.000Z',
                  '1998-11-02T00:00:00.000Z',
                  '1998-11-07T00:00:00.000Z',
                  '1998-11-12T00:00:00.000Z',
                  '1998-11-21T00:00:00.000Z',
                  '1998-11-22T00:00:00.000Z',
                  '1998-11-27T00:00:00.000Z',
                  '1998-12-02T00:00:00.000Z',
                  '1998-12-07T00:00:00.000Z',
                  '1998-12-12T00:00:00.000Z',
                  '1998-12-18T00:00:00.000Z',
                  '1998-12-22T00:00:00.000Z',
                  '1998-12-27T00:00:00.000Z',
                  '1999-01-01T00:00:00.000Z',
                  '1999-01-06T00:00:00.000Z',
                  '1999-01-11T00:00:00.000Z',
                  '1999-01-16T00:00:00.000Z',
                  '1999-01-21T00:00:00.000Z',
                  '1999-01-26T00:00:00.000Z',
                  '1999-01-31T00:00:00.000Z',
                  '1999-02-05T00:00:00.000Z',
                  '1999-02-10T00:00:00.000Z',
                  '1999-02-15T00:00:00.000Z',
                  '1999-02-20T00:00:00.000Z',
                  '1999-02-25T00:00:00.000Z',
                  '1999-03-02T00:00:00.000Z',
                  '1999-03-07T00:00:00.000Z',
                  '1999-03-12T00:00:00.000Z',
                  '1999-03-17T00:00:00.000Z',
                  '1999-03-22T00:00:00.000Z',
                  '1999-03-27T00:00:00.000Z',
                  '1999-04-01T00:00:00.000Z',
                  '1999-04-06T00:00:00.000Z',
                  '1999-04-11T00:00:00.000Z',
                  '1999-04-16T00:00:00.000Z',
                  '1999-04-21T00:00:00.000Z',
                  '1999-04-26T00:00:00.000Z',
                  '1999-05-01T00:00:00.000Z',
                  '1999-05-06T00:00:00.000Z',
                  '1999-05-11T00:00:00.000Z',
                  '1999-05-16T00:00:00.000Z',
                  '1999-05-21T00:00:00.000Z',
                  '1999-05-26T00:00:00.000Z',
                  '1999-05-31T00:00:00.000Z',
                  '1999-06-05T00:00:00.000Z',
                  '1999-06-10T00:00:00.000Z',
                  '1999-06-15T00:00:00.000Z',
                  '1999-06-20T00:00:00.000Z',
                  '1999-06-25T00:00:00.000Z',
                  '1999-06-30T00:00:00.000Z',
                  '1999-07-05T00:00:00.000Z',
                  '1999-07-10T00:00:00.000Z',
                  '1999-07-15T00:00:00.000Z',
                  '1999-07-20T00:00:00.000Z',
                  '1999-07-25T00:00:00.000Z',
                  '1999-07-30T00:00:00.000Z',
                  '1999-08-04T00:00:00.000Z',
                  '1999-08-09T00:00:00.000Z',
                  '1999-08-14T00:00:00.000Z',
                  '1999-08-19T00:00:00.000Z',
                  '1999-08-24T00:00:00.000Z',
                  '1999-08-29T00:00:00.000Z',
                  '1999-09-03T00:00:00.000Z',
                  '1999-09-08T00:00:00.000Z',
                  '1999-09-13T00:00:00.000Z',
                  '1999-09-18T00:00:00.000Z',
                  '1999-09-23T00:00:00.000Z',
                  '1999-09-28T00:00:00.000Z',
                  '1999-10-03T00:00:00.000Z',
                  '1999-10-08T00:00:00.000Z',
                  '1999-10-13T00:00:00.000Z',
                  '1999-10-18T00:00:00.000Z',
                  '1999-10-23T00:00:00.000Z',
                  '1999-10-28T00:00:00.000Z',
                  '1999-11-02T00:00:00.000Z',
                  '1999-11-07T00:00:00.000Z',
                  '1999-11-12T00:00:00.000Z',
                  '1999-11-19T00:00:00.000Z',
                  '1999-11-22T00:00:00.000Z',
                  '1999-11-27T00:00:00.000Z',
                  '1999-12-02T00:00:00.000Z',
                  '1999-12-07T00:00:00.000Z',
                  '1999-12-12T00:00:00.000Z',
                  '1999-12-17T00:00:00.000Z',
                  '1999-12-22T00:00:00.000Z',
                  '1999-12-27T00:00:00.000Z',
                  '2000-01-01T00:00:00.000Z',
                  '2000-01-06T00:00:00.000Z',
                  '2000-01-11T00:00:00.000Z',
                  '2000-01-16T00:00:00.000Z',
                  '2000-01-21T00:00:00.000Z',
                  '2000-01-26T00:00:00.000Z',
                  '2000-01-31T00:00:00.000Z',
                  '2000-02-05T00:00:00.000Z',
                  '2000-02-10T00:00:00.000Z',
                  '2000-02-15T00:00:00.000Z',
                  '2000-02-20T00:00:00.000Z',
                  '2000-02-25T00:00:00.000Z',
                  '2000-03-01T00:00:00.000Z',
                  '2000-03-06T00:00:00.000Z',
                  '2000-03-11T00:00:00.000Z',
                  '2000-03-16T00:00:00.000Z',
                  '2000-03-21T00:00:00.000Z',
                  '2000-03-26T00:00:00.000Z',
                  '2000-03-31T00:00:00.000Z',
                  '2000-04-05T00:00:00.000Z',
                  '2000-04-10T00:00:00.000Z',
                  '2000-04-15T00:00:00.000Z',
                  '2000-04-20T00:00:00.000Z',
                  '2000-04-25T00:00:00.000Z',
                  '2000-04-30T00:00:00.000Z',
                  '2000-05-05T00:00:00.000Z',
                  '2000-05-10T00:00:00.000Z',
                  '2000-05-15T00:00:00.000Z',
                  '2000-05-20T00:00:00.000Z',
                  '2000-05-25T00:00:00.000Z',
                  '2000-05-30T00:00:00.000Z',
                  '2000-06-04T00:00:00.000Z',
                  '2000-06-09T00:00:00.000Z',
                  '2000-06-14T00:00:00.000Z',
                  '2000-06-19T00:00:00.000Z',
                  '2000-06-24T00:00:00.000Z',
                  '2000-06-29T00:00:00.000Z',
                  '2000-07-04T00:00:00.000Z',
                  '2000-07-09T00:00:00.000Z',
                  '2000-07-14T00:00:00.000Z',
                  '2000-07-19T00:00:00.000Z',
                  '2000-07-24T00:00:00.000Z',
                  '2000-07-29T00:00:00.000Z',
                  '2000-08-03T00:00:00.000Z',
                  '2000-08-08T00:00:00.000Z',
                  '2000-08-13T00:00:00.000Z',
                  '2000-08-18T00:00:00.000Z',
                  '2000-08-23T00:00:00.000Z',
                  '2000-08-28T00:00:00.000Z',
                  '2000-09-02T00:00:00.000Z',
                  '2000-09-07T00:00:00.000Z',
                  '2000-09-12T00:00:00.000Z',
                  '2000-09-17T00:00:00.000Z',
                  '2000-09-22T00:00:00.000Z',
                  '2000-09-27T00:00:00.000Z',
                  '2000-10-02T00:00:00.000Z',
                  '2000-10-07T00:00:00.000Z',
                  '2000-10-12T00:00:00.000Z',
                  '2000-10-17T00:00:00.000Z',
                  '2000-10-22T00:00:00.000Z',
                  '2000-10-27T00:00:00.000Z',
                  '2000-11-01T00:00:00.000Z',
                  '2000-11-06T00:00:00.000Z',
                  '2000-11-11T00:00:00.000Z',
                  '2000-11-16T00:00:00.000Z',
                  '2000-11-21T00:00:00.000Z',
                  '2000-11-26T00:00:00.000Z',
                  '2000-12-01T00:00:00.000Z',
                  '2000-12-06T00:00:00.000Z',
                  '2000-12-11T00:00:00.000Z',
                  '2000-12-16T00:00:00.000Z',
                  '2000-12-21T00:00:00.000Z',
                  '2000-12-26T00:00:00.000Z',
                  '2000-12-31T00:00:00.000Z',
                  '2001-01-01T00:00:00.000Z',
                  '2001-01-06T00:00:00.000Z',
                  '2001-01-11T00:00:00.000Z',
                  '2001-01-16T00:00:00.000Z',
                  '2001-01-21T00:00:00.000Z',
                  '2001-01-26T00:00:00.000Z',
                  '2001-01-31T00:00:00.000Z',
                  '2001-02-05T00:00:00.000Z',
                  '2001-02-10T00:00:00.000Z',
                  '2001-02-15T00:00:00.000Z',
                  '2001-02-20T00:00:00.000Z',
                  '2001-02-25T00:00:00.000Z',
                  '2001-03-02T00:00:00.000Z',
                  '2001-03-07T00:00:00.000Z',
                  '2001-03-12T00:00:00.000Z',
                  '2001-03-17T00:00:00.000Z',
                  '2001-03-22T00:00:00.000Z',
                  '2001-03-27T00:00:00.000Z',
                  '2001-04-01T00:00:00.000Z',
                  '2001-04-06T00:00:00.000Z',
                  '2001-04-11T00:00:00.000Z',
                  '2001-04-16T00:00:00.000Z',
                  '2001-04-21T00:00:00.000Z',
                  '2001-04-26T00:00:00.000Z',
                  '2001-05-01T00:00:00.000Z',
                  '2001-05-06T00:00:00.000Z',
                  '2001-05-11T00:00:00.000Z',
                  '2001-05-16T00:00:00.000Z',
                  '2001-05-21T00:00:00.000Z',
                  '2001-05-26T00:00:00.000Z',
                  '2001-05-31T00:00:00.000Z',
                  '2001-06-05T00:00:00.000Z',
                  '2001-06-10T00:00:00.000Z',
                  '2001-06-15T00:00:00.000Z',
                  '2001-06-20T00:00:00.000Z',
                  '2001-06-25T00:00:00.000Z',
                  '2001-06-30T00:00:00.000Z',
                  '2001-07-05T00:00:00.000Z',
                  '2001-07-10T00:00:00.000Z',
                  '2001-07-15T00:00:00.000Z',
                  '2001-07-20T00:00:00.000Z',
                  '2001-07-25T00:00:00.000Z',
                  '2001-07-30T00:00:00.000Z',
                  '2001-08-04T00:00:00.000Z',
                  '2001-08-09T00:00:00.000Z',
                  '2001-08-14T00:00:00.000Z',
                  '2001-08-19T00:00:00.000Z',
                  '2001-08-24T00:00:00.000Z',
                  '2001-08-29T00:00:00.000Z',
                  '2001-09-03T00:00:00.000Z',
                  '2001-09-08T00:00:00.000Z',
                  '2001-09-13T00:00:00.000Z',
                  '2001-09-18T00:00:00.000Z',
                  '2001-09-23T00:00:00.000Z',
                  '2001-09-28T00:00:00.000Z',
                  '2001-10-03T00:00:00.000Z',
                  '2001-10-08T00:00:00.000Z',
                  '2001-10-13T00:00:00.000Z',
                  '2001-10-18T00:00:00.000Z',
                  '2001-10-23T00:00:00.000Z',
                  '2001-10-28T00:00:00.000Z',
                  '2001-11-02T00:00:00.000Z',
                  '2001-11-07T00:00:00.000Z',
                  '2001-11-12T00:00:00.000Z',
                  '2001-11-17T00:00:00.000Z',
                  '2001-11-22T00:00:00.000Z',
                  '2001-11-27T00:00:00.000Z',
                  '2001-12-02T00:00:00.000Z',
                  '2001-12-07T00:00:00.000Z',
                  '2001-12-12T00:00:00.000Z',
                  '2001-12-17T00:00:00.000Z',
                  '2001-12-22T00:00:00.000Z',
                  '2001-12-27T00:00:00.000Z',
                  '2002-01-01T00:00:00.000Z',
                  '2002-01-06T00:00:00.000Z',
                  '2002-01-11T00:00:00.000Z',
                  '2002-01-16T00:00:00.000Z',
                  '2002-01-21T00:00:00.000Z',
                  '2002-01-26T00:00:00.000Z',
                  '2002-01-31T00:00:00.000Z',
                  '2002-02-05T00:00:00.000Z',
                  '2002-02-10T00:00:00.000Z',
                  '2002-02-15T00:00:00.000Z',
                  '2002-02-20T00:00:00.000Z',
                  '2002-02-25T00:00:00.000Z',
                  '2002-03-02T00:00:00.000Z',
                  '2002-03-07T00:00:00.000Z',
                  '2002-03-12T00:00:00.000Z',
                  '2002-03-17T00:00:00.000Z',
                  '2002-03-22T00:00:00.000Z',
                  '2002-03-27T00:00:00.000Z',
                  '2002-04-01T00:00:00.000Z',
                  '2002-04-06T00:00:00.000Z',
                  '2002-04-11T00:00:00.000Z',
                  '2002-04-16T00:00:00.000Z',
                  '2002-04-21T00:00:00.000Z',
                  '2002-04-26T00:00:00.000Z',
                  '2002-05-01T00:00:00.000Z',
                  '2002-05-06T00:00:00.000Z',
                  '2002-05-11T00:00:00.000Z',
                  '2002-05-16T00:00:00.000Z',
                  '2002-05-21T00:00:00.000Z',
                  '2002-05-26T00:00:00.000Z',
                  '2002-05-31T00:00:00.000Z',
                  '2002-06-05T00:00:00.000Z',
                  '2002-06-10T00:00:00.000Z',
                  '2002-06-15T00:00:00.000Z',
                  '2002-06-20T00:00:00.000Z',
                  '2002-06-25T00:00:00.000Z',
                  '2002-06-30T00:00:00.000Z',
                  '2002-07-05T00:00:00.000Z',
                  '2002-07-10T00:00:00.000Z',
                  '2002-07-15T00:00:00.000Z',
                  '2002-07-20T00:00:00.000Z',
                  '2002-07-25T00:00:00.000Z',
                  '2002-07-30T00:00:00.000Z',
                  '2002-08-04T00:00:00.000Z',
                  '2002-08-09T00:00:00.000Z',
                  '2002-08-14T00:00:00.000Z',
                  '2002-08-19T00:00:00.000Z',
                  '2002-08-24T00:00:00.000Z',
                  '2002-08-29T00:00:00.000Z',
                  '2002-09-03T00:00:00.000Z',
                  '2002-09-08T00:00:00.000Z',
                  '2002-09-13T00:00:00.000Z',
                  '2002-09-18T00:00:00.000Z',
                  '2002-09-23T00:00:00.000Z',
                  '2002-09-28T00:00:00.000Z',
                  '2002-10-03T00:00:00.000Z',
                  '2002-10-08T00:00:00.000Z',
                  '2002-10-13T00:00:00.000Z',
                  '2002-10-18T00:00:00.000Z',
                  '2002-10-23T00:00:00.000Z',
                  '2002-10-28T00:00:00.000Z',
                  '2002-11-02T00:00:00.000Z',
                  '2002-11-07T00:00:00.000Z',
                  '2002-11-12T00:00:00.000Z',
                  '2002-11-17T00:00:00.000Z',
                  '2002-11-22T00:00:00.000Z',
                  '2002-11-27T00:00:00.000Z',
                  '2002-12-02T00:00:00.000Z',
                  '2002-12-07T00:00:00.000Z',
                  '2002-12-12T00:00:00.000Z',
                  '2002-12-17T00:00:00.000Z',
                  '2002-12-22T00:00:00.000Z',
                  '2002-12-27T00:00:00.000Z',
                  '2003-01-01T00:00:00.000Z',
                  '2003-01-06T00:00:00.000Z',
                  '2003-01-11T00:00:00.000Z',
                  '2003-01-16T00:00:00.000Z',
                  '2003-01-21T00:00:00.000Z',
                  '2003-01-26T00:00:00.000Z',
                  '2003-01-31T00:00:00.000Z',
                  '2003-02-05T00:00:00.000Z',
                  '2003-02-10T00:00:00.000Z',
                  '2003-02-15T00:00:00.000Z',
                  '2003-02-20T00:00:00.000Z',
                  '2003-02-25T00:00:00.000Z',
                  '2003-03-02T00:00:00.000Z',
                  '2003-03-07T00:00:00.000Z',
                  '2003-03-12T00:00:00.000Z',
                  '2003-03-17T00:00:00.000Z',
                  '2003-03-22T00:00:00.000Z',
                  '2003-03-27T00:00:00.000Z',
                  '2003-04-01T00:00:00.000Z',
                  '2003-04-06T00:00:00.000Z',
                  '2003-04-11T00:00:00.000Z',
                  '2003-04-16T00:00:00.000Z',
                  '2003-04-21T00:00:00.000Z',
                  '2003-04-26T00:00:00.000Z',
                  '2003-05-01T00:00:00.000Z',
                  '2003-05-06T00:00:00.000Z',
                  '2003-05-11T00:00:00.000Z',
                  '2003-05-16T00:00:00.000Z',
                  '2003-05-21T00:00:00.000Z',
                  '2003-05-26T00:00:00.000Z',
                  '2003-05-31T00:00:00.000Z',
                  '2003-06-05T00:00:00.000Z',
                  '2003-06-10T00:00:00.000Z',
                  '2003-06-15T00:00:00.000Z',
                  '2003-06-20T00:00:00.000Z',
                  '2003-06-25T00:00:00.000Z',
                  '2003-06-30T00:00:00.000Z',
                  '2003-07-05T00:00:00.000Z',
                  '2003-07-10T00:00:00.000Z',
                  '2003-07-15T00:00:00.000Z',
                  '2003-07-20T00:00:00.000Z',
                  '2003-07-25T00:00:00.000Z',
                  '2003-07-30T00:00:00.000Z',
                  '2003-08-04T00:00:00.000Z',
                  '2003-08-09T00:00:00.000Z',
                  '2003-08-14T00:00:00.000Z',
                  '2003-08-19T00:00:00.000Z',
                  '2003-08-24T00:00:00.000Z',
                  '2003-08-29T00:00:00.000Z',
                  '2003-09-03T00:00:00.000Z',
                  '2003-09-08T00:00:00.000Z',
                  '2003-09-13T00:00:00.000Z',
                  '2003-09-18T00:00:00.000Z',
                  '2003-09-23T00:00:00.000Z',
                  '2003-09-28T00:00:00.000Z',
                  '2003-10-03T00:00:00.000Z',
                  '2003-10-08T00:00:00.000Z',
                  '2003-10-13T00:00:00.000Z',
                  '2003-10-18T00:00:00.000Z',
                  '2003-10-23T00:00:00.000Z',
                  '2003-10-28T00:00:00.000Z',
                  '2003-11-02T00:00:00.000Z',
                  '2003-11-07T00:00:00.000Z',
                  '2003-11-12T00:00:00.000Z',
                  '2003-11-17T00:00:00.000Z',
                  '2003-11-22T00:00:00.000Z',
                  '2003-11-27T00:00:00.000Z',
                  '2003-12-02T00:00:00.000Z',
                  '2003-12-07T00:00:00.000Z',
                  '2003-12-12T00:00:00.000Z',
                  '2003-12-17T00:00:00.000Z',
                  '2003-12-22T00:00:00.000Z',
                  '2003-12-27T00:00:00.000Z',
                  '2004-01-01T00:00:00.000Z',
                  '2004-01-06T00:00:00.000Z',
                  '2004-01-11T00:00:00.000Z',
                  '2004-01-16T00:00:00.000Z',
                  '2004-01-21T00:00:00.000Z',
                  '2004-01-26T00:00:00.000Z',
                  '2004-01-31T00:00:00.000Z',
                  '2004-02-05T00:00:00.000Z',
                  '2004-02-10T00:00:00.000Z',
                  '2004-02-15T00:00:00.000Z',
                  '2004-02-20T00:00:00.000Z',
                  '2004-02-25T00:00:00.000Z',
                  '2004-03-01T00:00:00.000Z',
                  '2004-03-06T00:00:00.000Z',
                  '2004-03-11T00:00:00.000Z',
                  '2004-03-16T00:00:00.000Z',
                  '2004-03-21T00:00:00.000Z',
                  '2004-03-26T00:00:00.000Z',
                  '2004-03-31T00:00:00.000Z',
                  '2004-04-05T00:00:00.000Z',
                  '2004-04-10T00:00:00.000Z',
                  '2004-04-15T00:00:00.000Z',
                  '2004-04-20T00:00:00.000Z',
                  '2004-04-25T00:00:00.000Z',
                  '2004-04-30T00:00:00.000Z',
                  '2004-05-05T00:00:00.000Z',
                  '2004-05-10T00:00:00.000Z',
                  '2004-05-15T00:00:00.000Z',
                  '2004-05-20T00:00:00.000Z',
                  '2004-05-25T00:00:00.000Z',
                  '2004-05-30T00:00:00.000Z',
                  '2004-06-04T00:00:00.000Z',
                  '2004-06-09T00:00:00.000Z',
                  '2004-06-14T00:00:00.000Z',
                  '2004-06-19T00:00:00.000Z',
                  '2004-06-24T00:00:00.000Z',
                  '2004-06-29T00:00:00.000Z',
                  '2004-07-04T00:00:00.000Z',
                  '2004-07-09T00:00:00.000Z',
                  '2004-07-14T00:00:00.000Z',
                  '2004-07-19T00:00:00.000Z',
                  '2004-07-24T00:00:00.000Z',
                  '2004-07-29T00:00:00.000Z',
                  '2004-08-03T00:00:00.000Z',
                  '2004-08-08T00:00:00.000Z',
                  '2004-08-13T00:00:00.000Z',
                  '2004-08-18T00:00:00.000Z',
                  '2004-08-23T00:00:00.000Z',
                  '2004-08-28T00:00:00.000Z',
                  '2004-09-02T00:00:00.000Z',
                  '2004-09-07T00:00:00.000Z',
                  '2004-09-12T00:00:00.000Z',
                  '2004-09-17T00:00:00.000Z',
                  '2004-09-22T00:00:00.000Z',
                  '2004-09-27T00:00:00.000Z',
                  '2004-10-02T00:00:00.000Z',
                  '2004-10-07T00:00:00.000Z',
                  '2004-10-12T00:00:00.000Z',
                  '2004-10-17T00:00:00.000Z',
                  '2004-10-22T00:00:00.000Z',
                  '2004-10-27T00:00:00.000Z',
                  '2004-11-01T00:00:00.000Z',
                  '2004-11-06T00:00:00.000Z',
                  '2004-11-11T00:00:00.000Z',
                  '2004-11-16T00:00:00.000Z',
                  '2004-11-21T00:00:00.000Z',
                  '2004-11-26T00:00:00.000Z',
                  '2004-12-01T00:00:00.000Z',
                  '2004-12-06T00:00:00.000Z',
                  '2004-12-11T00:00:00.000Z',
                  '2004-12-16T00:00:00.000Z',
                  '2004-12-21T00:00:00.000Z',
                  '2004-12-26T00:00:00.000Z',
                  '2004-12-31T00:00:00.000Z',
                  '2005-01-01T00:00:00.000Z',
                  '2005-01-06T00:00:00.000Z',
                  '2005-01-11T00:00:00.000Z',
                  '2005-01-16T00:00:00.000Z',
                  '2005-01-21T00:00:00.000Z',
                  '2005-01-26T00:00:00.000Z',
                  '2005-01-31T00:00:00.000Z',
                  '2005-02-05T00:00:00.000Z',
                  '2005-02-10T00:00:00.000Z',
                  '2005-02-15T00:00:00.000Z',
                  '2005-02-20T00:00:00.000Z',
                  '2005-02-25T00:00:00.000Z',
                  '2005-03-02T00:00:00.000Z',
                  '2005-03-07T00:00:00.000Z',
                  '2005-03-12T00:00:00.000Z',
                  '2005-03-17T00:00:00.000Z',
                  '2005-03-22T00:00:00.000Z',
                  '2005-03-27T00:00:00.000Z',
                  '2005-04-01T00:00:00.000Z',
                  '2005-04-06T00:00:00.000Z',
                  '2005-04-11T00:00:00.000Z',
                  '2005-04-16T00:00:00.000Z',
                  '2005-04-21T00:00:00.000Z',
                  '2005-04-26T00:00:00.000Z',
                  '2005-05-01T00:00:00.000Z',
                  '2005-05-06T00:00:00.000Z',
                  '2005-05-11T00:00:00.000Z',
                  '2005-05-16T00:00:00.000Z',
                  '2005-05-21T00:00:00.000Z',
                  '2005-05-26T00:00:00.000Z',
                  '2005-05-31T00:00:00.000Z',
                  '2005-06-05T00:00:00.000Z',
                  '2005-06-10T00:00:00.000Z',
                  '2005-06-15T00:00:00.000Z',
                  '2005-06-20T00:00:00.000Z',
                  '2005-06-25T00:00:00.000Z',
                  '2005-06-30T00:00:00.000Z',
                  '2005-07-05T00:00:00.000Z',
                  '2005-07-10T00:00:00.000Z',
                  '2005-07-15T00:00:00.000Z',
                  '2005-07-20T00:00:00.000Z',
                  '2005-07-25T00:00:00.000Z',
                  '2005-07-30T00:00:00.000Z',
                  '2005-08-04T00:00:00.000Z',
                  '2005-08-09T00:00:00.000Z',
                  '2005-08-14T00:00:00.000Z',
                  '2005-08-19T00:00:00.000Z',
                  '2005-08-24T00:00:00.000Z',
                  '2005-08-29T00:00:00.000Z',
                  '2005-09-03T00:00:00.000Z',
                  '2005-09-08T00:00:00.000Z',
                  '2005-09-13T00:00:00.000Z',
                  '2005-09-18T00:00:00.000Z',
                  '2005-09-23T00:00:00.000Z',
                  '2005-09-28T00:00:00.000Z',
                  '2005-10-03T00:00:00.000Z',
                  '2005-10-08T00:00:00.000Z',
                  '2005-10-13T00:00:00.000Z',
                  '2005-10-18T00:00:00.000Z',
                  '2005-10-23T00:00:00.000Z',
                  '2005-10-28T00:00:00.000Z',
                  '2005-11-02T00:00:00.000Z',
                  '2005-11-07T00:00:00.000Z',
                  '2005-11-12T00:00:00.000Z',
                  '2005-11-17T00:00:00.000Z',
                  '2005-11-22T00:00:00.000Z',
                  '2005-11-27T00:00:00.000Z',
                  '2005-12-02T00:00:00.000Z',
                  '2005-12-07T00:00:00.000Z',
                  '2005-12-12T00:00:00.000Z',
                  '2005-12-17T00:00:00.000Z',
                  '2005-12-22T00:00:00.000Z',
                  '2005-12-27T00:00:00.000Z',
                  '2006-01-01T00:00:00.000Z',
                  '2006-01-06T00:00:00.000Z',
                  '2006-01-11T00:00:00.000Z',
                  '2006-01-16T00:00:00.000Z',
                  '2006-01-21T00:00:00.000Z',
                  '2006-01-26T00:00:00.000Z',
                  '2006-01-31T00:00:00.000Z',
                  '2006-02-05T00:00:00.000Z',
                  '2006-02-10T00:00:00.000Z',
                  '2006-02-15T00:00:00.000Z',
                  '2006-02-20T00:00:00.000Z',
                  '2006-02-25T00:00:00.000Z',
                  '2006-03-02T00:00:00.000Z',
                  '2006-03-07T00:00:00.000Z',
                  '2006-03-12T00:00:00.000Z',
                  '2006-03-17T00:00:00.000Z',
                  '2006-03-22T00:00:00.000Z',
                  '2006-03-27T00:00:00.000Z',
                  '2006-04-01T00:00:00.000Z',
                  '2006-04-06T00:00:00.000Z',
                  '2006-04-11T00:00:00.000Z',
                  '2006-04-16T00:00:00.000Z',
                  '2006-04-21T00:00:00.000Z',
                  '2006-04-26T00:00:00.000Z',
                  '2006-05-01T00:00:00.000Z',
                  '2006-05-06T00:00:00.000Z',
                  '2006-05-11T00:00:00.000Z',
                  '2006-05-16T00:00:00.000Z',
                  '2006-05-21T00:00:00.000Z',
                  '2006-05-26T00:00:00.000Z',
                  '2006-05-31T00:00:00.000Z',
                  '2006-06-05T00:00:00.000Z',
                  '2006-06-10T00:00:00.000Z',
                  '2006-06-15T00:00:00.000Z',
                  '2006-06-20T00:00:00.000Z',
                  '2006-06-25T00:00:00.000Z',
                  '2006-06-30T00:00:00.000Z',
                  '2006-07-05T00:00:00.000Z',
                  '2006-07-10T00:00:00.000Z',
                  '2006-07-15T00:00:00.000Z',
                  '2006-07-20T00:00:00.000Z',
                  '2006-07-25T00:00:00.000Z',
                  '2006-07-30T00:00:00.000Z',
                  '2006-08-04T00:00:00.000Z',
                  '2006-08-09T00:00:00.000Z',
                  '2006-08-14T00:00:00.000Z',
                  '2006-08-19T00:00:00.000Z',
                  '2006-08-24T00:00:00.000Z',
                  '2006-08-29T00:00:00.000Z',
                  '2006-09-03T00:00:00.000Z',
                  '2006-09-08T00:00:00.000Z',
                  '2006-09-13T00:00:00.000Z',
                  '2006-09-18T00:00:00.000Z',
                  '2006-09-23T00:00:00.000Z',
                  '2006-09-28T00:00:00.000Z',
                  '2006-10-03T00:00:00.000Z',
                  '2006-10-08T00:00:00.000Z',
                  '2006-10-13T00:00:00.000Z',
                  '2006-10-18T00:00:00.000Z',
                  '2006-10-23T00:00:00.000Z',
                  '2006-10-28T00:00:00.000Z',
                  '2006-11-02T00:00:00.000Z',
                  '2006-11-07T00:00:00.000Z',
                  '2006-11-12T00:00:00.000Z',
                  '2006-11-17T00:00:00.000Z',
                  '2006-11-22T00:00:00.000Z',
                  '2006-11-27T00:00:00.000Z',
                  '2006-12-02T00:00:00.000Z',
                  '2006-12-07T00:00:00.000Z',
                  '2006-12-12T00:00:00.000Z',
                  '2006-12-17T00:00:00.000Z',
                  '2006-12-22T00:00:00.000Z',
                  '2006-12-27T00:00:00.000Z',
                  '2007-01-01T00:00:00.000Z',
                  '2007-01-06T00:00:00.000Z',
                  '2007-01-11T00:00:00.000Z',
                  '2007-01-16T00:00:00.000Z',
                  '2007-01-21T00:00:00.000Z',
                  '2007-01-26T00:00:00.000Z',
                  '2007-01-31T00:00:00.000Z',
                  '2007-02-05T00:00:00.000Z',
                  '2007-02-10T00:00:00.000Z',
                  '2007-02-15T00:00:00.000Z',
                  '2007-02-20T00:00:00.000Z',
                  '2007-02-25T00:00:00.000Z',
                  '2007-03-02T00:00:00.000Z',
                  '2007-03-07T00:00:00.000Z',
                  '2007-03-12T00:00:00.000Z',
                  '2007-03-17T00:00:00.000Z',
                  '2007-03-22T00:00:00.000Z',
                  '2007-03-27T00:00:00.000Z',
                  '2007-04-01T00:00:00.000Z',
                  '2007-04-06T00:00:00.000Z',
                  '2007-04-11T00:00:00.000Z',
                  '2007-04-16T00:00:00.000Z',
                  '2007-04-21T00:00:00.000Z',
                  '2007-04-26T00:00:00.000Z',
                  '2007-05-01T00:00:00.000Z',
                  '2007-05-06T00:00:00.000Z',
                  '2007-05-11T00:00:00.000Z',
                  '2007-05-16T00:00:00.000Z',
                  '2007-05-21T00:00:00.000Z',
                  '2007-05-26T00:00:00.000Z',
                  '2007-05-31T00:00:00.000Z',
                  '2007-06-05T00:00:00.000Z',
                  '2007-06-10T00:00:00.000Z',
                  '2007-06-15T00:00:00.000Z',
                  '2007-06-20T00:00:00.000Z',
                  '2007-06-25T00:00:00.000Z',
                  '2007-06-30T00:00:00.000Z',
                  '2007-07-05T00:00:00.000Z',
                  '2007-07-10T00:00:00.000Z',
                  '2007-07-15T00:00:00.000Z',
                  '2007-07-20T00:00:00.000Z',
                  '2007-07-25T00:00:00.000Z',
                  '2007-07-30T00:00:00.000Z',
                  '2007-08-04T00:00:00.000Z',
                  '2007-08-09T00:00:00.000Z',
                  '2007-08-14T00:00:00.000Z',
                  '2007-08-19T00:00:00.000Z',
                  '2007-08-24T00:00:00.000Z',
                  '2007-08-29T00:00:00.000Z',
                  '2007-09-03T00:00:00.000Z',
                  '2007-09-08T00:00:00.000Z',
                  '2007-09-13T00:00:00.000Z',
                  '2007-09-18T00:00:00.000Z',
                  '2007-09-23T00:00:00.000Z',
                  '2007-09-28T00:00:00.000Z',
                  '2007-10-03T00:00:00.000Z',
                  '2007-10-08T00:00:00.000Z',
                  '2007-10-13T00:00:00.000Z',
                  '2007-10-18T00:00:00.000Z',
                  '2007-10-23T00:00:00.000Z',
                  '2007-10-28T00:00:00.000Z',
                  '2007-11-02T00:00:00.000Z',
                  '2007-11-07T00:00:00.000Z',
                  '2007-11-12T00:00:00.000Z',
                  '2007-11-17T00:00:00.000Z',
                  '2007-11-22T00:00:00.000Z',
                  '2007-11-27T00:00:00.000Z',
                  '2007-12-02T00:00:00.000Z',
                  '2007-12-07T00:00:00.000Z',
                  '2007-12-12T00:00:00.000Z',
                  '2007-12-17T00:00:00.000Z',
                  '2007-12-22T00:00:00.000Z',
                  '2007-12-27T00:00:00.000Z',
                  '2008-01-01T00:00:00.000Z',
                  '2008-01-06T00:00:00.000Z',
                  '2008-01-11T00:00:00.000Z',
                  '2008-01-16T00:00:00.000Z',
                  '2008-01-21T00:00:00.000Z',
                  '2008-01-26T00:00:00.000Z',
                  '2008-01-31T00:00:00.000Z',
                  '2008-02-05T00:00:00.000Z',
                  '2008-02-10T00:00:00.000Z',
                  '2008-02-15T00:00:00.000Z',
                  '2008-02-20T00:00:00.000Z',
                  '2008-02-25T00:00:00.000Z',
                  '2008-03-01T00:00:00.000Z',
                  '2008-03-06T00:00:00.000Z',
                  '2008-03-11T00:00:00.000Z',
                  '2008-03-16T00:00:00.000Z',
                  '2008-03-21T00:00:00.000Z',
                  '2008-03-26T00:00:00.000Z',
                  '2008-03-31T00:00:00.000Z',
                  '2008-04-05T00:00:00.000Z',
                  '2008-04-10T00:00:00.000Z',
                  '2008-04-15T00:00:00.000Z',
                  '2008-04-20T00:00:00.000Z',
                  '2008-04-25T00:00:00.000Z',
                  '2008-04-30T00:00:00.000Z',
                  '2008-05-05T00:00:00.000Z',
                  '2008-05-10T00:00:00.000Z',
                  '2008-05-15T00:00:00.000Z',
                  '2008-05-20T00:00:00.000Z',
                  '2008-05-25T00:00:00.000Z',
                  '2008-05-30T00:00:00.000Z',
                  '2008-06-04T00:00:00.000Z',
                  '2008-06-09T00:00:00.000Z',
                  '2008-06-14T00:00:00.000Z',
                  '2008-06-19T00:00:00.000Z',
                  '2008-06-24T00:00:00.000Z',
                  '2008-06-29T00:00:00.000Z',
                  '2008-07-04T00:00:00.000Z',
                  '2008-07-09T00:00:00.000Z',
                  '2008-07-14T00:00:00.000Z',
                  '2008-07-19T00:00:00.000Z',
                  '2008-07-24T00:00:00.000Z',
                  '2008-07-29T00:00:00.000Z',
                  '2008-08-03T00:00:00.000Z',
                  '2008-08-08T00:00:00.000Z',
                  '2008-08-13T00:00:00.000Z',
                  '2008-08-18T00:00:00.000Z',
                  '2008-08-23T00:00:00.000Z',
                  '2008-08-28T00:00:00.000Z',
                  '2008-09-02T00:00:00.000Z',
                  '2008-09-07T00:00:00.000Z',
                  '2008-09-12T00:00:00.000Z',
                  '2008-09-17T00:00:00.000Z',
                  '2008-09-22T00:00:00.000Z',
                  '2008-09-27T00:00:00.000Z',
                  '2008-10-02T00:00:00.000Z',
                  '2008-10-07T00:00:00.000Z',
                  '2008-10-12T00:00:00.000Z',
                  '2008-10-17T00:00:00.000Z',
                  '2008-10-22T00:00:00.000Z',
                  '2008-10-27T00:00:00.000Z',
                  '2008-11-01T00:00:00.000Z',
                  '2008-11-06T00:00:00.000Z',
                  '2008-11-11T00:00:00.000Z',
                  '2008-11-16T00:00:00.000Z',
                  '2008-11-21T00:00:00.000Z',
                  '2008-11-26T00:00:00.000Z',
                  '2008-12-01T00:00:00.000Z',
                  '2008-12-06T00:00:00.000Z',
                  '2008-12-11T00:00:00.000Z',
                  '2008-12-16T00:00:00.000Z',
                  '2008-12-21T00:00:00.000Z',
                  '2008-12-26T00:00:00.000Z',
                  '2008-12-31T00:00:00.000Z',
                  '2009-01-01T00:00:00.000Z',
                  '2009-01-06T00:00:00.000Z',
                  '2009-01-11T00:00:00.000Z',
                  '2009-01-16T00:00:00.000Z',
                  '2009-01-21T00:00:00.000Z',
                  '2009-01-26T00:00:00.000Z',
                  '2009-01-31T00:00:00.000Z',
                  '2009-02-05T00:00:00.000Z',
                  '2009-02-10T00:00:00.000Z',
                  '2009-02-15T00:00:00.000Z',
                  '2009-02-20T00:00:00.000Z',
                  '2009-02-25T00:00:00.000Z',
                  '2009-03-02T00:00:00.000Z',
                  '2009-03-07T00:00:00.000Z',
                  '2009-03-12T00:00:00.000Z',
                  '2009-03-17T00:00:00.000Z',
                  '2009-03-22T00:00:00.000Z',
                  '2009-03-27T00:00:00.000Z',
                  '2009-04-01T00:00:00.000Z',
                  '2009-04-06T00:00:00.000Z',
                  '2009-04-11T00:00:00.000Z',
                  '2009-04-16T00:00:00.000Z',
                  '2009-04-21T00:00:00.000Z',
                  '2009-04-26T00:00:00.000Z',
                  '2009-05-01T00:00:00.000Z',
                  '2009-05-06T00:00:00.000Z',
                  '2009-05-11T00:00:00.000Z',
                  '2009-05-16T00:00:00.000Z',
                  '2009-05-21T00:00:00.000Z',
                  '2009-05-26T00:00:00.000Z',
                  '2009-05-31T00:00:00.000Z',
                  '2009-06-05T00:00:00.000Z',
                  '2009-06-10T00:00:00.000Z',
                  '2009-06-15T00:00:00.000Z',
                  '2009-06-20T00:00:00.000Z',
                  '2009-06-25T00:00:00.000Z',
                  '2009-06-30T00:00:00.000Z',
                  '2009-07-05T00:00:00.000Z',
                  '2009-07-10T00:00:00.000Z',
                  '2009-07-15T00:00:00.000Z',
                  '2009-07-20T00:00:00.000Z',
                  '2009-07-25T00:00:00.000Z',
                  '2009-07-30T00:00:00.000Z',
                  '2009-08-04T00:00:00.000Z',
                  '2009-08-09T00:00:00.000Z',
                  '2009-08-14T00:00:00.000Z',
                  '2009-08-19T00:00:00.000Z',
                  '2009-08-24T00:00:00.000Z',
                  '2009-08-29T00:00:00.000Z',
                  '2009-09-03T00:00:00.000Z',
                  '2009-09-08T00:00:00.000Z',
                  '2009-09-13T00:00:00.000Z',
                  '2009-09-18T00:00:00.000Z',
                  '2009-09-23T00:00:00.000Z',
                  '2009-09-28T00:00:00.000Z',
                  '2009-10-03T00:00:00.000Z',
                  '2009-10-08T00:00:00.000Z',
                  '2009-10-13T00:00:00.000Z',
                  '2009-10-18T00:00:00.000Z',
                  '2009-10-23T00:00:00.000Z',
                  '2009-10-28T00:00:00.000Z',
                  '2009-11-02T00:00:00.000Z',
                  '2009-11-07T00:00:00.000Z',
                  '2009-11-12T00:00:00.000Z',
                  '2009-11-17T00:00:00.000Z',
                  '2009-11-22T00:00:00.000Z',
                  '2009-11-27T00:00:00.000Z',
                  '2009-12-02T00:00:00.000Z',
                  '2009-12-07T00:00:00.000Z',
                  '2009-12-12T00:00:00.000Z',
                  '2009-12-17T00:00:00.000Z',
                  '2009-12-22T00:00:00.000Z',
                  '2009-12-27T00:00:00.000Z',
                  '2010-01-01T00:00:00.000Z',
                  '2010-01-06T00:00:00.000Z',
                  '2010-01-11T00:00:00.000Z',
                  '2010-01-16T00:00:00.000Z',
                  '2010-01-21T00:00:00.000Z',
                  '2010-01-26T00:00:00.000Z',
                  '2010-01-31T00:00:00.000Z',
                  '2010-02-05T00:00:00.000Z',
                  '2010-02-10T00:00:00.000Z',
                  '2010-02-15T00:00:00.000Z',
                  '2010-02-20T00:00:00.000Z',
                  '2010-02-25T00:00:00.000Z',
                  '2010-03-02T00:00:00.000Z',
                  '2010-03-07T00:00:00.000Z',
                  '2010-03-12T00:00:00.000Z',
                  '2010-03-17T00:00:00.000Z',
                  '2010-03-22T00:00:00.000Z',
                  '2010-03-27T00:00:00.000Z',
                  '2010-04-01T00:00:00.000Z',
                  '2010-04-06T00:00:00.000Z',
                  '2010-04-11T00:00:00.000Z',
                  '2010-04-16T00:00:00.000Z',
                  '2010-04-21T00:00:00.000Z',
                  '2010-04-26T00:00:00.000Z',
                  '2010-05-01T00:00:00.000Z',
                  '2010-05-06T00:00:00.000Z',
                  '2010-05-11T00:00:00.000Z',
                  '2010-05-16T00:00:00.000Z',
                  '2010-05-21T00:00:00.000Z',
                  '2010-05-26T00:00:00.000Z',
                  '2010-05-31T00:00:00.000Z',
                  '2010-06-05T00:00:00.000Z',
                  '2010-06-10T00:00:00.000Z',
                  '2010-06-15T00:00:00.000Z',
                  '2010-06-20T00:00:00.000Z',
                  '2010-06-25T00:00:00.000Z',
                  '2010-06-30T00:00:00.000Z',
                  '2010-07-05T00:00:00.000Z',
                  '2010-07-10T00:00:00.000Z',
                  '2010-07-15T00:00:00.000Z',
                  '2010-07-20T00:00:00.000Z',
                  '2010-07-25T00:00:00.000Z',
                  '2010-07-30T00:00:00.000Z',
                  '2010-08-04T00:00:00.000Z',
                  '2010-08-09T00:00:00.000Z',
                  '2010-08-14T00:00:00.000Z',
                  '2010-08-19T00:00:00.000Z',
                  '2010-08-24T00:00:00.000Z',
                  '2010-08-29T00:00:00.000Z',
                  '2010-09-03T00:00:00.000Z',
                  '2010-09-08T00:00:00.000Z',
                  '2010-09-13T00:00:00.000Z',
                  '2010-09-18T00:00:00.000Z',
                  '2010-09-23T00:00:00.000Z',
                  '2010-09-28T00:00:00.000Z',
                  '2010-10-03T00:00:00.000Z',
                  '2010-10-08T00:00:00.000Z',
                  '2010-10-13T00:00:00.000Z',
                  '2010-10-18T00:00:00.000Z',
                  '2010-10-23T00:00:00.000Z',
                  '2010-10-28T00:00:00.000Z',
                  '2010-11-02T00:00:00.000Z',
                  '2010-11-07T00:00:00.000Z',
                  '2010-11-12T00:00:00.000Z',
                  '2010-11-17T00:00:00.000Z',
                  '2010-11-22T00:00:00.000Z',
                  '2010-11-27T00:00:00.000Z',
                  '2010-12-02T00:00:00.000Z',
                  '2010-12-07T00:00:00.000Z',
                  '2010-12-12T00:00:00.000Z',
                  '2010-12-17T00:00:00.000Z',
                  '2010-12-22T00:00:00.000Z',
                  '2010-12-27T00:00:00.000Z',
                  '2011-01-01T00:00:00.000Z',
                  '2011-01-06T00:00:00.000Z',
                  '2011-01-11T00:00:00.000Z',
                  '2011-01-16T00:00:00.000Z',
                  '2011-01-21T00:00:00.000Z',
                  '2011-01-26T00:00:00.000Z',
                  '2011-01-31T00:00:00.000Z',
                  '2011-02-05T00:00:00.000Z',
                  '2011-02-10T00:00:00.000Z',
                  '2011-02-15T00:00:00.000Z',
                  '2011-02-20T00:00:00.000Z',
                  '2011-02-25T00:00:00.000Z',
                  '2011-03-02T00:00:00.000Z',
                  '2011-03-07T00:00:00.000Z',
                  '2011-03-12T00:00:00.000Z',
                  '2011-03-17T00:00:00.000Z',
                  '2011-03-22T00:00:00.000Z',
                  '2011-03-27T00:00:00.000Z',
                  '2011-04-01T00:00:00.000Z',
                  '2011-04-06T00:00:00.000Z',
                  '2011-04-11T00:00:00.000Z',
                  '2011-04-16T00:00:00.000Z',
                  '2011-04-21T00:00:00.000Z',
                  '2011-04-26T00:00:00.000Z',
                  '2011-05-01T00:00:00.000Z',
                  '2011-05-06T00:00:00.000Z',
                  '2011-05-11T00:00:00.000Z',
                  '2011-05-16T00:00:00.000Z',
                  '2011-05-21T00:00:00.000Z',
                  '2011-05-26T00:00:00.000Z',
                  '2011-05-31T00:00:00.000Z',
                  '2011-06-05T00:00:00.000Z',
                  '2011-06-10T00:00:00.000Z',
                  '2011-06-15T00:00:00.000Z',
                  '2011-06-20T00:00:00.000Z',
                  '2011-06-25T00:00:00.000Z',
                  '2011-06-30T00:00:00.000Z',
                  '2011-07-05T00:00:00.000Z',
                  '2011-07-10T00:00:00.000Z',
                  '2011-07-15T00:00:00.000Z',
                  '2011-07-20T00:00:00.000Z',
                  '2011-07-25T00:00:00.000Z',
                  '2011-07-30T00:00:00.000Z',
                  '2011-08-04T00:00:00.000Z',
                  '2011-08-09T00:00:00.000Z',
                  '2011-08-14T00:00:00.000Z',
                  '2011-08-19T00:00:00.000Z',
                  '2011-08-24T00:00:00.000Z',
                  '2011-08-29T00:00:00.000Z',
                  '2011-09-03T00:00:00.000Z',
                  '2011-09-08T00:00:00.000Z',
                  '2011-09-13T00:00:00.000Z',
                  '2011-09-18T00:00:00.000Z',
                  '2011-09-23T00:00:00.000Z',
                  '2011-09-28T00:00:00.000Z',
                  '2011-10-03T00:00:00.000Z',
                  '2011-10-08T00:00:00.000Z',
                  '2011-10-13T00:00:00.000Z',
                  '2011-10-18T00:00:00.000Z',
                  '2011-10-23T00:00:00.000Z',
                  '2011-10-28T00:00:00.000Z',
                  '2011-11-02T00:00:00.000Z',
                  '2011-11-07T00:00:00.000Z',
                  '2011-11-12T00:00:00.000Z',
                  '2011-11-17T00:00:00.000Z',
                  '2011-11-22T00:00:00.000Z',
                  '2011-11-27T00:00:00.000Z',
                  '2011-12-02T00:00:00.000Z',
                  '2011-12-07T00:00:00.000Z',
                  '2011-12-12T00:00:00.000Z',
                  '2011-12-17T00:00:00.000Z',
                  '2011-12-22T00:00:00.000Z',
                  '2011-12-27T00:00:00.000Z',
                  '2012-01-01T00:00:00.000Z',
                  '2012-01-06T00:00:00.000Z',
                  '2012-01-11T00:00:00.000Z',
                  '2012-01-16T00:00:00.000Z',
                  '2012-01-21T00:00:00.000Z',
                  '2012-01-26T00:00:00.000Z',
                  '2012-01-31T00:00:00.000Z',
                  '2012-02-05T00:00:00.000Z',
                  '2012-02-10T00:00:00.000Z',
                  '2012-02-15T00:00:00.000Z',
                  '2012-02-20T00:00:00.000Z',
                  '2012-02-25T00:00:00.000Z',
                  '2012-03-01T00:00:00.000Z',
                  '2012-03-06T00:00:00.000Z',
                  '2012-03-11T00:00:00.000Z',
                  '2012-03-16T00:00:00.000Z',
                  '2012-03-21T00:00:00.000Z',
                  '2012-03-26T00:00:00.000Z',
                  '2012-03-31T00:00:00.000Z',
                  '2012-04-05T00:00:00.000Z',
                  '2012-04-10T00:00:00.000Z',
                  '2012-04-15T00:00:00.000Z',
                  '2012-04-20T00:00:00.000Z',
                  '2012-04-25T00:00:00.000Z',
                  '2012-04-30T00:00:00.000Z',
                  '2012-05-05T00:00:00.000Z',
                  '2012-05-10T00:00:00.000Z',
                  '2012-05-15T00:00:00.000Z',
                  '2012-05-20T00:00:00.000Z',
                  '2012-05-25T00:00:00.000Z',
                  '2012-05-30T00:00:00.000Z',
                  '2012-06-04T00:00:00.000Z',
                  '2012-06-09T00:00:00.000Z',
                  '2012-06-14T00:00:00.000Z',
                  '2012-06-19T00:00:00.000Z',
                  '2012-06-24T00:00:00.000Z',
                  '2012-06-29T00:00:00.000Z',
                  '2012-07-04T00:00:00.000Z',
                  '2012-07-09T00:00:00.000Z',
                  '2012-07-14T00:00:00.000Z',
                  '2012-07-19T00:00:00.000Z',
                  '2012-07-24T00:00:00.000Z',
                  '2012-07-29T00:00:00.000Z',
                  '2012-08-03T00:00:00.000Z',
                  '2012-08-08T00:00:00.000Z',
                  '2012-08-13T00:00:00.000Z',
                  '2012-08-18T00:00:00.000Z',
                  '2012-08-23T00:00:00.000Z',
                  '2012-08-28T00:00:00.000Z',
                  '2012-09-02T00:00:00.000Z',
                  '2012-09-07T00:00:00.000Z',
                  '2012-09-12T00:00:00.000Z',
                  '2012-09-17T00:00:00.000Z',
                  '2012-09-22T00:00:00.000Z',
                  '2012-09-27T00:00:00.000Z',
                  '2012-10-02T00:00:00.000Z',
                  '2012-10-07T00:00:00.000Z',
                  '2012-10-12T00:00:00.000Z',
                  '2012-10-17T00:00:00.000Z',
                  '2012-10-22T00:00:00.000Z',
                  '2012-10-27T00:00:00.000Z',
                  '2012-11-01T00:00:00.000Z',
                  '2012-11-06T00:00:00.000Z',
                  '2012-11-11T00:00:00.000Z',
                  '2012-11-16T00:00:00.000Z',
                  '2012-11-21T00:00:00.000Z',
                  '2012-11-26T00:00:00.000Z',
                  '2012-12-01T00:00:00.000Z',
                  '2012-12-06T00:00:00.000Z',
                  '2012-12-11T00:00:00.000Z',
                  '2012-12-16T00:00:00.000Z',
                  '2012-12-21T00:00:00.000Z',
                  '2012-12-26T00:00:00.000Z',
                  '2012-12-31T00:00:00.000Z',
                  '2013-01-01T00:00:00.000Z',
                  '2013-01-06T00:00:00.000Z',
                  '2013-01-11T00:00:00.000Z',
                  '2013-01-16T00:00:00.000Z',
                  '2013-01-21T00:00:00.000Z',
                  '2013-01-26T00:00:00.000Z',
                  '2013-01-31T00:00:00.000Z',
                  '2013-02-05T00:00:00.000Z',
                  '2013-02-10T00:00:00.000Z',
                  '2013-02-15T00:00:00.000Z',
                  '2013-02-20T00:00:00.000Z',
                  '2013-02-25T00:00:00.000Z',
                  '2013-03-02T00:00:00.000Z',
                  '2013-03-07T00:00:00.000Z',
                  '2013-03-12T00:00:00.000Z',
                  '2013-03-17T00:00:00.000Z',
                  '2013-03-22T00:00:00.000Z',
                  '2013-03-27T00:00:00.000Z',
                  '2013-04-01T00:00:00.000Z',
                  '2013-04-06T00:00:00.000Z',
                  '2013-04-11T00:00:00.000Z',
                  '2013-04-16T00:00:00.000Z',
                  '2013-04-21T00:00:00.000Z',
                  '2013-04-26T00:00:00.000Z',
                  '2013-05-01T00:00:00.000Z',
                  '2013-05-06T00:00:00.000Z',
                  '2013-05-11T00:00:00.000Z',
                  '2013-05-16T00:00:00.000Z',
                  '2013-05-21T00:00:00.000Z',
                  '2013-05-26T00:00:00.000Z',
                  '2013-05-31T00:00:00.000Z',
                  '2013-06-05T00:00:00.000Z',
                  '2013-06-10T00:00:00.000Z',
                  '2013-06-15T00:00:00.000Z',
                  '2013-06-20T00:00:00.000Z',
                  '2013-06-25T00:00:00.000Z',
                  '2013-06-30T00:00:00.000Z',
                  '2013-07-05T00:00:00.000Z',
                  '2013-07-10T00:00:00.000Z',
                  '2013-07-15T00:00:00.000Z',
                  '2013-07-20T00:00:00.000Z',
                  '2013-07-25T00:00:00.000Z',
                  '2013-07-30T00:00:00.000Z',
                  '2013-08-04T00:00:00.000Z',
                  '2013-08-09T00:00:00.000Z',
                  '2013-08-14T00:00:00.000Z',
                  '2013-08-19T00:00:00.000Z',
                  '2013-08-24T00:00:00.000Z',
                  '2013-08-29T00:00:00.000Z',
                  '2013-09-03T00:00:00.000Z',
                  '2013-09-08T00:00:00.000Z',
                  '2013-09-13T00:00:00.000Z',
                  '2013-09-18T00:00:00.000Z',
                  '2013-09-23T00:00:00.000Z',
                  '2013-09-28T00:00:00.000Z',
                  '2013-10-03T00:00:00.000Z',
                  '2013-10-08T00:00:00.000Z',
                  '2013-10-13T00:00:00.000Z',
                  '2013-10-18T00:00:00.000Z',
                  '2013-10-23T00:00:00.000Z',
                  '2013-10-28T00:00:00.000Z',
                  '2013-11-02T00:00:00.000Z',
                  '2013-11-07T00:00:00.000Z',
                  '2013-11-12T00:00:00.000Z',
                  '2013-11-17T00:00:00.000Z',
                  '2013-11-22T00:00:00.000Z',
                  '2013-11-27T00:00:00.000Z',
                  '2013-12-02T00:00:00.000Z',
                  '2013-12-07T00:00:00.000Z',
                  '2013-12-12T00:00:00.000Z',
                  '2013-12-17T00:00:00.000Z',
                  '2013-12-22T00:00:00.000Z',
                  '2013-12-27T00:00:00.000Z',
                  '2014-01-01T00:00:00.000Z',
                  '2014-01-06T00:00:00.000Z',
                  '2014-01-11T00:00:00.000Z',
                  '2014-01-16T00:00:00.000Z',
                  '2014-01-21T00:00:00.000Z',
                  '2014-01-26T00:00:00.000Z',
                  '2014-01-31T00:00:00.000Z',
                  '2014-02-05T00:00:00.000Z',
                  '2014-02-10T00:00:00.000Z',
                  '2014-02-15T00:00:00.000Z',
                  '2014-02-20T00:00:00.000Z',
                  '2014-02-25T00:00:00.000Z',
                  '2014-03-02T00:00:00.000Z',
                  '2014-03-07T00:00:00.000Z',
                  '2014-03-12T00:00:00.000Z',
                  '2014-03-17T00:00:00.000Z',
                  '2014-03-22T00:00:00.000Z',
                  '2014-03-27T00:00:00.000Z',
                  '2014-04-01T00:00:00.000Z',
                  '2014-04-06T00:00:00.000Z',
                  '2014-04-11T00:00:00.000Z',
                  '2014-04-16T00:00:00.000Z',
                  '2014-04-21T00:00:00.000Z',
                  '2014-04-26T00:00:00.000Z',
                  '2014-05-01T00:00:00.000Z',
                  '2014-05-06T00:00:00.000Z',
                  '2014-05-11T00:00:00.000Z',
                  '2014-05-16T00:00:00.000Z',
                  '2014-05-21T00:00:00.000Z',
                  '2014-05-26T00:00:00.000Z',
                  '2014-05-31T00:00:00.000Z',
                  '2014-06-05T00:00:00.000Z',
                  '2014-06-10T00:00:00.000Z',
                  '2014-06-15T00:00:00.000Z',
                  '2014-06-20T00:00:00.000Z',
                  '2014-06-25T00:00:00.000Z',
                  '2014-06-30T00:00:00.000Z',
                  '2014-07-05T00:00:00.000Z',
                  '2014-07-10T00:00:00.000Z',
                  '2014-07-15T00:00:00.000Z',
                  '2014-07-20T00:00:00.000Z',
                  '2014-07-25T00:00:00.000Z',
                  '2014-07-30T00:00:00.000Z',
                  '2014-08-04T00:00:00.000Z',
                  '2014-08-09T00:00:00.000Z',
                  '2014-08-14T00:00:00.000Z',
                  '2014-08-19T00:00:00.000Z',
                  '2014-08-24T00:00:00.000Z',
                  '2014-08-29T00:00:00.000Z',
                  '2014-09-03T00:00:00.000Z',
                  '2014-09-08T00:00:00.000Z',
                  '2014-09-13T00:00:00.000Z',
                  '2014-09-18T00:00:00.000Z',
                  '2014-09-23T00:00:00.000Z',
                  '2014-09-28T00:00:00.000Z',
                  '2014-10-03T00:00:00.000Z',
                  '2014-10-08T00:00:00.000Z',
                  '2014-10-13T00:00:00.000Z',
                  '2014-10-18T00:00:00.000Z',
                  '2014-10-23T00:00:00.000Z',
                  '2014-10-28T00:00:00.000Z',
                  '2014-11-02T00:00:00.000Z',
                  '2014-11-07T00:00:00.000Z',
                  '2014-11-12T00:00:00.000Z',
                  '2014-11-17T00:00:00.000Z',
                  '2014-11-22T00:00:00.000Z',
                  '2014-11-27T00:00:00.000Z',
                  '2014-12-02T00:00:00.000Z',
                  '2014-12-07T00:00:00.000Z',
                  '2014-12-12T00:00:00.000Z',
                  '2014-12-17T00:00:00.000Z',
                  '2014-12-22T00:00:00.000Z',
                  '2014-12-27T00:00:00.000Z',
                  '2015-01-01T00:00:00.000Z',
                  '2015-01-06T00:00:00.000Z',
                  '2015-01-11T00:00:00.000Z',
                  '2015-01-16T00:00:00.000Z',
                  '2015-01-21T00:00:00.000Z',
                  '2015-01-26T00:00:00.000Z',
                  '2015-01-31T00:00:00.000Z',
                  '2015-02-05T00:00:00.000Z',
                  '2015-02-10T00:00:00.000Z',
                  '2015-02-15T00:00:00.000Z',
                  '2015-02-20T00:00:00.000Z',
                  '2015-02-25T00:00:00.000Z',
                  '2015-03-02T00:00:00.000Z',
                  '2015-03-07T00:00:00.000Z',
                  '2015-03-12T00:00:00.000Z',
                  '2015-03-17T00:00:00.000Z',
                  '2015-03-22T00:00:00.000Z',
                  '2015-03-27T00:00:00.000Z',
                  '2015-04-01T00:00:00.000Z',
                  '2015-04-06T00:00:00.000Z',
                  '2015-04-11T00:00:00.000Z',
                  '2015-04-16T00:00:00.000Z',
                  '2015-04-21T00:00:00.000Z',
                  '2015-04-26T00:00:00.000Z',
                  '2015-05-01T00:00:00.000Z',
                  '2015-05-06T00:00:00.000Z',
                  '2015-05-11T00:00:00.000Z',
                  '2015-05-16T00:00:00.000Z',
                  '2015-05-21T00:00:00.000Z',
                  '2015-05-26T00:00:00.000Z',
                  '2015-05-31T00:00:00.000Z',
                  '2015-06-05T00:00:00.000Z',
                  '2015-06-10T00:00:00.000Z',
                  '2015-06-15T00:00:00.000Z',
                  '2015-06-20T00:00:00.000Z',
                  '2015-06-25T00:00:00.000Z',
                  '2015-06-30T00:00:00.000Z',
                  '2015-07-05T00:00:00.000Z',
                  '2015-07-10T00:00:00.000Z',
                  '2015-07-15T00:00:00.000Z',
                  '2015-07-20T00:00:00.000Z',
                  '2015-07-25T00:00:00.000Z',
                  '2015-07-30T00:00:00.000Z',
                  '2015-08-04T00:00:00.000Z',
                  '2015-08-09T00:00:00.000Z',
                  '2015-08-14T00:00:00.000Z',
                  '2015-08-19T00:00:00.000Z',
                  '2015-08-24T00:00:00.000Z',
                  '2015-08-29T00:00:00.000Z',
                  '2015-09-03T00:00:00.000Z',
                  '2015-09-08T00:00:00.000Z',
                  '2015-09-13T00:00:00.000Z',
                  '2015-09-18T00:00:00.000Z',
                  '2015-09-23T00:00:00.000Z',
                  '2015-09-28T00:00:00.000Z',
                  '2015-10-03T00:00:00.000Z',
                  '2015-10-08T00:00:00.000Z',
                  '2015-10-13T00:00:00.000Z',
                  '2015-10-18T00:00:00.000Z',
                  '2015-10-23T00:00:00.000Z',
                  '2015-10-28T00:00:00.000Z',
                  '2015-11-02T00:00:00.000Z',
                  '2015-11-07T00:00:00.000Z',
                  '2015-11-12T00:00:00.000Z',
                  '2015-11-17T00:00:00.000Z',
                  '2015-11-22T00:00:00.000Z',
                  '2015-11-27T00:00:00.000Z',
                  '2015-12-02T00:00:00.000Z',
                  '2015-12-07T00:00:00.000Z',
                  '2015-12-12T00:00:00.000Z',
                  '2015-12-17T00:00:00.000Z',
                  '2015-12-22T00:00:00.000Z',
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
                  '1997-09-04T00:00:00.000Z',
                  '1997-09-09T00:00:00.000Z',
                  '1997-09-15T00:00:00.000Z',
                  '1997-09-18T00:00:00.000Z',
                  '1997-09-23T00:00:00.000Z',
                  '1997-09-28T00:00:00.000Z',
                  '1997-10-03T00:00:00.000Z',
                  '1997-10-08T00:00:00.000Z',
                  '1997-10-19T00:00:00.000Z',
                  '1997-10-23T00:00:00.000Z',
                  '1997-10-28T00:00:00.000Z',
                  '1997-11-02T00:00:00.000Z',
                  '1997-11-07T00:00:00.000Z',
                  '1997-11-12T00:00:00.000Z',
                  '1997-11-17T00:00:00.000Z',
                  '1997-11-22T00:00:00.000Z',
                  '1997-11-27T00:00:00.000Z',
                  '1997-12-02T00:00:00.000Z',
                  '1997-12-07T00:00:00.000Z',
                  '1997-12-12T00:00:00.000Z',
                  '1997-12-17T00:00:00.000Z',
                  '1997-12-22T00:00:00.000Z',
                  '1997-12-27T00:00:00.000Z',
                  '1998-01-01T00:00:00.000Z',
                  '1998-01-06T00:00:00.000Z',
                  '1998-01-11T00:00:00.000Z',
                  '1998-01-16T00:00:00.000Z',
                  '1998-01-21T00:00:00.000Z',
                  '1998-01-26T00:00:00.000Z',
                  '1998-01-31T00:00:00.000Z',
                  '1998-02-05T00:00:00.000Z',
                  '1998-02-10T00:00:00.000Z',
                  '1998-02-15T00:00:00.000Z',
                  '1998-02-20T00:00:00.000Z',
                  '1998-02-25T00:00:00.000Z',
                  '1998-03-02T00:00:00.000Z',
                  '1998-03-07T00:00:00.000Z',
                  '1998-03-12T00:00:00.000Z',
                  '1998-03-17T00:00:00.000Z',
                  '1998-03-22T00:00:00.000Z',
                  '1998-03-27T00:00:00.000Z',
                  '1998-04-01T00:00:00.000Z',
                  '1998-04-06T00:00:00.000Z',
                  '1998-04-11T00:00:00.000Z',
                  '1998-04-16T00:00:00.000Z',
                  '1998-04-21T00:00:00.000Z',
                  '1998-04-26T00:00:00.000Z',
                  '1998-05-01T00:00:00.000Z',
                  '1998-05-06T00:00:00.000Z',
                  '1998-05-11T00:00:00.000Z',
                  '1998-05-16T00:00:00.000Z',
                  '1998-05-21T00:00:00.000Z',
                  '1998-05-26T00:00:00.000Z',
                  '1998-05-31T00:00:00.000Z',
                  '1998-06-05T00:00:00.000Z',
                  '1998-06-10T00:00:00.000Z',
                  '1998-06-15T00:00:00.000Z',
                  '1998-06-20T00:00:00.000Z',
                  '1998-06-25T00:00:00.000Z',
                  '1998-06-30T00:00:00.000Z',
                  '1998-07-05T00:00:00.000Z',
                  '1998-07-11T00:00:00.000Z',
                  '1998-07-15T00:00:00.000Z',
                  '1998-07-20T00:00:00.000Z',
                  '1998-07-25T00:00:00.000Z',
                  '1998-07-30T00:00:00.000Z',
                  '1998-08-04T00:00:00.000Z',
                  '1998-08-09T00:00:00.000Z',
                  '1998-08-14T00:00:00.000Z',
                  '1998-08-19T00:00:00.000Z',
                  '1998-08-24T00:00:00.000Z',
                  '1998-08-29T00:00:00.000Z',
                  '1998-09-03T00:00:00.000Z',
                  '1998-09-08T00:00:00.000Z',
                  '1998-09-13T00:00:00.000Z',
                  '1998-09-18T00:00:00.000Z',
                  '1998-09-23T00:00:00.000Z',
                  '1998-09-28T00:00:00.000Z',
                  '1998-10-03T00:00:00.000Z',
                  '1998-10-08T00:00:00.000Z',
                  '1998-10-13T00:00:00.000Z',
                  '1998-10-18T00:00:00.000Z',
                  '1998-10-23T00:00:00.000Z',
                  '1998-10-28T00:00:00.000Z',
                  '1998-11-02T00:00:00.000Z',
                  '1998-11-07T00:00:00.000Z',
                  '1998-11-12T00:00:00.000Z',
                  '1998-11-21T00:00:00.000Z',
                  '1998-11-22T00:00:00.000Z',
                  '1998-11-27T00:00:00.000Z',
                  '1998-12-02T00:00:00.000Z',
                  '1998-12-07T00:00:00.000Z',
                  '1998-12-12T00:00:00.000Z',
                  '1998-12-18T00:00:00.000Z',
                  '1998-12-22T00:00:00.000Z',
                  '1998-12-27T00:00:00.000Z',
                  '1999-01-01T00:00:00.000Z',
                  '1999-01-06T00:00:00.000Z',
                  '1999-01-11T00:00:00.000Z',
                  '1999-01-16T00:00:00.000Z',
                  '1999-01-21T00:00:00.000Z',
                  '1999-01-26T00:00:00.000Z',
                  '1999-01-31T00:00:00.000Z',
                  '1999-02-05T00:00:00.000Z',
                  '1999-02-10T00:00:00.000Z',
                  '1999-02-15T00:00:00.000Z',
                  '1999-02-20T00:00:00.000Z',
                  '1999-02-25T00:00:00.000Z',
                  '1999-03-02T00:00:00.000Z',
                  '1999-03-07T00:00:00.000Z',
                  '1999-03-12T00:00:00.000Z',
                  '1999-03-17T00:00:00.000Z',
                  '1999-03-22T00:00:00.000Z',
                  '1999-03-27T00:00:00.000Z',
                  '1999-04-01T00:00:00.000Z',
                  '1999-04-06T00:00:00.000Z',
                  '1999-04-11T00:00:00.000Z',
                  '1999-04-16T00:00:00.000Z',
                  '1999-04-21T00:00:00.000Z',
                  '1999-04-26T00:00:00.000Z',
                  '1999-05-01T00:00:00.000Z',
                  '1999-05-06T00:00:00.000Z',
                  '1999-05-11T00:00:00.000Z',
                  '1999-05-16T00:00:00.000Z',
                  '1999-05-21T00:00:00.000Z',
                  '1999-05-26T00:00:00.000Z',
                  '1999-05-31T00:00:00.000Z',
                  '1999-06-05T00:00:00.000Z',
                  '1999-06-10T00:00:00.000Z',
                  '1999-06-15T00:00:00.000Z',
                  '1999-06-20T00:00:00.000Z',
                  '1999-06-25T00:00:00.000Z',
                  '1999-06-30T00:00:00.000Z',
                  '1999-07-05T00:00:00.000Z',
                  '1999-07-10T00:00:00.000Z',
                  '1999-07-15T00:00:00.000Z',
                  '1999-07-20T00:00:00.000Z',
                  '1999-07-25T00:00:00.000Z',
                  '1999-07-30T00:00:00.000Z',
                  '1999-08-04T00:00:00.000Z',
                  '1999-08-09T00:00:00.000Z',
                  '1999-08-14T00:00:00.000Z',
                  '1999-08-19T00:00:00.000Z',
                  '1999-08-24T00:00:00.000Z',
                  '1999-08-29T00:00:00.000Z',
                  '1999-09-03T00:00:00.000Z',
                  '1999-09-08T00:00:00.000Z',
                  '1999-09-13T00:00:00.000Z',
                  '1999-09-18T00:00:00.000Z',
                  '1999-09-23T00:00:00.000Z',
                  '1999-09-28T00:00:00.000Z',
                  '1999-10-03T00:00:00.000Z',
                  '1999-10-08T00:00:00.000Z',
                  '1999-10-13T00:00:00.000Z',
                  '1999-10-18T00:00:00.000Z',
                  '1999-10-23T00:00:00.000Z',
                  '1999-10-28T00:00:00.000Z',
                  '1999-11-02T00:00:00.000Z',
                  '1999-11-07T00:00:00.000Z',
                  '1999-11-12T00:00:00.000Z',
                  '1999-11-19T00:00:00.000Z',
                  '1999-11-22T00:00:00.000Z',
                  '1999-11-27T00:00:00.000Z',
                  '1999-12-02T00:00:00.000Z',
                  '1999-12-07T00:00:00.000Z',
                  '1999-12-12T00:00:00.000Z',
                  '1999-12-17T00:00:00.000Z',
                  '1999-12-22T00:00:00.000Z',
                  '1999-12-27T00:00:00.000Z',
                  '2000-01-01T00:00:00.000Z',
                  '2000-01-06T00:00:00.000Z',
                  '2000-01-11T00:00:00.000Z',
                  '2000-01-16T00:00:00.000Z',
                  '2000-01-21T00:00:00.000Z',
                  '2000-01-26T00:00:00.000Z',
                  '2000-01-31T00:00:00.000Z',
                  '2000-02-05T00:00:00.000Z',
                  '2000-02-10T00:00:00.000Z',
                  '2000-02-15T00:00:00.000Z',
                  '2000-02-20T00:00:00.000Z',
                  '2000-02-25T00:00:00.000Z',
                  '2000-03-01T00:00:00.000Z',
                  '2000-03-06T00:00:00.000Z',
                  '2000-03-11T00:00:00.000Z',
                  '2000-03-16T00:00:00.000Z',
                  '2000-03-21T00:00:00.000Z',
                  '2000-03-26T00:00:00.000Z',
                  '2000-03-31T00:00:00.000Z',
                  '2000-04-05T00:00:00.000Z',
                  '2000-04-10T00:00:00.000Z',
                  '2000-04-15T00:00:00.000Z',
                  '2000-04-20T00:00:00.000Z',
                  '2000-04-25T00:00:00.000Z',
                  '2000-04-30T00:00:00.000Z',
                  '2000-05-05T00:00:00.000Z',
                  '2000-05-10T00:00:00.000Z',
                  '2000-05-15T00:00:00.000Z',
                  '2000-05-20T00:00:00.000Z',
                  '2000-05-25T00:00:00.000Z',
                  '2000-05-30T00:00:00.000Z',
                  '2000-06-04T00:00:00.000Z',
                  '2000-06-09T00:00:00.000Z',
                  '2000-06-14T00:00:00.000Z',
                  '2000-06-19T00:00:00.000Z',
                  '2000-06-24T00:00:00.000Z',
                  '2000-06-29T00:00:00.000Z',
                  '2000-07-04T00:00:00.000Z',
                  '2000-07-09T00:00:00.000Z',
                  '2000-07-14T00:00:00.000Z',
                  '2000-07-19T00:00:00.000Z',
                  '2000-07-24T00:00:00.000Z',
                  '2000-07-29T00:00:00.000Z',
                  '2000-08-03T00:00:00.000Z',
                  '2000-08-08T00:00:00.000Z',
                  '2000-08-13T00:00:00.000Z',
                  '2000-08-18T00:00:00.000Z',
                  '2000-08-23T00:00:00.000Z',
                  '2000-08-28T00:00:00.000Z',
                  '2000-09-02T00:00:00.000Z',
                  '2000-09-07T00:00:00.000Z',
                  '2000-09-12T00:00:00.000Z',
                  '2000-09-17T00:00:00.000Z',
                  '2000-09-22T00:00:00.000Z',
                  '2000-09-27T00:00:00.000Z',
                  '2000-10-02T00:00:00.000Z',
                  '2000-10-07T00:00:00.000Z',
                  '2000-10-12T00:00:00.000Z',
                  '2000-10-17T00:00:00.000Z',
                  '2000-10-22T00:00:00.000Z',
                  '2000-10-27T00:00:00.000Z',
                  '2000-11-01T00:00:00.000Z',
                  '2000-11-06T00:00:00.000Z',
                  '2000-11-11T00:00:00.000Z',
                  '2000-11-16T00:00:00.000Z',
                  '2000-11-21T00:00:00.000Z',
                  '2000-11-26T00:00:00.000Z',
                  '2000-12-01T00:00:00.000Z',
                  '2000-12-06T00:00:00.000Z',
                  '2000-12-11T00:00:00.000Z',
                  '2000-12-16T00:00:00.000Z',
                  '2000-12-21T00:00:00.000Z',
                  '2000-12-26T00:00:00.000Z',
                  '2000-12-31T00:00:00.000Z',
                  '2001-01-01T00:00:00.000Z',
                  '2001-01-06T00:00:00.000Z',
                  '2001-01-11T00:00:00.000Z',
                  '2001-01-16T00:00:00.000Z',
                  '2001-01-21T00:00:00.000Z',
                  '2001-01-26T00:00:00.000Z',
                  '2001-01-31T00:00:00.000Z',
                  '2001-02-05T00:00:00.000Z',
                  '2001-02-10T00:00:00.000Z',
                  '2001-02-15T00:00:00.000Z',
                  '2001-02-20T00:00:00.000Z',
                  '2001-02-25T00:00:00.000Z',
                  '2001-03-02T00:00:00.000Z',
                  '2001-03-07T00:00:00.000Z',
                  '2001-03-12T00:00:00.000Z',
                  '2001-03-17T00:00:00.000Z',
                  '2001-03-22T00:00:00.000Z',
                  '2001-03-27T00:00:00.000Z',
                  '2001-04-01T00:00:00.000Z',
                  '2001-04-06T00:00:00.000Z',
                  '2001-04-11T00:00:00.000Z',
                  '2001-04-16T00:00:00.000Z',
                  '2001-04-21T00:00:00.000Z',
                  '2001-04-26T00:00:00.000Z',
                  '2001-05-01T00:00:00.000Z',
                  '2001-05-06T00:00:00.000Z',
                  '2001-05-11T00:00:00.000Z',
                  '2001-05-16T00:00:00.000Z',
                  '2001-05-21T00:00:00.000Z',
                  '2001-05-26T00:00:00.000Z',
                  '2001-05-31T00:00:00.000Z',
                  '2001-06-05T00:00:00.000Z',
                  '2001-06-10T00:00:00.000Z',
                  '2001-06-15T00:00:00.000Z',
                  '2001-06-20T00:00:00.000Z',
                  '2001-06-25T00:00:00.000Z',
                  '2001-06-30T00:00:00.000Z',
                  '2001-07-05T00:00:00.000Z',
                  '2001-07-10T00:00:00.000Z',
                  '2001-07-15T00:00:00.000Z',
                  '2001-07-20T00:00:00.000Z',
                  '2001-07-25T00:00:00.000Z',
                  '2001-07-30T00:00:00.000Z',
                  '2001-08-04T00:00:00.000Z',
                  '2001-08-09T00:00:00.000Z',
                  '2001-08-14T00:00:00.000Z',
                  '2001-08-19T00:00:00.000Z',
                  '2001-08-24T00:00:00.000Z',
                  '2001-08-29T00:00:00.000Z',
                  '2001-09-03T00:00:00.000Z',
                  '2001-09-08T00:00:00.000Z',
                  '2001-09-13T00:00:00.000Z',
                  '2001-09-18T00:00:00.000Z',
                  '2001-09-23T00:00:00.000Z',
                  '2001-09-28T00:00:00.000Z',
                  '2001-10-03T00:00:00.000Z',
                  '2001-10-08T00:00:00.000Z',
                  '2001-10-13T00:00:00.000Z',
                  '2001-10-18T00:00:00.000Z',
                  '2001-10-23T00:00:00.000Z',
                  '2001-10-28T00:00:00.000Z',
                  '2001-11-02T00:00:00.000Z',
                  '2001-11-07T00:00:00.000Z',
                  '2001-11-12T00:00:00.000Z',
                  '2001-11-17T00:00:00.000Z',
                  '2001-11-22T00:00:00.000Z',
                  '2001-11-27T00:00:00.000Z',
                  '2001-12-02T00:00:00.000Z',
                  '2001-12-07T00:00:00.000Z',
                  '2001-12-12T00:00:00.000Z',
                  '2001-12-17T00:00:00.000Z',
                  '2001-12-22T00:00:00.000Z',
                  '2001-12-27T00:00:00.000Z',
                  '2002-01-01T00:00:00.000Z',
                  '2002-01-06T00:00:00.000Z',
                  '2002-01-11T00:00:00.000Z',
                  '2002-01-16T00:00:00.000Z',
                  '2002-01-21T00:00:00.000Z',
                  '2002-01-26T00:00:00.000Z',
                  '2002-01-31T00:00:00.000Z',
                  '2002-02-05T00:00:00.000Z',
                  '2002-02-10T00:00:00.000Z',
                  '2002-02-15T00:00:00.000Z',
                  '2002-02-20T00:00:00.000Z',
                  '2002-02-25T00:00:00.000Z',
                  '2002-03-02T00:00:00.000Z',
                  '2002-03-07T00:00:00.000Z',
                  '2002-03-12T00:00:00.000Z',
                  '2002-03-17T00:00:00.000Z',
                  '2002-03-22T00:00:00.000Z',
                  '2002-03-27T00:00:00.000Z',
                  '2002-04-01T00:00:00.000Z',
                  '2002-04-06T00:00:00.000Z',
                  '2002-04-11T00:00:00.000Z',
                  '2002-04-16T00:00:00.000Z',
                  '2002-04-21T00:00:00.000Z',
                  '2002-04-26T00:00:00.000Z',
                  '2002-05-01T00:00:00.000Z',
                  '2002-05-06T00:00:00.000Z',
                  '2002-05-11T00:00:00.000Z',
                  '2002-05-16T00:00:00.000Z',
                  '2002-05-21T00:00:00.000Z',
                  '2002-05-26T00:00:00.000Z',
                  '2002-05-31T00:00:00.000Z',
                  '2002-06-05T00:00:00.000Z',
                  '2002-06-10T00:00:00.000Z',
                  '2002-06-15T00:00:00.000Z',
                  '2002-06-20T00:00:00.000Z',
                  '2002-06-25T00:00:00.000Z',
                  '2002-06-30T00:00:00.000Z',
                  '2002-07-05T00:00:00.000Z',
                  '2002-07-10T00:00:00.000Z',
                  '2002-07-15T00:00:00.000Z',
                  '2002-07-20T00:00:00.000Z',
                  '2002-07-25T00:00:00.000Z',
                  '2002-07-30T00:00:00.000Z',
                  '2002-08-04T00:00:00.000Z',
                  '2002-08-09T00:00:00.000Z',
                  '2002-08-14T00:00:00.000Z',
                  '2002-08-19T00:00:00.000Z',
                  '2002-08-24T00:00:00.000Z',
                  '2002-08-29T00:00:00.000Z',
                  '2002-09-03T00:00:00.000Z',
                  '2002-09-08T00:00:00.000Z',
                  '2002-09-13T00:00:00.000Z',
                  '2002-09-18T00:00:00.000Z',
                  '2002-09-23T00:00:00.000Z',
                  '2002-09-28T00:00:00.000Z',
                  '2002-10-03T00:00:00.000Z',
                  '2002-10-08T00:00:00.000Z',
                  '2002-10-13T00:00:00.000Z',
                  '2002-10-18T00:00:00.000Z',
                  '2002-10-23T00:00:00.000Z',
                  '2002-10-28T00:00:00.000Z',
                  '2002-11-02T00:00:00.000Z',
                  '2002-11-07T00:00:00.000Z',
                  '2002-11-12T00:00:00.000Z',
                  '2002-11-17T00:00:00.000Z',
                  '2002-11-22T00:00:00.000Z',
                  '2002-11-27T00:00:00.000Z',
                  '2002-12-02T00:00:00.000Z',
                  '2002-12-07T00:00:00.000Z',
                  '2002-12-12T00:00:00.000Z',
                  '2002-12-17T00:00:00.000Z',
                  '2002-12-22T00:00:00.000Z',
                  '2002-12-27T00:00:00.000Z',
                  '2003-01-01T00:00:00.000Z',
                  '2003-01-06T00:00:00.000Z',
                  '2003-01-11T00:00:00.000Z',
                  '2003-01-16T00:00:00.000Z',
                  '2003-01-21T00:00:00.000Z',
                  '2003-01-26T00:00:00.000Z',
                  '2003-01-31T00:00:00.000Z',
                  '2003-02-05T00:00:00.000Z',
                  '2003-02-10T00:00:00.000Z',
                  '2003-02-15T00:00:00.000Z',
                  '2003-02-20T00:00:00.000Z',
                  '2003-02-25T00:00:00.000Z',
                  '2003-03-02T00:00:00.000Z',
                  '2003-03-07T00:00:00.000Z',
                  '2003-03-12T00:00:00.000Z',
                  '2003-03-17T00:00:00.000Z',
                  '2003-03-22T00:00:00.000Z',
                  '2003-03-27T00:00:00.000Z',
                  '2003-04-01T00:00:00.000Z',
                  '2003-04-06T00:00:00.000Z',
                  '2003-04-11T00:00:00.000Z',
                  '2003-04-16T00:00:00.000Z',
                  '2003-04-21T00:00:00.000Z',
                  '2003-04-26T00:00:00.000Z',
                  '2003-05-01T00:00:00.000Z',
                  '2003-05-06T00:00:00.000Z',
                  '2003-05-11T00:00:00.000Z',
                  '2003-05-16T00:00:00.000Z',
                  '2003-05-21T00:00:00.000Z',
                  '2003-05-26T00:00:00.000Z',
                  '2003-05-31T00:00:00.000Z',
                  '2003-06-05T00:00:00.000Z',
                  '2003-06-10T00:00:00.000Z',
                  '2003-06-15T00:00:00.000Z',
                  '2003-06-20T00:00:00.000Z',
                  '2003-06-25T00:00:00.000Z',
                  '2003-06-30T00:00:00.000Z',
                  '2003-07-05T00:00:00.000Z',
                  '2003-07-10T00:00:00.000Z',
                  '2003-07-15T00:00:00.000Z',
                  '2003-07-20T00:00:00.000Z',
                  '2003-07-25T00:00:00.000Z',
                  '2003-07-30T00:00:00.000Z',
                  '2003-08-04T00:00:00.000Z',
                  '2003-08-09T00:00:00.000Z',
                  '2003-08-14T00:00:00.000Z',
                  '2003-08-19T00:00:00.000Z',
                  '2003-08-24T00:00:00.000Z',
                  '2003-08-29T00:00:00.000Z',
                  '2003-09-03T00:00:00.000Z',
                  '2003-09-08T00:00:00.000Z',
                  '2003-09-13T00:00:00.000Z',
                  '2003-09-18T00:00:00.000Z',
                  '2003-09-23T00:00:00.000Z',
                  '2003-09-28T00:00:00.000Z',
                  '2003-10-03T00:00:00.000Z',
                  '2003-10-08T00:00:00.000Z',
                  '2003-10-13T00:00:00.000Z',
                  '2003-10-18T00:00:00.000Z',
                  '2003-10-23T00:00:00.000Z',
                  '2003-10-28T00:00:00.000Z',
                  '2003-11-02T00:00:00.000Z',
                  '2003-11-07T00:00:00.000Z',
                  '2003-11-12T00:00:00.000Z',
                  '2003-11-17T00:00:00.000Z',
                  '2003-11-22T00:00:00.000Z',
                  '2003-11-27T00:00:00.000Z',
                  '2003-12-02T00:00:00.000Z',
                  '2003-12-07T00:00:00.000Z',
                  '2003-12-12T00:00:00.000Z',
                  '2003-12-17T00:00:00.000Z',
                  '2003-12-22T00:00:00.000Z',
                  '2003-12-27T00:00:00.000Z',
                  '2004-01-01T00:00:00.000Z',
                  '2004-01-06T00:00:00.000Z',
                  '2004-01-11T00:00:00.000Z',
                  '2004-01-16T00:00:00.000Z',
                  '2004-01-21T00:00:00.000Z',
                  '2004-01-26T00:00:00.000Z',
                  '2004-01-31T00:00:00.000Z',
                  '2004-02-05T00:00:00.000Z',
                  '2004-02-10T00:00:00.000Z',
                  '2004-02-15T00:00:00.000Z',
                  '2004-02-20T00:00:00.000Z',
                  '2004-02-25T00:00:00.000Z',
                  '2004-03-01T00:00:00.000Z',
                  '2004-03-06T00:00:00.000Z',
                  '2004-03-11T00:00:00.000Z',
                  '2004-03-16T00:00:00.000Z',
                  '2004-03-21T00:00:00.000Z',
                  '2004-03-26T00:00:00.000Z',
                  '2004-03-31T00:00:00.000Z',
                  '2004-04-05T00:00:00.000Z',
                  '2004-04-10T00:00:00.000Z',
                  '2004-04-15T00:00:00.000Z',
                  '2004-04-20T00:00:00.000Z',
                  '2004-04-25T00:00:00.000Z',
                  '2004-04-30T00:00:00.000Z',
                  '2004-05-05T00:00:00.000Z',
                  '2004-05-10T00:00:00.000Z',
                  '2004-05-15T00:00:00.000Z',
                  '2004-05-20T00:00:00.000Z',
                  '2004-05-25T00:00:00.000Z',
                  '2004-05-30T00:00:00.000Z',
                  '2004-06-04T00:00:00.000Z',
                  '2004-06-09T00:00:00.000Z',
                  '2004-06-14T00:00:00.000Z',
                  '2004-06-19T00:00:00.000Z',
                  '2004-06-24T00:00:00.000Z',
                  '2004-06-29T00:00:00.000Z',
                  '2004-07-04T00:00:00.000Z',
                  '2004-07-09T00:00:00.000Z',
                  '2004-07-14T00:00:00.000Z',
                  '2004-07-19T00:00:00.000Z',
                  '2004-07-24T00:00:00.000Z',
                  '2004-07-29T00:00:00.000Z',
                  '2004-08-03T00:00:00.000Z',
                  '2004-08-08T00:00:00.000Z',
                  '2004-08-13T00:00:00.000Z',
                  '2004-08-18T00:00:00.000Z',
                  '2004-08-23T00:00:00.000Z',
                  '2004-08-28T00:00:00.000Z',
                  '2004-09-02T00:00:00.000Z',
                  '2004-09-07T00:00:00.000Z',
                  '2004-09-12T00:00:00.000Z',
                  '2004-09-17T00:00:00.000Z',
                  '2004-09-22T00:00:00.000Z',
                  '2004-09-27T00:00:00.000Z',
                  '2004-10-02T00:00:00.000Z',
                  '2004-10-07T00:00:00.000Z',
                  '2004-10-12T00:00:00.000Z',
                  '2004-10-17T00:00:00.000Z',
                  '2004-10-22T00:00:00.000Z',
                  '2004-10-27T00:00:00.000Z',
                  '2004-11-01T00:00:00.000Z',
                  '2004-11-06T00:00:00.000Z',
                  '2004-11-11T00:00:00.000Z',
                  '2004-11-16T00:00:00.000Z',
                  '2004-11-21T00:00:00.000Z',
                  '2004-11-26T00:00:00.000Z',
                  '2004-12-01T00:00:00.000Z',
                  '2004-12-06T00:00:00.000Z',
                  '2004-12-11T00:00:00.000Z',
                  '2004-12-16T00:00:00.000Z',
                  '2004-12-21T00:00:00.000Z',
                  '2004-12-26T00:00:00.000Z',
                  '2004-12-31T00:00:00.000Z',
                  '2005-01-01T00:00:00.000Z',
                  '2005-01-06T00:00:00.000Z',
                  '2005-01-11T00:00:00.000Z',
                  '2005-01-16T00:00:00.000Z',
                  '2005-01-21T00:00:00.000Z',
                  '2005-01-26T00:00:00.000Z',
                  '2005-01-31T00:00:00.000Z',
                  '2005-02-05T00:00:00.000Z',
                  '2005-02-10T00:00:00.000Z',
                  '2005-02-15T00:00:00.000Z',
                  '2005-02-20T00:00:00.000Z',
                  '2005-02-25T00:00:00.000Z',
                  '2005-03-02T00:00:00.000Z',
                  '2005-03-07T00:00:00.000Z',
                  '2005-03-12T00:00:00.000Z',
                  '2005-03-17T00:00:00.000Z',
                  '2005-03-22T00:00:00.000Z',
                  '2005-03-27T00:00:00.000Z',
                  '2005-04-01T00:00:00.000Z',
                  '2005-04-06T00:00:00.000Z',
                  '2005-04-11T00:00:00.000Z',
                  '2005-04-16T00:00:00.000Z',
                  '2005-04-21T00:00:00.000Z',
                  '2005-04-26T00:00:00.000Z',
                  '2005-05-01T00:00:00.000Z',
                  '2005-05-06T00:00:00.000Z',
                  '2005-05-11T00:00:00.000Z',
                  '2005-05-16T00:00:00.000Z',
                  '2005-05-21T00:00:00.000Z',
                  '2005-05-26T00:00:00.000Z',
                  '2005-05-31T00:00:00.000Z',
                  '2005-06-05T00:00:00.000Z',
                  '2005-06-10T00:00:00.000Z',
                  '2005-06-15T00:00:00.000Z',
                  '2005-06-20T00:00:00.000Z',
                  '2005-06-25T00:00:00.000Z',
                  '2005-06-30T00:00:00.000Z',
                  '2005-07-05T00:00:00.000Z',
                  '2005-07-10T00:00:00.000Z',
                  '2005-07-15T00:00:00.000Z',
                  '2005-07-20T00:00:00.000Z',
                  '2005-07-25T00:00:00.000Z',
                  '2005-07-30T00:00:00.000Z',
                  '2005-08-04T00:00:00.000Z',
                  '2005-08-09T00:00:00.000Z',
                  '2005-08-14T00:00:00.000Z',
                  '2005-08-19T00:00:00.000Z',
                  '2005-08-24T00:00:00.000Z',
                  '2005-08-29T00:00:00.000Z',
                  '2005-09-03T00:00:00.000Z',
                  '2005-09-08T00:00:00.000Z',
                  '2005-09-13T00:00:00.000Z',
                  '2005-09-18T00:00:00.000Z',
                  '2005-09-23T00:00:00.000Z',
                  '2005-09-28T00:00:00.000Z',
                  '2005-10-03T00:00:00.000Z',
                  '2005-10-08T00:00:00.000Z',
                  '2005-10-13T00:00:00.000Z',
                  '2005-10-18T00:00:00.000Z',
                  '2005-10-23T00:00:00.000Z',
                  '2005-10-28T00:00:00.000Z',
                  '2005-11-02T00:00:00.000Z',
                  '2005-11-07T00:00:00.000Z',
                  '2005-11-12T00:00:00.000Z',
                  '2005-11-17T00:00:00.000Z',
                  '2005-11-22T00:00:00.000Z',
                  '2005-11-27T00:00:00.000Z',
                  '2005-12-02T00:00:00.000Z',
                  '2005-12-07T00:00:00.000Z',
                  '2005-12-12T00:00:00.000Z',
                  '2005-12-17T00:00:00.000Z',
                  '2005-12-22T00:00:00.000Z',
                  '2005-12-27T00:00:00.000Z',
                  '2006-01-01T00:00:00.000Z',
                  '2006-01-06T00:00:00.000Z',
                  '2006-01-11T00:00:00.000Z',
                  '2006-01-16T00:00:00.000Z',
                  '2006-01-21T00:00:00.000Z',
                  '2006-01-26T00:00:00.000Z',
                  '2006-01-31T00:00:00.000Z',
                  '2006-02-05T00:00:00.000Z',
                  '2006-02-10T00:00:00.000Z',
                  '2006-02-15T00:00:00.000Z',
                  '2006-02-20T00:00:00.000Z',
                  '2006-02-25T00:00:00.000Z',
                  '2006-03-02T00:00:00.000Z',
                  '2006-03-07T00:00:00.000Z',
                  '2006-03-12T00:00:00.000Z',
                  '2006-03-17T00:00:00.000Z',
                  '2006-03-22T00:00:00.000Z',
                  '2006-03-27T00:00:00.000Z',
                  '2006-04-01T00:00:00.000Z',
                  '2006-04-06T00:00:00.000Z',
                  '2006-04-11T00:00:00.000Z',
                  '2006-04-16T00:00:00.000Z',
                  '2006-04-21T00:00:00.000Z',
                  '2006-04-26T00:00:00.000Z',
                  '2006-05-01T00:00:00.000Z',
                  '2006-05-06T00:00:00.000Z',
                  '2006-05-11T00:00:00.000Z',
                  '2006-05-16T00:00:00.000Z',
                  '2006-05-21T00:00:00.000Z',
                  '2006-05-26T00:00:00.000Z',
                  '2006-05-31T00:00:00.000Z',
                  '2006-06-05T00:00:00.000Z',
                  '2006-06-10T00:00:00.000Z',
                  '2006-06-15T00:00:00.000Z',
                  '2006-06-20T00:00:00.000Z',
                  '2006-06-25T00:00:00.000Z',
                  '2006-06-30T00:00:00.000Z',
                  '2006-07-05T00:00:00.000Z',
                  '2006-07-10T00:00:00.000Z',
                  '2006-07-15T00:00:00.000Z',
                  '2006-07-20T00:00:00.000Z',
                  '2006-07-25T00:00:00.000Z',
                  '2006-07-30T00:00:00.000Z',
                  '2006-08-04T00:00:00.000Z',
                  '2006-08-09T00:00:00.000Z',
                  '2006-08-14T00:00:00.000Z',
                  '2006-08-19T00:00:00.000Z',
                  '2006-08-24T00:00:00.000Z',
                  '2006-08-29T00:00:00.000Z',
                  '2006-09-03T00:00:00.000Z',
                  '2006-09-08T00:00:00.000Z',
                  '2006-09-13T00:00:00.000Z',
                  '2006-09-18T00:00:00.000Z',
                  '2006-09-23T00:00:00.000Z',
                  '2006-09-28T00:00:00.000Z',
                  '2006-10-03T00:00:00.000Z',
                  '2006-10-08T00:00:00.000Z',
                  '2006-10-13T00:00:00.000Z',
                  '2006-10-18T00:00:00.000Z',
                  '2006-10-23T00:00:00.000Z',
                  '2006-10-28T00:00:00.000Z',
                  '2006-11-02T00:00:00.000Z',
                  '2006-11-07T00:00:00.000Z',
                  '2006-11-12T00:00:00.000Z',
                  '2006-11-17T00:00:00.000Z',
                  '2006-11-22T00:00:00.000Z',
                  '2006-11-27T00:00:00.000Z',
                  '2006-12-02T00:00:00.000Z',
                  '2006-12-07T00:00:00.000Z',
                  '2006-12-12T00:00:00.000Z',
                  '2006-12-17T00:00:00.000Z',
                  '2006-12-22T00:00:00.000Z',
                  '2006-12-27T00:00:00.000Z',
                  '2007-01-01T00:00:00.000Z',
                  '2007-01-06T00:00:00.000Z',
                  '2007-01-11T00:00:00.000Z',
                  '2007-01-16T00:00:00.000Z',
                  '2007-01-21T00:00:00.000Z',
                  '2007-01-26T00:00:00.000Z',
                  '2007-01-31T00:00:00.000Z',
                  '2007-02-05T00:00:00.000Z',
                  '2007-02-10T00:00:00.000Z',
                  '2007-02-15T00:00:00.000Z',
                  '2007-02-20T00:00:00.000Z',
                  '2007-02-25T00:00:00.000Z',
                  '2007-03-02T00:00:00.000Z',
                  '2007-03-07T00:00:00.000Z',
                  '2007-03-12T00:00:00.000Z',
                  '2007-03-17T00:00:00.000Z',
                  '2007-03-22T00:00:00.000Z',
                  '2007-03-27T00:00:00.000Z',
                  '2007-04-01T00:00:00.000Z',
                  '2007-04-06T00:00:00.000Z',
                  '2007-04-11T00:00:00.000Z',
                  '2007-04-16T00:00:00.000Z',
                  '2007-04-21T00:00:00.000Z',
                  '2007-04-26T00:00:00.000Z',
                  '2007-05-01T00:00:00.000Z',
                  '2007-05-06T00:00:00.000Z',
                  '2007-05-11T00:00:00.000Z',
                  '2007-05-16T00:00:00.000Z',
                  '2007-05-21T00:00:00.000Z',
                  '2007-05-26T00:00:00.000Z',
                  '2007-05-31T00:00:00.000Z',
                  '2007-06-05T00:00:00.000Z',
                  '2007-06-10T00:00:00.000Z',
                  '2007-06-15T00:00:00.000Z',
                  '2007-06-20T00:00:00.000Z',
                  '2007-06-25T00:00:00.000Z',
                  '2007-06-30T00:00:00.000Z',
                  '2007-07-05T00:00:00.000Z',
                  '2007-07-10T00:00:00.000Z',
                  '2007-07-15T00:00:00.000Z',
                  '2007-07-20T00:00:00.000Z',
                  '2007-07-25T00:00:00.000Z',
                  '2007-07-30T00:00:00.000Z',
                  '2007-08-04T00:00:00.000Z',
                  '2007-08-09T00:00:00.000Z',
                  '2007-08-14T00:00:00.000Z',
                  '2007-08-19T00:00:00.000Z',
                  '2007-08-24T00:00:00.000Z',
                  '2007-08-29T00:00:00.000Z',
                  '2007-09-03T00:00:00.000Z',
                  '2007-09-08T00:00:00.000Z',
                  '2007-09-13T00:00:00.000Z',
                  '2007-09-18T00:00:00.000Z',
                  '2007-09-23T00:00:00.000Z',
                  '2007-09-28T00:00:00.000Z',
                  '2007-10-03T00:00:00.000Z',
                  '2007-10-08T00:00:00.000Z',
                  '2007-10-13T00:00:00.000Z',
                  '2007-10-18T00:00:00.000Z',
                  '2007-10-23T00:00:00.000Z',
                  '2007-10-28T00:00:00.000Z',
                  '2007-11-02T00:00:00.000Z',
                  '2007-11-07T00:00:00.000Z',
                  '2007-11-12T00:00:00.000Z',
                  '2007-11-17T00:00:00.000Z',
                  '2007-11-22T00:00:00.000Z',
                  '2007-11-27T00:00:00.000Z',
                  '2007-12-02T00:00:00.000Z',
                  '2007-12-07T00:00:00.000Z',
                  '2007-12-12T00:00:00.000Z',
                  '2007-12-17T00:00:00.000Z',
                  '2007-12-22T00:00:00.000Z',
                  '2007-12-27T00:00:00.000Z',
                  '2008-01-01T00:00:00.000Z',
                  '2008-01-06T00:00:00.000Z',
                  '2008-01-11T00:00:00.000Z',
                  '2008-01-16T00:00:00.000Z',
                  '2008-01-21T00:00:00.000Z',
                  '2008-01-26T00:00:00.000Z',
                  '2008-01-31T00:00:00.000Z',
                  '2008-02-05T00:00:00.000Z',
                  '2008-02-10T00:00:00.000Z',
                  '2008-02-15T00:00:00.000Z',
                  '2008-02-20T00:00:00.000Z',
                  '2008-02-25T00:00:00.000Z',
                  '2008-03-01T00:00:00.000Z',
                  '2008-03-06T00:00:00.000Z',
                  '2008-03-11T00:00:00.000Z',
                  '2008-03-16T00:00:00.000Z',
                  '2008-03-21T00:00:00.000Z',
                  '2008-03-26T00:00:00.000Z',
                  '2008-03-31T00:00:00.000Z',
                  '2008-04-05T00:00:00.000Z',
                  '2008-04-10T00:00:00.000Z',
                  '2008-04-15T00:00:00.000Z',
                  '2008-04-20T00:00:00.000Z',
                  '2008-04-25T00:00:00.000Z',
                  '2008-04-30T00:00:00.000Z',
                  '2008-05-05T00:00:00.000Z',
                  '2008-05-10T00:00:00.000Z',
                  '2008-05-15T00:00:00.000Z',
                  '2008-05-20T00:00:00.000Z',
                  '2008-05-25T00:00:00.000Z',
                  '2008-05-30T00:00:00.000Z',
                  '2008-06-04T00:00:00.000Z',
                  '2008-06-09T00:00:00.000Z',
                  '2008-06-14T00:00:00.000Z',
                  '2008-06-19T00:00:00.000Z',
                  '2008-06-24T00:00:00.000Z',
                  '2008-06-29T00:00:00.000Z',
                  '2008-07-04T00:00:00.000Z',
                  '2008-07-09T00:00:00.000Z',
                  '2008-07-14T00:00:00.000Z',
                  '2008-07-19T00:00:00.000Z',
                  '2008-07-24T00:00:00.000Z',
                  '2008-07-29T00:00:00.000Z',
                  '2008-08-03T00:00:00.000Z',
                  '2008-08-08T00:00:00.000Z',
                  '2008-08-13T00:00:00.000Z',
                  '2008-08-18T00:00:00.000Z',
                  '2008-08-23T00:00:00.000Z',
                  '2008-08-28T00:00:00.000Z',
                  '2008-09-02T00:00:00.000Z',
                  '2008-09-07T00:00:00.000Z',
                  '2008-09-12T00:00:00.000Z',
                  '2008-09-17T00:00:00.000Z',
                  '2008-09-22T00:00:00.000Z',
                  '2008-09-27T00:00:00.000Z',
                  '2008-10-02T00:00:00.000Z',
                  '2008-10-07T00:00:00.000Z',
                  '2008-10-12T00:00:00.000Z',
                  '2008-10-17T00:00:00.000Z',
                  '2008-10-22T00:00:00.000Z',
                  '2008-10-27T00:00:00.000Z',
                  '2008-11-01T00:00:00.000Z',
                  '2008-11-06T00:00:00.000Z',
                  '2008-11-11T00:00:00.000Z',
                  '2008-11-16T00:00:00.000Z',
                  '2008-11-21T00:00:00.000Z',
                  '2008-11-26T00:00:00.000Z',
                  '2008-12-01T00:00:00.000Z',
                  '2008-12-06T00:00:00.000Z',
                  '2008-12-11T00:00:00.000Z',
                  '2008-12-16T00:00:00.000Z',
                  '2008-12-21T00:00:00.000Z',
                  '2008-12-26T00:00:00.000Z',
                  '2008-12-31T00:00:00.000Z',
                  '2009-01-01T00:00:00.000Z',
                  '2009-01-06T00:00:00.000Z',
                  '2009-01-11T00:00:00.000Z',
                  '2009-01-16T00:00:00.000Z',
                  '2009-01-21T00:00:00.000Z',
                  '2009-01-26T00:00:00.000Z',
                  '2009-01-31T00:00:00.000Z',
                  '2009-02-05T00:00:00.000Z',
                  '2009-02-10T00:00:00.000Z',
                  '2009-02-15T00:00:00.000Z',
                  '2009-02-20T00:00:00.000Z',
                  '2009-02-25T00:00:00.000Z',
                  '2009-03-02T00:00:00.000Z',
                  '2009-03-07T00:00:00.000Z',
                  '2009-03-12T00:00:00.000Z',
                  '2009-03-17T00:00:00.000Z',
                  '2009-03-22T00:00:00.000Z',
                  '2009-03-27T00:00:00.000Z',
                  '2009-04-01T00:00:00.000Z',
                  '2009-04-06T00:00:00.000Z',
                  '2009-04-11T00:00:00.000Z',
                  '2009-04-16T00:00:00.000Z',
                  '2009-04-21T00:00:00.000Z',
                  '2009-04-26T00:00:00.000Z',
                  '2009-05-01T00:00:00.000Z',
                  '2009-05-06T00:00:00.000Z',
                  '2009-05-11T00:00:00.000Z',
                  '2009-05-16T00:00:00.000Z',
                  '2009-05-21T00:00:00.000Z',
                  '2009-05-26T00:00:00.000Z',
                  '2009-05-31T00:00:00.000Z',
                  '2009-06-05T00:00:00.000Z',
                  '2009-06-10T00:00:00.000Z',
                  '2009-06-15T00:00:00.000Z',
                  '2009-06-20T00:00:00.000Z',
                  '2009-06-25T00:00:00.000Z',
                  '2009-06-30T00:00:00.000Z',
                  '2009-07-05T00:00:00.000Z',
                  '2009-07-10T00:00:00.000Z',
                  '2009-07-15T00:00:00.000Z',
                  '2009-07-20T00:00:00.000Z',
                  '2009-07-25T00:00:00.000Z',
                  '2009-07-30T00:00:00.000Z',
                  '2009-08-04T00:00:00.000Z',
                  '2009-08-09T00:00:00.000Z',
                  '2009-08-14T00:00:00.000Z',
                  '2009-08-19T00:00:00.000Z',
                  '2009-08-24T00:00:00.000Z',
                  '2009-08-29T00:00:00.000Z',
                  '2009-09-03T00:00:00.000Z',
                  '2009-09-08T00:00:00.000Z',
                  '2009-09-13T00:00:00.000Z',
                  '2009-09-18T00:00:00.000Z',
                  '2009-09-23T00:00:00.000Z',
                  '2009-09-28T00:00:00.000Z',
                  '2009-10-03T00:00:00.000Z',
                  '2009-10-08T00:00:00.000Z',
                  '2009-10-13T00:00:00.000Z',
                  '2009-10-18T00:00:00.000Z',
                  '2009-10-23T00:00:00.000Z',
                  '2009-10-28T00:00:00.000Z',
                  '2009-11-02T00:00:00.000Z',
                  '2009-11-07T00:00:00.000Z',
                  '2009-11-12T00:00:00.000Z',
                  '2009-11-17T00:00:00.000Z',
                  '2009-11-22T00:00:00.000Z',
                  '2009-11-27T00:00:00.000Z',
                  '2009-12-02T00:00:00.000Z',
                  '2009-12-07T00:00:00.000Z',
                  '2009-12-12T00:00:00.000Z',
                  '2009-12-17T00:00:00.000Z',
                  '2009-12-22T00:00:00.000Z',
                  '2009-12-27T00:00:00.000Z',
                  '2010-01-01T00:00:00.000Z',
                  '2010-01-06T00:00:00.000Z',
                  '2010-01-11T00:00:00.000Z',
                  '2010-01-16T00:00:00.000Z',
                  '2010-01-21T00:00:00.000Z',
                  '2010-01-26T00:00:00.000Z',
                  '2010-01-31T00:00:00.000Z',
                  '2010-02-05T00:00:00.000Z',
                  '2010-02-10T00:00:00.000Z',
                  '2010-02-15T00:00:00.000Z',
                  '2010-02-20T00:00:00.000Z',
                  '2010-02-25T00:00:00.000Z',
                  '2010-03-02T00:00:00.000Z',
                  '2010-03-07T00:00:00.000Z',
                  '2010-03-12T00:00:00.000Z',
                  '2010-03-17T00:00:00.000Z',
                  '2010-03-22T00:00:00.000Z',
                  '2010-03-27T00:00:00.000Z',
                  '2010-04-01T00:00:00.000Z',
                  '2010-04-06T00:00:00.000Z',
                  '2010-04-11T00:00:00.000Z',
                  '2010-04-16T00:00:00.000Z',
                  '2010-04-21T00:00:00.000Z',
                  '2010-04-26T00:00:00.000Z',
                  '2010-05-01T00:00:00.000Z',
                  '2010-05-06T00:00:00.000Z',
                  '2010-05-11T00:00:00.000Z',
                  '2010-05-16T00:00:00.000Z',
                  '2010-05-21T00:00:00.000Z',
                  '2010-05-26T00:00:00.000Z',
                  '2010-05-31T00:00:00.000Z',
                  '2010-06-05T00:00:00.000Z',
                  '2010-06-10T00:00:00.000Z',
                  '2010-06-15T00:00:00.000Z',
                  '2010-06-20T00:00:00.000Z',
                  '2010-06-25T00:00:00.000Z',
                  '2010-06-30T00:00:00.000Z',
                  '2010-07-05T00:00:00.000Z',
                  '2010-07-10T00:00:00.000Z',
                  '2010-07-15T00:00:00.000Z',
                  '2010-07-20T00:00:00.000Z',
                  '2010-07-25T00:00:00.000Z',
                  '2010-07-30T00:00:00.000Z',
                  '2010-08-04T00:00:00.000Z',
                  '2010-08-09T00:00:00.000Z',
                  '2010-08-14T00:00:00.000Z',
                  '2010-08-19T00:00:00.000Z',
                  '2010-08-24T00:00:00.000Z',
                  '2010-08-29T00:00:00.000Z',
                  '2010-09-03T00:00:00.000Z',
                  '2010-09-08T00:00:00.000Z',
                  '2010-09-13T00:00:00.000Z',
                  '2010-09-18T00:00:00.000Z',
                  '2010-09-23T00:00:00.000Z',
                  '2010-09-28T00:00:00.000Z',
                  '2010-10-03T00:00:00.000Z',
                  '2010-10-08T00:00:00.000Z',
                  '2010-10-13T00:00:00.000Z',
                  '2010-10-18T00:00:00.000Z',
                  '2010-10-23T00:00:00.000Z',
                  '2010-10-28T00:00:00.000Z',
                  '2010-11-02T00:00:00.000Z',
                  '2010-11-07T00:00:00.000Z',
                  '2010-11-12T00:00:00.000Z',
                  '2010-11-17T00:00:00.000Z',
                  '2010-11-22T00:00:00.000Z',
                  '2010-11-27T00:00:00.000Z',
                  '2010-12-02T00:00:00.000Z',
                  '2010-12-07T00:00:00.000Z',
                  '2010-12-12T00:00:00.000Z',
                  '2010-12-17T00:00:00.000Z',
                  '2010-12-22T00:00:00.000Z',
                  '2010-12-27T00:00:00.000Z',
                  '2011-01-01T00:00:00.000Z',
                  '2011-01-06T00:00:00.000Z',
                  '2011-01-11T00:00:00.000Z',
                  '2011-01-16T00:00:00.000Z',
                  '2011-01-21T00:00:00.000Z',
                  '2011-01-26T00:00:00.000Z',
                  '2011-01-31T00:00:00.000Z',
                  '2011-02-05T00:00:00.000Z',
                  '2011-02-10T00:00:00.000Z',
                  '2011-02-15T00:00:00.000Z',
                  '2011-02-20T00:00:00.000Z',
                  '2011-02-25T00:00:00.000Z',
                  '2011-03-02T00:00:00.000Z',
                  '2011-03-07T00:00:00.000Z',
                  '2011-03-12T00:00:00.000Z',
                  '2011-03-17T00:00:00.000Z',
                  '2011-03-22T00:00:00.000Z',
                  '2011-03-27T00:00:00.000Z',
                  '2011-04-01T00:00:00.000Z',
                  '2011-04-06T00:00:00.000Z',
                  '2011-04-11T00:00:00.000Z',
                  '2011-04-16T00:00:00.000Z',
                  '2011-04-21T00:00:00.000Z',
                  '2011-04-26T00:00:00.000Z',
                  '2011-05-01T00:00:00.000Z',
                  '2011-05-06T00:00:00.000Z',
                  '2011-05-11T00:00:00.000Z',
                  '2011-05-16T00:00:00.000Z',
                  '2011-05-21T00:00:00.000Z',
                  '2011-05-26T00:00:00.000Z',
                  '2011-05-31T00:00:00.000Z',
                  '2011-06-05T00:00:00.000Z',
                  '2011-06-10T00:00:00.000Z',
                  '2011-06-15T00:00:00.000Z',
                  '2011-06-20T00:00:00.000Z',
                  '2011-06-25T00:00:00.000Z',
                  '2011-06-30T00:00:00.000Z',
                  '2011-07-05T00:00:00.000Z',
                  '2011-07-10T00:00:00.000Z',
                  '2011-07-15T00:00:00.000Z',
                  '2011-07-20T00:00:00.000Z',
                  '2011-07-25T00:00:00.000Z',
                  '2011-07-30T00:00:00.000Z',
                  '2011-08-04T00:00:00.000Z',
                  '2011-08-09T00:00:00.000Z',
                  '2011-08-14T00:00:00.000Z',
                  '2011-08-19T00:00:00.000Z',
                  '2011-08-24T00:00:00.000Z',
                  '2011-08-29T00:00:00.000Z',
                  '2011-09-03T00:00:00.000Z',
                  '2011-09-08T00:00:00.000Z',
                  '2011-09-13T00:00:00.000Z',
                  '2011-09-18T00:00:00.000Z',
                  '2011-09-23T00:00:00.000Z',
                  '2011-09-28T00:00:00.000Z',
                  '2011-10-03T00:00:00.000Z',
                  '2011-10-08T00:00:00.000Z',
                  '2011-10-13T00:00:00.000Z',
                  '2011-10-18T00:00:00.000Z',
                  '2011-10-23T00:00:00.000Z',
                  '2011-10-28T00:00:00.000Z',
                  '2011-11-02T00:00:00.000Z',
                  '2011-11-07T00:00:00.000Z',
                  '2011-11-12T00:00:00.000Z',
                  '2011-11-17T00:00:00.000Z',
                  '2011-11-22T00:00:00.000Z',
                  '2011-11-27T00:00:00.000Z',
                  '2011-12-02T00:00:00.000Z',
                  '2011-12-07T00:00:00.000Z',
                  '2011-12-12T00:00:00.000Z',
                  '2011-12-17T00:00:00.000Z',
                  '2011-12-22T00:00:00.000Z',
                  '2011-12-27T00:00:00.000Z',
                  '2012-01-01T00:00:00.000Z',
                  '2012-01-06T00:00:00.000Z',
                  '2012-01-11T00:00:00.000Z',
                  '2012-01-16T00:00:00.000Z',
                  '2012-01-21T00:00:00.000Z',
                  '2012-01-26T00:00:00.000Z',
                  '2012-01-31T00:00:00.000Z',
                  '2012-02-05T00:00:00.000Z',
                  '2012-02-10T00:00:00.000Z',
                  '2012-02-15T00:00:00.000Z',
                  '2012-02-20T00:00:00.000Z',
                  '2012-02-25T00:00:00.000Z',
                  '2012-03-01T00:00:00.000Z',
                  '2012-03-06T00:00:00.000Z',
                  '2012-03-11T00:00:00.000Z',
                  '2012-03-16T00:00:00.000Z',
                  '2012-03-21T00:00:00.000Z',
                  '2012-03-26T00:00:00.000Z',
                  '2012-03-31T00:00:00.000Z',
                  '2012-04-05T00:00:00.000Z',
                  '2012-04-10T00:00:00.000Z',
                  '2012-04-15T00:00:00.000Z',
                  '2012-04-20T00:00:00.000Z',
                  '2012-04-25T00:00:00.000Z',
                  '2012-04-30T00:00:00.000Z',
                  '2012-05-05T00:00:00.000Z',
                  '2012-05-10T00:00:00.000Z',
                  '2012-05-15T00:00:00.000Z',
                  '2012-05-20T00:00:00.000Z',
                  '2012-05-25T00:00:00.000Z',
                  '2012-05-30T00:00:00.000Z',
                  '2012-06-04T00:00:00.000Z',
                  '2012-06-09T00:00:00.000Z',
                  '2012-06-14T00:00:00.000Z',
                  '2012-06-19T00:00:00.000Z',
                  '2012-06-24T00:00:00.000Z',
                  '2012-06-29T00:00:00.000Z',
                  '2012-07-04T00:00:00.000Z',
                  '2012-07-09T00:00:00.000Z',
                  '2012-07-14T00:00:00.000Z',
                  '2012-07-19T00:00:00.000Z',
                  '2012-07-24T00:00:00.000Z',
                  '2012-07-29T00:00:00.000Z',
                  '2012-08-03T00:00:00.000Z',
                  '2012-08-08T00:00:00.000Z',
                  '2012-08-13T00:00:00.000Z',
                  '2012-08-18T00:00:00.000Z',
                  '2012-08-23T00:00:00.000Z',
                  '2012-08-28T00:00:00.000Z',
                  '2012-09-02T00:00:00.000Z',
                  '2012-09-07T00:00:00.000Z',
                  '2012-09-12T00:00:00.000Z',
                  '2012-09-17T00:00:00.000Z',
                  '2012-09-22T00:00:00.000Z',
                  '2012-09-27T00:00:00.000Z',
                  '2012-10-02T00:00:00.000Z',
                  '2012-10-07T00:00:00.000Z',
                  '2012-10-12T00:00:00.000Z',
                  '2012-10-17T00:00:00.000Z',
                  '2012-10-22T00:00:00.000Z',
                  '2012-10-27T00:00:00.000Z',
                  '2012-11-01T00:00:00.000Z',
                  '2012-11-06T00:00:00.000Z',
                  '2012-11-11T00:00:00.000Z',
                  '2012-11-16T00:00:00.000Z',
                  '2012-11-21T00:00:00.000Z',
                  '2012-11-26T00:00:00.000Z',
                  '2012-12-01T00:00:00.000Z',
                  '2012-12-06T00:00:00.000Z',
                  '2012-12-11T00:00:00.000Z',
                  '2012-12-16T00:00:00.000Z',
                  '2012-12-21T00:00:00.000Z',
                  '2012-12-26T00:00:00.000Z',
                  '2012-12-31T00:00:00.000Z',
                  '2013-01-01T00:00:00.000Z',
                  '2013-01-06T00:00:00.000Z',
                  '2013-01-11T00:00:00.000Z',
                  '2013-01-16T00:00:00.000Z',
                  '2013-01-21T00:00:00.000Z',
                  '2013-01-26T00:00:00.000Z',
                  '2013-01-31T00:00:00.000Z',
                  '2013-02-05T00:00:00.000Z',
                  '2013-02-10T00:00:00.000Z',
                  '2013-02-15T00:00:00.000Z',
                  '2013-02-20T00:00:00.000Z',
                  '2013-02-25T00:00:00.000Z',
                  '2013-03-02T00:00:00.000Z',
                  '2013-03-07T00:00:00.000Z',
                  '2013-03-12T00:00:00.000Z',
                  '2013-03-17T00:00:00.000Z',
                  '2013-03-22T00:00:00.000Z',
                  '2013-03-27T00:00:00.000Z',
                  '2013-04-01T00:00:00.000Z',
                  '2013-04-06T00:00:00.000Z',
                  '2013-04-11T00:00:00.000Z',
                  '2013-04-16T00:00:00.000Z',
                  '2013-04-21T00:00:00.000Z',
                  '2013-04-26T00:00:00.000Z',
                  '2013-05-01T00:00:00.000Z',
                  '2013-05-06T00:00:00.000Z',
                  '2013-05-11T00:00:00.000Z',
                  '2013-05-16T00:00:00.000Z',
                  '2013-05-21T00:00:00.000Z',
                  '2013-05-26T00:00:00.000Z',
                  '2013-05-31T00:00:00.000Z',
                  '2013-06-05T00:00:00.000Z',
                  '2013-06-10T00:00:00.000Z',
                  '2013-06-15T00:00:00.000Z',
                  '2013-06-20T00:00:00.000Z',
                  '2013-06-25T00:00:00.000Z',
                  '2013-06-30T00:00:00.000Z',
                  '2013-07-05T00:00:00.000Z',
                  '2013-07-10T00:00:00.000Z',
                  '2013-07-15T00:00:00.000Z',
                  '2013-07-20T00:00:00.000Z',
                  '2013-07-25T00:00:00.000Z',
                  '2013-07-30T00:00:00.000Z',
                  '2013-08-04T00:00:00.000Z',
                  '2013-08-09T00:00:00.000Z',
                  '2013-08-14T00:00:00.000Z',
                  '2013-08-19T00:00:00.000Z',
                  '2013-08-24T00:00:00.000Z',
                  '2013-08-29T00:00:00.000Z',
                  '2013-09-03T00:00:00.000Z',
                  '2013-09-08T00:00:00.000Z',
                  '2013-09-13T00:00:00.000Z',
                  '2013-09-18T00:00:00.000Z',
                  '2013-09-23T00:00:00.000Z',
                  '2013-09-28T00:00:00.000Z',
                  '2013-10-03T00:00:00.000Z',
                  '2013-10-08T00:00:00.000Z',
                  '2013-10-13T00:00:00.000Z',
                  '2013-10-18T00:00:00.000Z',
                  '2013-10-23T00:00:00.000Z',
                  '2013-10-28T00:00:00.000Z',
                  '2013-11-02T00:00:00.000Z',
                  '2013-11-07T00:00:00.000Z',
                  '2013-11-12T00:00:00.000Z',
                  '2013-11-17T00:00:00.000Z',
                  '2013-11-22T00:00:00.000Z',
                  '2013-11-27T00:00:00.000Z',
                  '2013-12-02T00:00:00.000Z',
                  '2013-12-07T00:00:00.000Z',
                  '2013-12-12T00:00:00.000Z',
                  '2013-12-17T00:00:00.000Z',
                  '2013-12-22T00:00:00.000Z',
                  '2013-12-27T00:00:00.000Z',
                  '2014-01-01T00:00:00.000Z',
                  '2014-01-06T00:00:00.000Z',
                  '2014-01-11T00:00:00.000Z',
                  '2014-01-16T00:00:00.000Z',
                  '2014-01-21T00:00:00.000Z',
                  '2014-01-26T00:00:00.000Z',
                  '2014-01-31T00:00:00.000Z',
                  '2014-02-05T00:00:00.000Z',
                  '2014-02-10T00:00:00.000Z',
                  '2014-02-15T00:00:00.000Z',
                  '2014-02-20T00:00:00.000Z',
                  '2014-02-25T00:00:00.000Z',
                  '2014-03-02T00:00:00.000Z',
                  '2014-03-07T00:00:00.000Z',
                  '2014-03-12T00:00:00.000Z',
                  '2014-03-17T00:00:00.000Z',
                  '2014-03-22T00:00:00.000Z',
                  '2014-03-27T00:00:00.000Z',
                  '2014-04-01T00:00:00.000Z',
                  '2014-04-06T00:00:00.000Z',
                  '2014-04-11T00:00:00.000Z',
                  '2014-04-16T00:00:00.000Z',
                  '2014-04-21T00:00:00.000Z',
                  '2014-04-26T00:00:00.000Z',
                  '2014-05-01T00:00:00.000Z',
                  '2014-05-06T00:00:00.000Z',
                  '2014-05-11T00:00:00.000Z',
                  '2014-05-16T00:00:00.000Z',
                  '2014-05-21T00:00:00.000Z',
                  '2014-05-26T00:00:00.000Z',
                  '2014-05-31T00:00:00.000Z',
                  '2014-06-05T00:00:00.000Z',
                  '2014-06-10T00:00:00.000Z',
                  '2014-06-15T00:00:00.000Z',
                  '2014-06-20T00:00:00.000Z',
                  '2014-06-25T00:00:00.000Z',
                  '2014-06-30T00:00:00.000Z',
                  '2014-07-05T00:00:00.000Z',
                  '2014-07-10T00:00:00.000Z',
                  '2014-07-15T00:00:00.000Z',
                  '2014-07-20T00:00:00.000Z',
                  '2014-07-25T00:00:00.000Z',
                  '2014-07-30T00:00:00.000Z',
                  '2014-08-04T00:00:00.000Z',
                  '2014-08-09T00:00:00.000Z',
                  '2014-08-14T00:00:00.000Z',
                  '2014-08-19T00:00:00.000Z',
                  '2014-08-24T00:00:00.000Z',
                  '2014-08-29T00:00:00.000Z',
                  '2014-09-03T00:00:00.000Z',
                  '2014-09-08T00:00:00.000Z',
                  '2014-09-13T00:00:00.000Z',
                  '2014-09-18T00:00:00.000Z',
                  '2014-09-23T00:00:00.000Z',
                  '2014-09-28T00:00:00.000Z',
                  '2014-10-03T00:00:00.000Z',
                  '2014-10-08T00:00:00.000Z',
                  '2014-10-13T00:00:00.000Z',
                  '2014-10-18T00:00:00.000Z',
                  '2014-10-23T00:00:00.000Z',
                  '2014-10-28T00:00:00.000Z',
                  '2014-11-02T00:00:00.000Z',
                  '2014-11-07T00:00:00.000Z',
                  '2014-11-12T00:00:00.000Z',
                  '2014-11-17T00:00:00.000Z',
                  '2014-11-22T00:00:00.000Z',
                  '2014-11-27T00:00:00.000Z',
                  '2014-12-02T00:00:00.000Z',
                  '2014-12-07T00:00:00.000Z',
                  '2014-12-12T00:00:00.000Z',
                  '2014-12-17T00:00:00.000Z',
                  '2014-12-22T00:00:00.000Z',
                  '2014-12-27T00:00:00.000Z',
                  '2015-01-01T00:00:00.000Z',
                  '2015-01-06T00:00:00.000Z',
                  '2015-01-11T00:00:00.000Z',
                  '2015-01-16T00:00:00.000Z',
                  '2015-01-21T00:00:00.000Z',
                  '2015-01-26T00:00:00.000Z',
                  '2015-01-31T00:00:00.000Z',
                  '2015-02-05T00:00:00.000Z',
                  '2015-02-10T00:00:00.000Z',
                  '2015-02-15T00:00:00.000Z',
                  '2015-02-20T00:00:00.000Z',
                  '2015-02-25T00:00:00.000Z',
                  '2015-03-02T00:00:00.000Z',
                  '2015-03-07T00:00:00.000Z',
                  '2015-03-12T00:00:00.000Z',
                  '2015-03-17T00:00:00.000Z',
                  '2015-03-22T00:00:00.000Z',
                  '2015-03-27T00:00:00.000Z',
                  '2015-04-01T00:00:00.000Z',
                  '2015-04-06T00:00:00.000Z',
                  '2015-04-11T00:00:00.000Z',
                  '2015-04-16T00:00:00.000Z',
                  '2015-04-21T00:00:00.000Z',
                  '2015-04-26T00:00:00.000Z',
                  '2015-05-01T00:00:00.000Z',
                  '2015-05-06T00:00:00.000Z',
                  '2015-05-11T00:00:00.000Z',
                  '2015-05-16T00:00:00.000Z',
                  '2015-05-21T00:00:00.000Z',
                  '2015-05-26T00:00:00.000Z',
                  '2015-05-31T00:00:00.000Z',
                  '2015-06-05T00:00:00.000Z',
                  '2015-06-10T00:00:00.000Z',
                  '2015-06-15T00:00:00.000Z',
                  '2015-06-20T00:00:00.000Z',
                  '2015-06-25T00:00:00.000Z',
                  '2015-06-30T00:00:00.000Z',
                  '2015-07-05T00:00:00.000Z',
                  '2015-07-10T00:00:00.000Z',
                  '2015-07-15T00:00:00.000Z',
                  '2015-07-20T00:00:00.000Z',
                  '2015-07-25T00:00:00.000Z',
                  '2015-07-30T00:00:00.000Z',
                  '2015-08-04T00:00:00.000Z',
                  '2015-08-09T00:00:00.000Z',
                  '2015-08-14T00:00:00.000Z',
                  '2015-08-19T00:00:00.000Z',
                  '2015-08-24T00:00:00.000Z',
                  '2015-08-29T00:00:00.000Z',
                  '2015-09-03T00:00:00.000Z',
                  '2015-09-08T00:00:00.000Z',
                  '2015-09-13T00:00:00.000Z',
                  '2015-09-18T00:00:00.000Z',
                  '2015-09-23T00:00:00.000Z',
                  '2015-09-28T00:00:00.000Z',
                  '2015-10-03T00:00:00.000Z',
                  '2015-10-08T00:00:00.000Z',
                  '2015-10-13T00:00:00.000Z',
                  '2015-10-18T00:00:00.000Z',
                  '2015-10-23T00:00:00.000Z',
                  '2015-10-28T00:00:00.000Z',
                  '2015-11-02T00:00:00.000Z',
                  '2015-11-07T00:00:00.000Z',
                  '2015-11-12T00:00:00.000Z',
                  '2015-11-17T00:00:00.000Z',
                  '2015-11-22T00:00:00.000Z',
                  '2015-11-27T00:00:00.000Z',
                  '2015-12-02T00:00:00.000Z',
                  '2015-12-07T00:00:00.000Z',
                  '2015-12-12T00:00:00.000Z',
                  '2015-12-17T00:00:00.000Z',
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
                'default': '2015-12-27T00:00:00.000Z',
                'multipleValues': true,
                'nearestValue': false,
                'current': true,
                'values': [
                  '1997-09-04T00:00:00.000Z',
                  '1997-09-09T00:00:00.000Z',
                  '1997-09-15T00:00:00.000Z',
                  '1997-09-18T00:00:00.000Z',
                  '1997-09-23T00:00:00.000Z',
                  '1997-09-28T00:00:00.000Z',
                  '1997-10-03T00:00:00.000Z',
                  '1997-10-08T00:00:00.000Z',
                  '1997-10-19T00:00:00.000Z',
                  '1997-10-23T00:00:00.000Z',
                  '1997-10-28T00:00:00.000Z',
                  '1997-11-02T00:00:00.000Z',
                  '1997-11-07T00:00:00.000Z',
                  '1997-11-12T00:00:00.000Z',
                  '1997-11-17T00:00:00.000Z',
                  '1997-11-22T00:00:00.000Z',
                  '1997-11-27T00:00:00.000Z',
                  '1997-12-02T00:00:00.000Z',
                  '1997-12-07T00:00:00.000Z',
                  '1997-12-12T00:00:00.000Z',
                  '1997-12-17T00:00:00.000Z',
                  '1997-12-22T00:00:00.000Z',
                  '1997-12-27T00:00:00.000Z',
                  '1998-01-01T00:00:00.000Z',
                  '1998-01-06T00:00:00.000Z',
                  '1998-01-11T00:00:00.000Z',
                  '1998-01-16T00:00:00.000Z',
                  '1998-01-21T00:00:00.000Z',
                  '1998-01-26T00:00:00.000Z',
                  '1998-01-31T00:00:00.000Z',
                  '1998-02-05T00:00:00.000Z',
                  '1998-02-10T00:00:00.000Z',
                  '1998-02-15T00:00:00.000Z',
                  '1998-02-20T00:00:00.000Z',
                  '1998-02-25T00:00:00.000Z',
                  '1998-03-02T00:00:00.000Z',
                  '1998-03-07T00:00:00.000Z',
                  '1998-03-12T00:00:00.000Z',
                  '1998-03-17T00:00:00.000Z',
                  '1998-03-22T00:00:00.000Z',
                  '1998-03-27T00:00:00.000Z',
                  '1998-04-01T00:00:00.000Z',
                  '1998-04-06T00:00:00.000Z',
                  '1998-04-11T00:00:00.000Z',
                  '1998-04-16T00:00:00.000Z',
                  '1998-04-21T00:00:00.000Z',
                  '1998-04-26T00:00:00.000Z',
                  '1998-05-01T00:00:00.000Z',
                  '1998-05-06T00:00:00.000Z',
                  '1998-05-11T00:00:00.000Z',
                  '1998-05-16T00:00:00.000Z',
                  '1998-05-21T00:00:00.000Z',
                  '1998-05-26T00:00:00.000Z',
                  '1998-05-31T00:00:00.000Z',
                  '1998-06-05T00:00:00.000Z',
                  '1998-06-10T00:00:00.000Z',
                  '1998-06-15T00:00:00.000Z',
                  '1998-06-20T00:00:00.000Z',
                  '1998-06-25T00:00:00.000Z',
                  '1998-06-30T00:00:00.000Z',
                  '1998-07-05T00:00:00.000Z',
                  '1998-07-11T00:00:00.000Z',
                  '1998-07-15T00:00:00.000Z',
                  '1998-07-20T00:00:00.000Z',
                  '1998-07-25T00:00:00.000Z',
                  '1998-07-30T00:00:00.000Z',
                  '1998-08-04T00:00:00.000Z',
                  '1998-08-09T00:00:00.000Z',
                  '1998-08-14T00:00:00.000Z',
                  '1998-08-19T00:00:00.000Z',
                  '1998-08-24T00:00:00.000Z',
                  '1998-08-29T00:00:00.000Z',
                  '1998-09-03T00:00:00.000Z',
                  '1998-09-08T00:00:00.000Z',
                  '1998-09-13T00:00:00.000Z',
                  '1998-09-18T00:00:00.000Z',
                  '1998-09-23T00:00:00.000Z',
                  '1998-09-28T00:00:00.000Z',
                  '1998-10-03T00:00:00.000Z',
                  '1998-10-08T00:00:00.000Z',
                  '1998-10-13T00:00:00.000Z',
                  '1998-10-18T00:00:00.000Z',
                  '1998-10-23T00:00:00.000Z',
                  '1998-10-28T00:00:00.000Z',
                  '1998-11-02T00:00:00.000Z',
                  '1998-11-07T00:00:00.000Z',
                  '1998-11-12T00:00:00.000Z',
                  '1998-11-21T00:00:00.000Z',
                  '1998-11-22T00:00:00.000Z',
                  '1998-11-27T00:00:00.000Z',
                  '1998-12-02T00:00:00.000Z',
                  '1998-12-07T00:00:00.000Z',
                  '1998-12-12T00:00:00.000Z',
                  '1998-12-18T00:00:00.000Z',
                  '1998-12-22T00:00:00.000Z',
                  '1998-12-27T00:00:00.000Z',
                  '1999-01-01T00:00:00.000Z',
                  '1999-01-06T00:00:00.000Z',
                  '1999-01-11T00:00:00.000Z',
                  '1999-01-16T00:00:00.000Z',
                  '1999-01-21T00:00:00.000Z',
                  '1999-01-26T00:00:00.000Z',
                  '1999-01-31T00:00:00.000Z',
                  '1999-02-05T00:00:00.000Z',
                  '1999-02-10T00:00:00.000Z',
                  '1999-02-15T00:00:00.000Z',
                  '1999-02-20T00:00:00.000Z',
                  '1999-02-25T00:00:00.000Z',
                  '1999-03-02T00:00:00.000Z',
                  '1999-03-07T00:00:00.000Z',
                  '1999-03-12T00:00:00.000Z',
                  '1999-03-17T00:00:00.000Z',
                  '1999-03-22T00:00:00.000Z',
                  '1999-03-27T00:00:00.000Z',
                  '1999-04-01T00:00:00.000Z',
                  '1999-04-06T00:00:00.000Z',
                  '1999-04-11T00:00:00.000Z',
                  '1999-04-16T00:00:00.000Z',
                  '1999-04-21T00:00:00.000Z',
                  '1999-04-26T00:00:00.000Z',
                  '1999-05-01T00:00:00.000Z',
                  '1999-05-06T00:00:00.000Z',
                  '1999-05-11T00:00:00.000Z',
                  '1999-05-16T00:00:00.000Z',
                  '1999-05-21T00:00:00.000Z',
                  '1999-05-26T00:00:00.000Z',
                  '1999-05-31T00:00:00.000Z',
                  '1999-06-05T00:00:00.000Z',
                  '1999-06-10T00:00:00.000Z',
                  '1999-06-15T00:00:00.000Z',
                  '1999-06-20T00:00:00.000Z',
                  '1999-06-25T00:00:00.000Z',
                  '1999-06-30T00:00:00.000Z',
                  '1999-07-05T00:00:00.000Z',
                  '1999-07-10T00:00:00.000Z',
                  '1999-07-15T00:00:00.000Z',
                  '1999-07-20T00:00:00.000Z',
                  '1999-07-25T00:00:00.000Z',
                  '1999-07-30T00:00:00.000Z',
                  '1999-08-04T00:00:00.000Z',
                  '1999-08-09T00:00:00.000Z',
                  '1999-08-14T00:00:00.000Z',
                  '1999-08-19T00:00:00.000Z',
                  '1999-08-24T00:00:00.000Z',
                  '1999-08-29T00:00:00.000Z',
                  '1999-09-03T00:00:00.000Z',
                  '1999-09-08T00:00:00.000Z',
                  '1999-09-13T00:00:00.000Z',
                  '1999-09-18T00:00:00.000Z',
                  '1999-09-23T00:00:00.000Z',
                  '1999-09-28T00:00:00.000Z',
                  '1999-10-03T00:00:00.000Z',
                  '1999-10-08T00:00:00.000Z',
                  '1999-10-13T00:00:00.000Z',
                  '1999-10-18T00:00:00.000Z',
                  '1999-10-23T00:00:00.000Z',
                  '1999-10-28T00:00:00.000Z',
                  '1999-11-02T00:00:00.000Z',
                  '1999-11-07T00:00:00.000Z',
                  '1999-11-12T00:00:00.000Z',
                  '1999-11-19T00:00:00.000Z',
                  '1999-11-22T00:00:00.000Z',
                  '1999-11-27T00:00:00.000Z',
                  '1999-12-02T00:00:00.000Z',
                  '1999-12-07T00:00:00.000Z',
                  '1999-12-12T00:00:00.000Z',
                  '1999-12-17T00:00:00.000Z',
                  '1999-12-22T00:00:00.000Z',
                  '1999-12-27T00:00:00.000Z',
                  '2000-01-01T00:00:00.000Z',
                  '2000-01-06T00:00:00.000Z',
                  '2000-01-11T00:00:00.000Z',
                  '2000-01-16T00:00:00.000Z',
                  '2000-01-21T00:00:00.000Z',
                  '2000-01-26T00:00:00.000Z',
                  '2000-01-31T00:00:00.000Z',
                  '2000-02-05T00:00:00.000Z',
                  '2000-02-10T00:00:00.000Z',
                  '2000-02-15T00:00:00.000Z',
                  '2000-02-20T00:00:00.000Z',
                  '2000-02-25T00:00:00.000Z',
                  '2000-03-01T00:00:00.000Z',
                  '2000-03-06T00:00:00.000Z',
                  '2000-03-11T00:00:00.000Z',
                  '2000-03-16T00:00:00.000Z',
                  '2000-03-21T00:00:00.000Z',
                  '2000-03-26T00:00:00.000Z',
                  '2000-03-31T00:00:00.000Z',
                  '2000-04-05T00:00:00.000Z',
                  '2000-04-10T00:00:00.000Z',
                  '2000-04-15T00:00:00.000Z',
                  '2000-04-20T00:00:00.000Z',
                  '2000-04-25T00:00:00.000Z',
                  '2000-04-30T00:00:00.000Z',
                  '2000-05-05T00:00:00.000Z',
                  '2000-05-10T00:00:00.000Z',
                  '2000-05-15T00:00:00.000Z',
                  '2000-05-20T00:00:00.000Z',
                  '2000-05-25T00:00:00.000Z',
                  '2000-05-30T00:00:00.000Z',
                  '2000-06-04T00:00:00.000Z',
                  '2000-06-09T00:00:00.000Z',
                  '2000-06-14T00:00:00.000Z',
                  '2000-06-19T00:00:00.000Z',
                  '2000-06-24T00:00:00.000Z',
                  '2000-06-29T00:00:00.000Z',
                  '2000-07-04T00:00:00.000Z',
                  '2000-07-09T00:00:00.000Z',
                  '2000-07-14T00:00:00.000Z',
                  '2000-07-19T00:00:00.000Z',
                  '2000-07-24T00:00:00.000Z',
                  '2000-07-29T00:00:00.000Z',
                  '2000-08-03T00:00:00.000Z',
                  '2000-08-08T00:00:00.000Z',
                  '2000-08-13T00:00:00.000Z',
                  '2000-08-18T00:00:00.000Z',
                  '2000-08-23T00:00:00.000Z',
                  '2000-08-28T00:00:00.000Z',
                  '2000-09-02T00:00:00.000Z',
                  '2000-09-07T00:00:00.000Z',
                  '2000-09-12T00:00:00.000Z',
                  '2000-09-17T00:00:00.000Z',
                  '2000-09-22T00:00:00.000Z',
                  '2000-09-27T00:00:00.000Z',
                  '2000-10-02T00:00:00.000Z',
                  '2000-10-07T00:00:00.000Z',
                  '2000-10-12T00:00:00.000Z',
                  '2000-10-17T00:00:00.000Z',
                  '2000-10-22T00:00:00.000Z',
                  '2000-10-27T00:00:00.000Z',
                  '2000-11-01T00:00:00.000Z',
                  '2000-11-06T00:00:00.000Z',
                  '2000-11-11T00:00:00.000Z',
                  '2000-11-16T00:00:00.000Z',
                  '2000-11-21T00:00:00.000Z',
                  '2000-11-26T00:00:00.000Z',
                  '2000-12-01T00:00:00.000Z',
                  '2000-12-06T00:00:00.000Z',
                  '2000-12-11T00:00:00.000Z',
                  '2000-12-16T00:00:00.000Z',
                  '2000-12-21T00:00:00.000Z',
                  '2000-12-26T00:00:00.000Z',
                  '2000-12-31T00:00:00.000Z',
                  '2001-01-01T00:00:00.000Z',
                  '2001-01-06T00:00:00.000Z',
                  '2001-01-11T00:00:00.000Z',
                  '2001-01-16T00:00:00.000Z',
                  '2001-01-21T00:00:00.000Z',
                  '2001-01-26T00:00:00.000Z',
                  '2001-01-31T00:00:00.000Z',
                  '2001-02-05T00:00:00.000Z',
                  '2001-02-10T00:00:00.000Z',
                  '2001-02-15T00:00:00.000Z',
                  '2001-02-20T00:00:00.000Z',
                  '2001-02-25T00:00:00.000Z',
                  '2001-03-02T00:00:00.000Z',
                  '2001-03-07T00:00:00.000Z',
                  '2001-03-12T00:00:00.000Z',
                  '2001-03-17T00:00:00.000Z',
                  '2001-03-22T00:00:00.000Z',
                  '2001-03-27T00:00:00.000Z',
                  '2001-04-01T00:00:00.000Z',
                  '2001-04-06T00:00:00.000Z',
                  '2001-04-11T00:00:00.000Z',
                  '2001-04-16T00:00:00.000Z',
                  '2001-04-21T00:00:00.000Z',
                  '2001-04-26T00:00:00.000Z',
                  '2001-05-01T00:00:00.000Z',
                  '2001-05-06T00:00:00.000Z',
                  '2001-05-11T00:00:00.000Z',
                  '2001-05-16T00:00:00.000Z',
                  '2001-05-21T00:00:00.000Z',
                  '2001-05-26T00:00:00.000Z',
                  '2001-05-31T00:00:00.000Z',
                  '2001-06-05T00:00:00.000Z',
                  '2001-06-10T00:00:00.000Z',
                  '2001-06-15T00:00:00.000Z',
                  '2001-06-20T00:00:00.000Z',
                  '2001-06-25T00:00:00.000Z',
                  '2001-06-30T00:00:00.000Z',
                  '2001-07-05T00:00:00.000Z',
                  '2001-07-10T00:00:00.000Z',
                  '2001-07-15T00:00:00.000Z',
                  '2001-07-20T00:00:00.000Z',
                  '2001-07-25T00:00:00.000Z',
                  '2001-07-30T00:00:00.000Z',
                  '2001-08-04T00:00:00.000Z',
                  '2001-08-09T00:00:00.000Z',
                  '2001-08-14T00:00:00.000Z',
                  '2001-08-19T00:00:00.000Z',
                  '2001-08-24T00:00:00.000Z',
                  '2001-08-29T00:00:00.000Z',
                  '2001-09-03T00:00:00.000Z',
                  '2001-09-08T00:00:00.000Z',
                  '2001-09-13T00:00:00.000Z',
                  '2001-09-18T00:00:00.000Z',
                  '2001-09-23T00:00:00.000Z',
                  '2001-09-28T00:00:00.000Z',
                  '2001-10-03T00:00:00.000Z',
                  '2001-10-08T00:00:00.000Z',
                  '2001-10-13T00:00:00.000Z',
                  '2001-10-18T00:00:00.000Z',
                  '2001-10-23T00:00:00.000Z',
                  '2001-10-28T00:00:00.000Z',
                  '2001-11-02T00:00:00.000Z',
                  '2001-11-07T00:00:00.000Z',
                  '2001-11-12T00:00:00.000Z',
                  '2001-11-17T00:00:00.000Z',
                  '2001-11-22T00:00:00.000Z',
                  '2001-11-27T00:00:00.000Z',
                  '2001-12-02T00:00:00.000Z',
                  '2001-12-07T00:00:00.000Z',
                  '2001-12-12T00:00:00.000Z',
                  '2001-12-17T00:00:00.000Z',
                  '2001-12-22T00:00:00.000Z',
                  '2001-12-27T00:00:00.000Z',
                  '2002-01-01T00:00:00.000Z',
                  '2002-01-06T00:00:00.000Z',
                  '2002-01-11T00:00:00.000Z',
                  '2002-01-16T00:00:00.000Z',
                  '2002-01-21T00:00:00.000Z',
                  '2002-01-26T00:00:00.000Z',
                  '2002-01-31T00:00:00.000Z',
                  '2002-02-05T00:00:00.000Z',
                  '2002-02-10T00:00:00.000Z',
                  '2002-02-15T00:00:00.000Z',
                  '2002-02-20T00:00:00.000Z',
                  '2002-02-25T00:00:00.000Z',
                  '2002-03-02T00:00:00.000Z',
                  '2002-03-07T00:00:00.000Z',
                  '2002-03-12T00:00:00.000Z',
                  '2002-03-17T00:00:00.000Z',
                  '2002-03-22T00:00:00.000Z',
                  '2002-03-27T00:00:00.000Z',
                  '2002-04-01T00:00:00.000Z',
                  '2002-04-06T00:00:00.000Z',
                  '2002-04-11T00:00:00.000Z',
                  '2002-04-16T00:00:00.000Z',
                  '2002-04-21T00:00:00.000Z',
                  '2002-04-26T00:00:00.000Z',
                  '2002-05-01T00:00:00.000Z',
                  '2002-05-06T00:00:00.000Z',
                  '2002-05-11T00:00:00.000Z',
                  '2002-05-16T00:00:00.000Z',
                  '2002-05-21T00:00:00.000Z',
                  '2002-05-26T00:00:00.000Z',
                  '2002-05-31T00:00:00.000Z',
                  '2002-06-05T00:00:00.000Z',
                  '2002-06-10T00:00:00.000Z',
                  '2002-06-15T00:00:00.000Z',
                  '2002-06-20T00:00:00.000Z',
                  '2002-06-25T00:00:00.000Z',
                  '2002-06-30T00:00:00.000Z',
                  '2002-07-05T00:00:00.000Z',
                  '2002-07-10T00:00:00.000Z',
                  '2002-07-15T00:00:00.000Z',
                  '2002-07-20T00:00:00.000Z',
                  '2002-07-25T00:00:00.000Z',
                  '2002-07-30T00:00:00.000Z',
                  '2002-08-04T00:00:00.000Z',
                  '2002-08-09T00:00:00.000Z',
                  '2002-08-14T00:00:00.000Z',
                  '2002-08-19T00:00:00.000Z',
                  '2002-08-24T00:00:00.000Z',
                  '2002-08-29T00:00:00.000Z',
                  '2002-09-03T00:00:00.000Z',
                  '2002-09-08T00:00:00.000Z',
                  '2002-09-13T00:00:00.000Z',
                  '2002-09-18T00:00:00.000Z',
                  '2002-09-23T00:00:00.000Z',
                  '2002-09-28T00:00:00.000Z',
                  '2002-10-03T00:00:00.000Z',
                  '2002-10-08T00:00:00.000Z',
                  '2002-10-13T00:00:00.000Z',
                  '2002-10-18T00:00:00.000Z',
                  '2002-10-23T00:00:00.000Z',
                  '2002-10-28T00:00:00.000Z',
                  '2002-11-02T00:00:00.000Z',
                  '2002-11-07T00:00:00.000Z',
                  '2002-11-12T00:00:00.000Z',
                  '2002-11-17T00:00:00.000Z',
                  '2002-11-22T00:00:00.000Z',
                  '2002-11-27T00:00:00.000Z',
                  '2002-12-02T00:00:00.000Z',
                  '2002-12-07T00:00:00.000Z',
                  '2002-12-12T00:00:00.000Z',
                  '2002-12-17T00:00:00.000Z',
                  '2002-12-22T00:00:00.000Z',
                  '2002-12-27T00:00:00.000Z',
                  '2003-01-01T00:00:00.000Z',
                  '2003-01-06T00:00:00.000Z',
                  '2003-01-11T00:00:00.000Z',
                  '2003-01-16T00:00:00.000Z',
                  '2003-01-21T00:00:00.000Z',
                  '2003-01-26T00:00:00.000Z',
                  '2003-01-31T00:00:00.000Z',
                  '2003-02-05T00:00:00.000Z',
                  '2003-02-10T00:00:00.000Z',
                  '2003-02-15T00:00:00.000Z',
                  '2003-02-20T00:00:00.000Z',
                  '2003-02-25T00:00:00.000Z',
                  '2003-03-02T00:00:00.000Z',
                  '2003-03-07T00:00:00.000Z',
                  '2003-03-12T00:00:00.000Z',
                  '2003-03-17T00:00:00.000Z',
                  '2003-03-22T00:00:00.000Z',
                  '2003-03-27T00:00:00.000Z',
                  '2003-04-01T00:00:00.000Z',
                  '2003-04-06T00:00:00.000Z',
                  '2003-04-11T00:00:00.000Z',
                  '2003-04-16T00:00:00.000Z',
                  '2003-04-21T00:00:00.000Z',
                  '2003-04-26T00:00:00.000Z',
                  '2003-05-01T00:00:00.000Z',
                  '2003-05-06T00:00:00.000Z',
                  '2003-05-11T00:00:00.000Z',
                  '2003-05-16T00:00:00.000Z',
                  '2003-05-21T00:00:00.000Z',
                  '2003-05-26T00:00:00.000Z',
                  '2003-05-31T00:00:00.000Z',
                  '2003-06-05T00:00:00.000Z',
                  '2003-06-10T00:00:00.000Z',
                  '2003-06-15T00:00:00.000Z',
                  '2003-06-20T00:00:00.000Z',
                  '2003-06-25T00:00:00.000Z',
                  '2003-06-30T00:00:00.000Z',
                  '2003-07-05T00:00:00.000Z',
                  '2003-07-10T00:00:00.000Z',
                  '2003-07-15T00:00:00.000Z',
                  '2003-07-20T00:00:00.000Z',
                  '2003-07-25T00:00:00.000Z',
                  '2003-07-30T00:00:00.000Z',
                  '2003-08-04T00:00:00.000Z',
                  '2003-08-09T00:00:00.000Z',
                  '2003-08-14T00:00:00.000Z',
                  '2003-08-19T00:00:00.000Z',
                  '2003-08-24T00:00:00.000Z',
                  '2003-08-29T00:00:00.000Z',
                  '2003-09-03T00:00:00.000Z',
                  '2003-09-08T00:00:00.000Z',
                  '2003-09-13T00:00:00.000Z',
                  '2003-09-18T00:00:00.000Z',
                  '2003-09-23T00:00:00.000Z',
                  '2003-09-28T00:00:00.000Z',
                  '2003-10-03T00:00:00.000Z',
                  '2003-10-08T00:00:00.000Z',
                  '2003-10-13T00:00:00.000Z',
                  '2003-10-18T00:00:00.000Z',
                  '2003-10-23T00:00:00.000Z',
                  '2003-10-28T00:00:00.000Z',
                  '2003-11-02T00:00:00.000Z',
                  '2003-11-07T00:00:00.000Z',
                  '2003-11-12T00:00:00.000Z',
                  '2003-11-17T00:00:00.000Z',
                  '2003-11-22T00:00:00.000Z',
                  '2003-11-27T00:00:00.000Z',
                  '2003-12-02T00:00:00.000Z',
                  '2003-12-07T00:00:00.000Z',
                  '2003-12-12T00:00:00.000Z',
                  '2003-12-17T00:00:00.000Z',
                  '2003-12-22T00:00:00.000Z',
                  '2003-12-27T00:00:00.000Z',
                  '2004-01-01T00:00:00.000Z',
                  '2004-01-06T00:00:00.000Z',
                  '2004-01-11T00:00:00.000Z',
                  '2004-01-16T00:00:00.000Z',
                  '2004-01-21T00:00:00.000Z',
                  '2004-01-26T00:00:00.000Z',
                  '2004-01-31T00:00:00.000Z',
                  '2004-02-05T00:00:00.000Z',
                  '2004-02-10T00:00:00.000Z',
                  '2004-02-15T00:00:00.000Z',
                  '2004-02-20T00:00:00.000Z',
                  '2004-02-25T00:00:00.000Z',
                  '2004-03-01T00:00:00.000Z',
                  '2004-03-06T00:00:00.000Z',
                  '2004-03-11T00:00:00.000Z',
                  '2004-03-16T00:00:00.000Z',
                  '2004-03-21T00:00:00.000Z',
                  '2004-03-26T00:00:00.000Z',
                  '2004-03-31T00:00:00.000Z',
                  '2004-04-05T00:00:00.000Z',
                  '2004-04-10T00:00:00.000Z',
                  '2004-04-15T00:00:00.000Z',
                  '2004-04-20T00:00:00.000Z',
                  '2004-04-25T00:00:00.000Z',
                  '2004-04-30T00:00:00.000Z',
                  '2004-05-05T00:00:00.000Z',
                  '2004-05-10T00:00:00.000Z',
                  '2004-05-15T00:00:00.000Z',
                  '2004-05-20T00:00:00.000Z',
                  '2004-05-25T00:00:00.000Z',
                  '2004-05-30T00:00:00.000Z',
                  '2004-06-04T00:00:00.000Z',
                  '2004-06-09T00:00:00.000Z',
                  '2004-06-14T00:00:00.000Z',
                  '2004-06-19T00:00:00.000Z',
                  '2004-06-24T00:00:00.000Z',
                  '2004-06-29T00:00:00.000Z',
                  '2004-07-04T00:00:00.000Z',
                  '2004-07-09T00:00:00.000Z',
                  '2004-07-14T00:00:00.000Z',
                  '2004-07-19T00:00:00.000Z',
                  '2004-07-24T00:00:00.000Z',
                  '2004-07-29T00:00:00.000Z',
                  '2004-08-03T00:00:00.000Z',
                  '2004-08-08T00:00:00.000Z',
                  '2004-08-13T00:00:00.000Z',
                  '2004-08-18T00:00:00.000Z',
                  '2004-08-23T00:00:00.000Z',
                  '2004-08-28T00:00:00.000Z',
                  '2004-09-02T00:00:00.000Z',
                  '2004-09-07T00:00:00.000Z',
                  '2004-09-12T00:00:00.000Z',
                  '2004-09-17T00:00:00.000Z',
                  '2004-09-22T00:00:00.000Z',
                  '2004-09-27T00:00:00.000Z',
                  '2004-10-02T00:00:00.000Z',
                  '2004-10-07T00:00:00.000Z',
                  '2004-10-12T00:00:00.000Z',
                  '2004-10-17T00:00:00.000Z',
                  '2004-10-22T00:00:00.000Z',
                  '2004-10-27T00:00:00.000Z',
                  '2004-11-01T00:00:00.000Z',
                  '2004-11-06T00:00:00.000Z',
                  '2004-11-11T00:00:00.000Z',
                  '2004-11-16T00:00:00.000Z',
                  '2004-11-21T00:00:00.000Z',
                  '2004-11-26T00:00:00.000Z',
                  '2004-12-01T00:00:00.000Z',
                  '2004-12-06T00:00:00.000Z',
                  '2004-12-11T00:00:00.000Z',
                  '2004-12-16T00:00:00.000Z',
                  '2004-12-21T00:00:00.000Z',
                  '2004-12-26T00:00:00.000Z',
                  '2004-12-31T00:00:00.000Z',
                  '2005-01-01T00:00:00.000Z',
                  '2005-01-06T00:00:00.000Z',
                  '2005-01-11T00:00:00.000Z',
                  '2005-01-16T00:00:00.000Z',
                  '2005-01-21T00:00:00.000Z',
                  '2005-01-26T00:00:00.000Z',
                  '2005-01-31T00:00:00.000Z',
                  '2005-02-05T00:00:00.000Z',
                  '2005-02-10T00:00:00.000Z',
                  '2005-02-15T00:00:00.000Z',
                  '2005-02-20T00:00:00.000Z',
                  '2005-02-25T00:00:00.000Z',
                  '2005-03-02T00:00:00.000Z',
                  '2005-03-07T00:00:00.000Z',
                  '2005-03-12T00:00:00.000Z',
                  '2005-03-17T00:00:00.000Z',
                  '2005-03-22T00:00:00.000Z',
                  '2005-03-27T00:00:00.000Z',
                  '2005-04-01T00:00:00.000Z',
                  '2005-04-06T00:00:00.000Z',
                  '2005-04-11T00:00:00.000Z',
                  '2005-04-16T00:00:00.000Z',
                  '2005-04-21T00:00:00.000Z',
                  '2005-04-26T00:00:00.000Z',
                  '2005-05-01T00:00:00.000Z',
                  '2005-05-06T00:00:00.000Z',
                  '2005-05-11T00:00:00.000Z',
                  '2005-05-16T00:00:00.000Z',
                  '2005-05-21T00:00:00.000Z',
                  '2005-05-26T00:00:00.000Z',
                  '2005-05-31T00:00:00.000Z',
                  '2005-06-05T00:00:00.000Z',
                  '2005-06-10T00:00:00.000Z',
                  '2005-06-15T00:00:00.000Z',
                  '2005-06-20T00:00:00.000Z',
                  '2005-06-25T00:00:00.000Z',
                  '2005-06-30T00:00:00.000Z',
                  '2005-07-05T00:00:00.000Z',
                  '2005-07-10T00:00:00.000Z',
                  '2005-07-15T00:00:00.000Z',
                  '2005-07-20T00:00:00.000Z',
                  '2005-07-25T00:00:00.000Z',
                  '2005-07-30T00:00:00.000Z',
                  '2005-08-04T00:00:00.000Z',
                  '2005-08-09T00:00:00.000Z',
                  '2005-08-14T00:00:00.000Z',
                  '2005-08-19T00:00:00.000Z',
                  '2005-08-24T00:00:00.000Z',
                  '2005-08-29T00:00:00.000Z',
                  '2005-09-03T00:00:00.000Z',
                  '2005-09-08T00:00:00.000Z',
                  '2005-09-13T00:00:00.000Z',
                  '2005-09-18T00:00:00.000Z',
                  '2005-09-23T00:00:00.000Z',
                  '2005-09-28T00:00:00.000Z',
                  '2005-10-03T00:00:00.000Z',
                  '2005-10-08T00:00:00.000Z',
                  '2005-10-13T00:00:00.000Z',
                  '2005-10-18T00:00:00.000Z',
                  '2005-10-23T00:00:00.000Z',
                  '2005-10-28T00:00:00.000Z',
                  '2005-11-02T00:00:00.000Z',
                  '2005-11-07T00:00:00.000Z',
                  '2005-11-12T00:00:00.000Z',
                  '2005-11-17T00:00:00.000Z',
                  '2005-11-22T00:00:00.000Z',
                  '2005-11-27T00:00:00.000Z',
                  '2005-12-02T00:00:00.000Z',
                  '2005-12-07T00:00:00.000Z',
                  '2005-12-12T00:00:00.000Z',
                  '2005-12-17T00:00:00.000Z',
                  '2005-12-22T00:00:00.000Z',
                  '2005-12-27T00:00:00.000Z',
                  '2006-01-01T00:00:00.000Z',
                  '2006-01-06T00:00:00.000Z',
                  '2006-01-11T00:00:00.000Z',
                  '2006-01-16T00:00:00.000Z',
                  '2006-01-21T00:00:00.000Z',
                  '2006-01-26T00:00:00.000Z',
                  '2006-01-31T00:00:00.000Z',
                  '2006-02-05T00:00:00.000Z',
                  '2006-02-10T00:00:00.000Z',
                  '2006-02-15T00:00:00.000Z',
                  '2006-02-20T00:00:00.000Z',
                  '2006-02-25T00:00:00.000Z',
                  '2006-03-02T00:00:00.000Z',
                  '2006-03-07T00:00:00.000Z',
                  '2006-03-12T00:00:00.000Z',
                  '2006-03-17T00:00:00.000Z',
                  '2006-03-22T00:00:00.000Z',
                  '2006-03-27T00:00:00.000Z',
                  '2006-04-01T00:00:00.000Z',
                  '2006-04-06T00:00:00.000Z',
                  '2006-04-11T00:00:00.000Z',
                  '2006-04-16T00:00:00.000Z',
                  '2006-04-21T00:00:00.000Z',
                  '2006-04-26T00:00:00.000Z',
                  '2006-05-01T00:00:00.000Z',
                  '2006-05-06T00:00:00.000Z',
                  '2006-05-11T00:00:00.000Z',
                  '2006-05-16T00:00:00.000Z',
                  '2006-05-21T00:00:00.000Z',
                  '2006-05-26T00:00:00.000Z',
                  '2006-05-31T00:00:00.000Z',
                  '2006-06-05T00:00:00.000Z',
                  '2006-06-10T00:00:00.000Z',
                  '2006-06-15T00:00:00.000Z',
                  '2006-06-20T00:00:00.000Z',
                  '2006-06-25T00:00:00.000Z',
                  '2006-06-30T00:00:00.000Z',
                  '2006-07-05T00:00:00.000Z',
                  '2006-07-10T00:00:00.000Z',
                  '2006-07-15T00:00:00.000Z',
                  '2006-07-20T00:00:00.000Z',
                  '2006-07-25T00:00:00.000Z',
                  '2006-07-30T00:00:00.000Z',
                  '2006-08-04T00:00:00.000Z',
                  '2006-08-09T00:00:00.000Z',
                  '2006-08-14T00:00:00.000Z',
                  '2006-08-19T00:00:00.000Z',
                  '2006-08-24T00:00:00.000Z',
                  '2006-08-29T00:00:00.000Z',
                  '2006-09-03T00:00:00.000Z',
                  '2006-09-08T00:00:00.000Z',
                  '2006-09-13T00:00:00.000Z',
                  '2006-09-18T00:00:00.000Z',
                  '2006-09-23T00:00:00.000Z',
                  '2006-09-28T00:00:00.000Z',
                  '2006-10-03T00:00:00.000Z',
                  '2006-10-08T00:00:00.000Z',
                  '2006-10-13T00:00:00.000Z',
                  '2006-10-18T00:00:00.000Z',
                  '2006-10-23T00:00:00.000Z',
                  '2006-10-28T00:00:00.000Z',
                  '2006-11-02T00:00:00.000Z',
                  '2006-11-07T00:00:00.000Z',
                  '2006-11-12T00:00:00.000Z',
                  '2006-11-17T00:00:00.000Z',
                  '2006-11-22T00:00:00.000Z',
                  '2006-11-27T00:00:00.000Z',
                  '2006-12-02T00:00:00.000Z',
                  '2006-12-07T00:00:00.000Z',
                  '2006-12-12T00:00:00.000Z',
                  '2006-12-17T00:00:00.000Z',
                  '2006-12-22T00:00:00.000Z',
                  '2006-12-27T00:00:00.000Z',
                  '2007-01-01T00:00:00.000Z',
                  '2007-01-06T00:00:00.000Z',
                  '2007-01-11T00:00:00.000Z',
                  '2007-01-16T00:00:00.000Z',
                  '2007-01-21T00:00:00.000Z',
                  '2007-01-26T00:00:00.000Z',
                  '2007-01-31T00:00:00.000Z',
                  '2007-02-05T00:00:00.000Z',
                  '2007-02-10T00:00:00.000Z',
                  '2007-02-15T00:00:00.000Z',
                  '2007-02-20T00:00:00.000Z',
                  '2007-02-25T00:00:00.000Z',
                  '2007-03-02T00:00:00.000Z',
                  '2007-03-07T00:00:00.000Z',
                  '2007-03-12T00:00:00.000Z',
                  '2007-03-17T00:00:00.000Z',
                  '2007-03-22T00:00:00.000Z',
                  '2007-03-27T00:00:00.000Z',
                  '2007-04-01T00:00:00.000Z',
                  '2007-04-06T00:00:00.000Z',
                  '2007-04-11T00:00:00.000Z',
                  '2007-04-16T00:00:00.000Z',
                  '2007-04-21T00:00:00.000Z',
                  '2007-04-26T00:00:00.000Z',
                  '2007-05-01T00:00:00.000Z',
                  '2007-05-06T00:00:00.000Z',
                  '2007-05-11T00:00:00.000Z',
                  '2007-05-16T00:00:00.000Z',
                  '2007-05-21T00:00:00.000Z',
                  '2007-05-26T00:00:00.000Z',
                  '2007-05-31T00:00:00.000Z',
                  '2007-06-05T00:00:00.000Z',
                  '2007-06-10T00:00:00.000Z',
                  '2007-06-15T00:00:00.000Z',
                  '2007-06-20T00:00:00.000Z',
                  '2007-06-25T00:00:00.000Z',
                  '2007-06-30T00:00:00.000Z',
                  '2007-07-05T00:00:00.000Z',
                  '2007-07-10T00:00:00.000Z',
                  '2007-07-15T00:00:00.000Z',
                  '2007-07-20T00:00:00.000Z',
                  '2007-07-25T00:00:00.000Z',
                  '2007-07-30T00:00:00.000Z',
                  '2007-08-04T00:00:00.000Z',
                  '2007-08-09T00:00:00.000Z',
                  '2007-08-14T00:00:00.000Z',
                  '2007-08-19T00:00:00.000Z',
                  '2007-08-24T00:00:00.000Z',
                  '2007-08-29T00:00:00.000Z',
                  '2007-09-03T00:00:00.000Z',
                  '2007-09-08T00:00:00.000Z',
                  '2007-09-13T00:00:00.000Z',
                  '2007-09-18T00:00:00.000Z',
                  '2007-09-23T00:00:00.000Z',
                  '2007-09-28T00:00:00.000Z',
                  '2007-10-03T00:00:00.000Z',
                  '2007-10-08T00:00:00.000Z',
                  '2007-10-13T00:00:00.000Z',
                  '2007-10-18T00:00:00.000Z',
                  '2007-10-23T00:00:00.000Z',
                  '2007-10-28T00:00:00.000Z',
                  '2007-11-02T00:00:00.000Z',
                  '2007-11-07T00:00:00.000Z',
                  '2007-11-12T00:00:00.000Z',
                  '2007-11-17T00:00:00.000Z',
                  '2007-11-22T00:00:00.000Z',
                  '2007-11-27T00:00:00.000Z',
                  '2007-12-02T00:00:00.000Z',
                  '2007-12-07T00:00:00.000Z',
                  '2007-12-12T00:00:00.000Z',
                  '2007-12-17T00:00:00.000Z',
                  '2007-12-22T00:00:00.000Z',
                  '2007-12-27T00:00:00.000Z',
                  '2008-01-01T00:00:00.000Z',
                  '2008-01-06T00:00:00.000Z',
                  '2008-01-11T00:00:00.000Z',
                  '2008-01-16T00:00:00.000Z',
                  '2008-01-21T00:00:00.000Z',
                  '2008-01-26T00:00:00.000Z',
                  '2008-01-31T00:00:00.000Z',
                  '2008-02-05T00:00:00.000Z',
                  '2008-02-10T00:00:00.000Z',
                  '2008-02-15T00:00:00.000Z',
                  '2008-02-20T00:00:00.000Z',
                  '2008-02-25T00:00:00.000Z',
                  '2008-03-01T00:00:00.000Z',
                  '2008-03-06T00:00:00.000Z',
                  '2008-03-11T00:00:00.000Z',
                  '2008-03-16T00:00:00.000Z',
                  '2008-03-21T00:00:00.000Z',
                  '2008-03-26T00:00:00.000Z',
                  '2008-03-31T00:00:00.000Z',
                  '2008-04-05T00:00:00.000Z',
                  '2008-04-10T00:00:00.000Z',
                  '2008-04-15T00:00:00.000Z',
                  '2008-04-20T00:00:00.000Z',
                  '2008-04-25T00:00:00.000Z',
                  '2008-04-30T00:00:00.000Z',
                  '2008-05-05T00:00:00.000Z',
                  '2008-05-10T00:00:00.000Z',
                  '2008-05-15T00:00:00.000Z',
                  '2008-05-20T00:00:00.000Z',
                  '2008-05-25T00:00:00.000Z',
                  '2008-05-30T00:00:00.000Z',
                  '2008-06-04T00:00:00.000Z',
                  '2008-06-09T00:00:00.000Z',
                  '2008-06-14T00:00:00.000Z',
                  '2008-06-19T00:00:00.000Z',
                  '2008-06-24T00:00:00.000Z',
                  '2008-06-29T00:00:00.000Z',
                  '2008-07-04T00:00:00.000Z',
                  '2008-07-09T00:00:00.000Z',
                  '2008-07-14T00:00:00.000Z',
                  '2008-07-19T00:00:00.000Z',
                  '2008-07-24T00:00:00.000Z',
                  '2008-07-29T00:00:00.000Z',
                  '2008-08-03T00:00:00.000Z',
                  '2008-08-08T00:00:00.000Z',
                  '2008-08-13T00:00:00.000Z',
                  '2008-08-18T00:00:00.000Z',
                  '2008-08-23T00:00:00.000Z',
                  '2008-08-28T00:00:00.000Z',
                  '2008-09-02T00:00:00.000Z',
                  '2008-09-07T00:00:00.000Z',
                  '2008-09-12T00:00:00.000Z',
                  '2008-09-17T00:00:00.000Z',
                  '2008-09-22T00:00:00.000Z',
                  '2008-09-27T00:00:00.000Z',
                  '2008-10-02T00:00:00.000Z',
                  '2008-10-07T00:00:00.000Z',
                  '2008-10-12T00:00:00.000Z',
                  '2008-10-17T00:00:00.000Z',
                  '2008-10-22T00:00:00.000Z',
                  '2008-10-27T00:00:00.000Z',
                  '2008-11-01T00:00:00.000Z',
                  '2008-11-06T00:00:00.000Z',
                  '2008-11-11T00:00:00.000Z',
                  '2008-11-16T00:00:00.000Z',
                  '2008-11-21T00:00:00.000Z',
                  '2008-11-26T00:00:00.000Z',
                  '2008-12-01T00:00:00.000Z',
                  '2008-12-06T00:00:00.000Z',
                  '2008-12-11T00:00:00.000Z',
                  '2008-12-16T00:00:00.000Z',
                  '2008-12-21T00:00:00.000Z',
                  '2008-12-26T00:00:00.000Z',
                  '2008-12-31T00:00:00.000Z',
                  '2009-01-01T00:00:00.000Z',
                  '2009-01-06T00:00:00.000Z',
                  '2009-01-11T00:00:00.000Z',
                  '2009-01-16T00:00:00.000Z',
                  '2009-01-21T00:00:00.000Z',
                  '2009-01-26T00:00:00.000Z',
                  '2009-01-31T00:00:00.000Z',
                  '2009-02-05T00:00:00.000Z',
                  '2009-02-10T00:00:00.000Z',
                  '2009-02-15T00:00:00.000Z',
                  '2009-02-20T00:00:00.000Z',
                  '2009-02-25T00:00:00.000Z',
                  '2009-03-02T00:00:00.000Z',
                  '2009-03-07T00:00:00.000Z',
                  '2009-03-12T00:00:00.000Z',
                  '2009-03-17T00:00:00.000Z',
                  '2009-03-22T00:00:00.000Z',
                  '2009-03-27T00:00:00.000Z',
                  '2009-04-01T00:00:00.000Z',
                  '2009-04-06T00:00:00.000Z',
                  '2009-04-11T00:00:00.000Z',
                  '2009-04-16T00:00:00.000Z',
                  '2009-04-21T00:00:00.000Z',
                  '2009-04-26T00:00:00.000Z',
                  '2009-05-01T00:00:00.000Z',
                  '2009-05-06T00:00:00.000Z',
                  '2009-05-11T00:00:00.000Z',
                  '2009-05-16T00:00:00.000Z',
                  '2009-05-21T00:00:00.000Z',
                  '2009-05-26T00:00:00.000Z',
                  '2009-05-31T00:00:00.000Z',
                  '2009-06-05T00:00:00.000Z',
                  '2009-06-10T00:00:00.000Z',
                  '2009-06-15T00:00:00.000Z',
                  '2009-06-20T00:00:00.000Z',
                  '2009-06-25T00:00:00.000Z',
                  '2009-06-30T00:00:00.000Z',
                  '2009-07-05T00:00:00.000Z',
                  '2009-07-10T00:00:00.000Z',
                  '2009-07-15T00:00:00.000Z',
                  '2009-07-20T00:00:00.000Z',
                  '2009-07-25T00:00:00.000Z',
                  '2009-07-30T00:00:00.000Z',
                  '2009-08-04T00:00:00.000Z',
                  '2009-08-09T00:00:00.000Z',
                  '2009-08-14T00:00:00.000Z',
                  '2009-08-19T00:00:00.000Z',
                  '2009-08-24T00:00:00.000Z',
                  '2009-08-29T00:00:00.000Z',
                  '2009-09-03T00:00:00.000Z',
                  '2009-09-08T00:00:00.000Z',
                  '2009-09-13T00:00:00.000Z',
                  '2009-09-18T00:00:00.000Z',
                  '2009-09-23T00:00:00.000Z',
                  '2009-09-28T00:00:00.000Z',
                  '2009-10-03T00:00:00.000Z',
                  '2009-10-08T00:00:00.000Z',
                  '2009-10-13T00:00:00.000Z',
                  '2009-10-18T00:00:00.000Z',
                  '2009-10-23T00:00:00.000Z',
                  '2009-10-28T00:00:00.000Z',
                  '2009-11-02T00:00:00.000Z',
                  '2009-11-07T00:00:00.000Z',
                  '2009-11-12T00:00:00.000Z',
                  '2009-11-17T00:00:00.000Z',
                  '2009-11-22T00:00:00.000Z',
                  '2009-11-27T00:00:00.000Z',
                  '2009-12-02T00:00:00.000Z',
                  '2009-12-07T00:00:00.000Z',
                  '2009-12-12T00:00:00.000Z',
                  '2009-12-17T00:00:00.000Z',
                  '2009-12-22T00:00:00.000Z',
                  '2009-12-27T00:00:00.000Z',
                  '2010-01-01T00:00:00.000Z',
                  '2010-01-06T00:00:00.000Z',
                  '2010-01-11T00:00:00.000Z',
                  '2010-01-16T00:00:00.000Z',
                  '2010-01-21T00:00:00.000Z',
                  '2010-01-26T00:00:00.000Z',
                  '2010-01-31T00:00:00.000Z',
                  '2010-02-05T00:00:00.000Z',
                  '2010-02-10T00:00:00.000Z',
                  '2010-02-15T00:00:00.000Z',
                  '2010-02-20T00:00:00.000Z',
                  '2010-02-25T00:00:00.000Z',
                  '2010-03-02T00:00:00.000Z',
                  '2010-03-07T00:00:00.000Z',
                  '2010-03-12T00:00:00.000Z',
                  '2010-03-17T00:00:00.000Z',
                  '2010-03-22T00:00:00.000Z',
                  '2010-03-27T00:00:00.000Z',
                  '2010-04-01T00:00:00.000Z',
                  '2010-04-06T00:00:00.000Z',
                  '2010-04-11T00:00:00.000Z',
                  '2010-04-16T00:00:00.000Z',
                  '2010-04-21T00:00:00.000Z',
                  '2010-04-26T00:00:00.000Z',
                  '2010-05-01T00:00:00.000Z',
                  '2010-05-06T00:00:00.000Z',
                  '2010-05-11T00:00:00.000Z',
                  '2010-05-16T00:00:00.000Z',
                  '2010-05-21T00:00:00.000Z',
                  '2010-05-26T00:00:00.000Z',
                  '2010-05-31T00:00:00.000Z',
                  '2010-06-05T00:00:00.000Z',
                  '2010-06-10T00:00:00.000Z',
                  '2010-06-15T00:00:00.000Z',
                  '2010-06-20T00:00:00.000Z',
                  '2010-06-25T00:00:00.000Z',
                  '2010-06-30T00:00:00.000Z',
                  '2010-07-05T00:00:00.000Z',
                  '2010-07-10T00:00:00.000Z',
                  '2010-07-15T00:00:00.000Z',
                  '2010-07-20T00:00:00.000Z',
                  '2010-07-25T00:00:00.000Z',
                  '2010-07-30T00:00:00.000Z',
                  '2010-08-04T00:00:00.000Z',
                  '2010-08-09T00:00:00.000Z',
                  '2010-08-14T00:00:00.000Z',
                  '2010-08-19T00:00:00.000Z',
                  '2010-08-24T00:00:00.000Z',
                  '2010-08-29T00:00:00.000Z',
                  '2010-09-03T00:00:00.000Z',
                  '2010-09-08T00:00:00.000Z',
                  '2010-09-13T00:00:00.000Z',
                  '2010-09-18T00:00:00.000Z',
                  '2010-09-23T00:00:00.000Z',
                  '2010-09-28T00:00:00.000Z',
                  '2010-10-03T00:00:00.000Z',
                  '2010-10-08T00:00:00.000Z',
                  '2010-10-13T00:00:00.000Z',
                  '2010-10-18T00:00:00.000Z',
                  '2010-10-23T00:00:00.000Z',
                  '2010-10-28T00:00:00.000Z',
                  '2010-11-02T00:00:00.000Z',
                  '2010-11-07T00:00:00.000Z',
                  '2010-11-12T00:00:00.000Z',
                  '2010-11-17T00:00:00.000Z',
                  '2010-11-22T00:00:00.000Z',
                  '2010-11-27T00:00:00.000Z',
                  '2010-12-02T00:00:00.000Z',
                  '2010-12-07T00:00:00.000Z',
                  '2010-12-12T00:00:00.000Z',
                  '2010-12-17T00:00:00.000Z',
                  '2010-12-22T00:00:00.000Z',
                  '2010-12-27T00:00:00.000Z',
                  '2011-01-01T00:00:00.000Z',
                  '2011-01-06T00:00:00.000Z',
                  '2011-01-11T00:00:00.000Z',
                  '2011-01-16T00:00:00.000Z',
                  '2011-01-21T00:00:00.000Z',
                  '2011-01-26T00:00:00.000Z',
                  '2011-01-31T00:00:00.000Z',
                  '2011-02-05T00:00:00.000Z',
                  '2011-02-10T00:00:00.000Z',
                  '2011-02-15T00:00:00.000Z',
                  '2011-02-20T00:00:00.000Z',
                  '2011-02-25T00:00:00.000Z',
                  '2011-03-02T00:00:00.000Z',
                  '2011-03-07T00:00:00.000Z',
                  '2011-03-12T00:00:00.000Z',
                  '2011-03-17T00:00:00.000Z',
                  '2011-03-22T00:00:00.000Z',
                  '2011-03-27T00:00:00.000Z',
                  '2011-04-01T00:00:00.000Z',
                  '2011-04-06T00:00:00.000Z',
                  '2011-04-11T00:00:00.000Z',
                  '2011-04-16T00:00:00.000Z',
                  '2011-04-21T00:00:00.000Z',
                  '2011-04-26T00:00:00.000Z',
                  '2011-05-01T00:00:00.000Z',
                  '2011-05-06T00:00:00.000Z',
                  '2011-05-11T00:00:00.000Z',
                  '2011-05-16T00:00:00.000Z',
                  '2011-05-21T00:00:00.000Z',
                  '2011-05-26T00:00:00.000Z',
                  '2011-05-31T00:00:00.000Z',
                  '2011-06-05T00:00:00.000Z',
                  '2011-06-10T00:00:00.000Z',
                  '2011-06-15T00:00:00.000Z',
                  '2011-06-20T00:00:00.000Z',
                  '2011-06-25T00:00:00.000Z',
                  '2011-06-30T00:00:00.000Z',
                  '2011-07-05T00:00:00.000Z',
                  '2011-07-10T00:00:00.000Z',
                  '2011-07-15T00:00:00.000Z',
                  '2011-07-20T00:00:00.000Z',
                  '2011-07-25T00:00:00.000Z',
                  '2011-07-30T00:00:00.000Z',
                  '2011-08-04T00:00:00.000Z',
                  '2011-08-09T00:00:00.000Z',
                  '2011-08-14T00:00:00.000Z',
                  '2011-08-19T00:00:00.000Z',
                  '2011-08-24T00:00:00.000Z',
                  '2011-08-29T00:00:00.000Z',
                  '2011-09-03T00:00:00.000Z',
                  '2011-09-08T00:00:00.000Z',
                  '2011-09-13T00:00:00.000Z',
                  '2011-09-18T00:00:00.000Z',
                  '2011-09-23T00:00:00.000Z',
                  '2011-09-28T00:00:00.000Z',
                  '2011-10-03T00:00:00.000Z',
                  '2011-10-08T00:00:00.000Z',
                  '2011-10-13T00:00:00.000Z',
                  '2011-10-18T00:00:00.000Z',
                  '2011-10-23T00:00:00.000Z',
                  '2011-10-28T00:00:00.000Z',
                  '2011-11-02T00:00:00.000Z',
                  '2011-11-07T00:00:00.000Z',
                  '2011-11-12T00:00:00.000Z',
                  '2011-11-17T00:00:00.000Z',
                  '2011-11-22T00:00:00.000Z',
                  '2011-11-27T00:00:00.000Z',
                  '2011-12-02T00:00:00.000Z',
                  '2011-12-07T00:00:00.000Z',
                  '2011-12-12T00:00:00.000Z',
                  '2011-12-17T00:00:00.000Z',
                  '2011-12-22T00:00:00.000Z',
                  '2011-12-27T00:00:00.000Z',
                  '2012-01-01T00:00:00.000Z',
                  '2012-01-06T00:00:00.000Z',
                  '2012-01-11T00:00:00.000Z',
                  '2012-01-16T00:00:00.000Z',
                  '2012-01-21T00:00:00.000Z',
                  '2012-01-26T00:00:00.000Z',
                  '2012-01-31T00:00:00.000Z',
                  '2012-02-05T00:00:00.000Z',
                  '2012-02-10T00:00:00.000Z',
                  '2012-02-15T00:00:00.000Z',
                  '2012-02-20T00:00:00.000Z',
                  '2012-02-25T00:00:00.000Z',
                  '2012-03-01T00:00:00.000Z',
                  '2012-03-06T00:00:00.000Z',
                  '2012-03-11T00:00:00.000Z',
                  '2012-03-16T00:00:00.000Z',
                  '2012-03-21T00:00:00.000Z',
                  '2012-03-26T00:00:00.000Z',
                  '2012-03-31T00:00:00.000Z',
                  '2012-04-05T00:00:00.000Z',
                  '2012-04-10T00:00:00.000Z',
                  '2012-04-15T00:00:00.000Z',
                  '2012-04-20T00:00:00.000Z',
                  '2012-04-25T00:00:00.000Z',
                  '2012-04-30T00:00:00.000Z',
                  '2012-05-05T00:00:00.000Z',
                  '2012-05-10T00:00:00.000Z',
                  '2012-05-15T00:00:00.000Z',
                  '2012-05-20T00:00:00.000Z',
                  '2012-05-25T00:00:00.000Z',
                  '2012-05-30T00:00:00.000Z',
                  '2012-06-04T00:00:00.000Z',
                  '2012-06-09T00:00:00.000Z',
                  '2012-06-14T00:00:00.000Z',
                  '2012-06-19T00:00:00.000Z',
                  '2012-06-24T00:00:00.000Z',
                  '2012-06-29T00:00:00.000Z',
                  '2012-07-04T00:00:00.000Z',
                  '2012-07-09T00:00:00.000Z',
                  '2012-07-14T00:00:00.000Z',
                  '2012-07-19T00:00:00.000Z',
                  '2012-07-24T00:00:00.000Z',
                  '2012-07-29T00:00:00.000Z',
                  '2012-08-03T00:00:00.000Z',
                  '2012-08-08T00:00:00.000Z',
                  '2012-08-13T00:00:00.000Z',
                  '2012-08-18T00:00:00.000Z',
                  '2012-08-23T00:00:00.000Z',
                  '2012-08-28T00:00:00.000Z',
                  '2012-09-02T00:00:00.000Z',
                  '2012-09-07T00:00:00.000Z',
                  '2012-09-12T00:00:00.000Z',
                  '2012-09-17T00:00:00.000Z',
                  '2012-09-22T00:00:00.000Z',
                  '2012-09-27T00:00:00.000Z',
                  '2012-10-02T00:00:00.000Z',
                  '2012-10-07T00:00:00.000Z',
                  '2012-10-12T00:00:00.000Z',
                  '2012-10-17T00:00:00.000Z',
                  '2012-10-22T00:00:00.000Z',
                  '2012-10-27T00:00:00.000Z',
                  '2012-11-01T00:00:00.000Z',
                  '2012-11-06T00:00:00.000Z',
                  '2012-11-11T00:00:00.000Z',
                  '2012-11-16T00:00:00.000Z',
                  '2012-11-21T00:00:00.000Z',
                  '2012-11-26T00:00:00.000Z',
                  '2012-12-01T00:00:00.000Z',
                  '2012-12-06T00:00:00.000Z',
                  '2012-12-11T00:00:00.000Z',
                  '2012-12-16T00:00:00.000Z',
                  '2012-12-21T00:00:00.000Z',
                  '2012-12-26T00:00:00.000Z',
                  '2012-12-31T00:00:00.000Z',
                  '2013-01-01T00:00:00.000Z',
                  '2013-01-06T00:00:00.000Z',
                  '2013-01-11T00:00:00.000Z',
                  '2013-01-16T00:00:00.000Z',
                  '2013-01-21T00:00:00.000Z',
                  '2013-01-26T00:00:00.000Z',
                  '2013-01-31T00:00:00.000Z',
                  '2013-02-05T00:00:00.000Z',
                  '2013-02-10T00:00:00.000Z',
                  '2013-02-15T00:00:00.000Z',
                  '2013-02-20T00:00:00.000Z',
                  '2013-02-25T00:00:00.000Z',
                  '2013-03-02T00:00:00.000Z',
                  '2013-03-07T00:00:00.000Z',
                  '2013-03-12T00:00:00.000Z',
                  '2013-03-17T00:00:00.000Z',
                  '2013-03-22T00:00:00.000Z',
                  '2013-03-27T00:00:00.000Z',
                  '2013-04-01T00:00:00.000Z',
                  '2013-04-06T00:00:00.000Z',
                  '2013-04-11T00:00:00.000Z',
                  '2013-04-16T00:00:00.000Z',
                  '2013-04-21T00:00:00.000Z',
                  '2013-04-26T00:00:00.000Z',
                  '2013-05-01T00:00:00.000Z',
                  '2013-05-06T00:00:00.000Z',
                  '2013-05-11T00:00:00.000Z',
                  '2013-05-16T00:00:00.000Z',
                  '2013-05-21T00:00:00.000Z',
                  '2013-05-26T00:00:00.000Z',
                  '2013-05-31T00:00:00.000Z',
                  '2013-06-05T00:00:00.000Z',
                  '2013-06-10T00:00:00.000Z',
                  '2013-06-15T00:00:00.000Z',
                  '2013-06-20T00:00:00.000Z',
                  '2013-06-25T00:00:00.000Z',
                  '2013-06-30T00:00:00.000Z',
                  '2013-07-05T00:00:00.000Z',
                  '2013-07-10T00:00:00.000Z',
                  '2013-07-15T00:00:00.000Z',
                  '2013-07-20T00:00:00.000Z',
                  '2013-07-25T00:00:00.000Z',
                  '2013-07-30T00:00:00.000Z',
                  '2013-08-04T00:00:00.000Z',
                  '2013-08-09T00:00:00.000Z',
                  '2013-08-14T00:00:00.000Z',
                  '2013-08-19T00:00:00.000Z',
                  '2013-08-24T00:00:00.000Z',
                  '2013-08-29T00:00:00.000Z',
                  '2013-09-03T00:00:00.000Z',
                  '2013-09-08T00:00:00.000Z',
                  '2013-09-13T00:00:00.000Z',
                  '2013-09-18T00:00:00.000Z',
                  '2013-09-23T00:00:00.000Z',
                  '2013-09-28T00:00:00.000Z',
                  '2013-10-03T00:00:00.000Z',
                  '2013-10-08T00:00:00.000Z',
                  '2013-10-13T00:00:00.000Z',
                  '2013-10-18T00:00:00.000Z',
                  '2013-10-23T00:00:00.000Z',
                  '2013-10-28T00:00:00.000Z',
                  '2013-11-02T00:00:00.000Z',
                  '2013-11-07T00:00:00.000Z',
                  '2013-11-12T00:00:00.000Z',
                  '2013-11-17T00:00:00.000Z',
                  '2013-11-22T00:00:00.000Z',
                  '2013-11-27T00:00:00.000Z',
                  '2013-12-02T00:00:00.000Z',
                  '2013-12-07T00:00:00.000Z',
                  '2013-12-12T00:00:00.000Z',
                  '2013-12-17T00:00:00.000Z',
                  '2013-12-22T00:00:00.000Z',
                  '2013-12-27T00:00:00.000Z',
                  '2014-01-01T00:00:00.000Z',
                  '2014-01-06T00:00:00.000Z',
                  '2014-01-11T00:00:00.000Z',
                  '2014-01-16T00:00:00.000Z',
                  '2014-01-21T00:00:00.000Z',
                  '2014-01-26T00:00:00.000Z',
                  '2014-01-31T00:00:00.000Z',
                  '2014-02-05T00:00:00.000Z',
                  '2014-02-10T00:00:00.000Z',
                  '2014-02-15T00:00:00.000Z',
                  '2014-02-20T00:00:00.000Z',
                  '2014-02-25T00:00:00.000Z',
                  '2014-03-02T00:00:00.000Z',
                  '2014-03-07T00:00:00.000Z',
                  '2014-03-12T00:00:00.000Z',
                  '2014-03-17T00:00:00.000Z',
                  '2014-03-22T00:00:00.000Z',
                  '2014-03-27T00:00:00.000Z',
                  '2014-04-01T00:00:00.000Z',
                  '2014-04-06T00:00:00.000Z',
                  '2014-04-11T00:00:00.000Z',
                  '2014-04-16T00:00:00.000Z',
                  '2014-04-21T00:00:00.000Z',
                  '2014-04-26T00:00:00.000Z',
                  '2014-05-01T00:00:00.000Z',
                  '2014-05-06T00:00:00.000Z',
                  '2014-05-11T00:00:00.000Z',
                  '2014-05-16T00:00:00.000Z',
                  '2014-05-21T00:00:00.000Z',
                  '2014-05-26T00:00:00.000Z',
                  '2014-05-31T00:00:00.000Z',
                  '2014-06-05T00:00:00.000Z',
                  '2014-06-10T00:00:00.000Z',
                  '2014-06-15T00:00:00.000Z',
                  '2014-06-20T00:00:00.000Z',
                  '2014-06-25T00:00:00.000Z',
                  '2014-06-30T00:00:00.000Z',
                  '2014-07-05T00:00:00.000Z',
                  '2014-07-10T00:00:00.000Z',
                  '2014-07-15T00:00:00.000Z',
                  '2014-07-20T00:00:00.000Z',
                  '2014-07-25T00:00:00.000Z',
                  '2014-07-30T00:00:00.000Z',
                  '2014-08-04T00:00:00.000Z',
                  '2014-08-09T00:00:00.000Z',
                  '2014-08-14T00:00:00.000Z',
                  '2014-08-19T00:00:00.000Z',
                  '2014-08-24T00:00:00.000Z',
                  '2014-08-29T00:00:00.000Z',
                  '2014-09-03T00:00:00.000Z',
                  '2014-09-08T00:00:00.000Z',
                  '2014-09-13T00:00:00.000Z',
                  '2014-09-18T00:00:00.000Z',
                  '2014-09-23T00:00:00.000Z',
                  '2014-09-28T00:00:00.000Z',
                  '2014-10-03T00:00:00.000Z',
                  '2014-10-08T00:00:00.000Z',
                  '2014-10-13T00:00:00.000Z',
                  '2014-10-18T00:00:00.000Z',
                  '2014-10-23T00:00:00.000Z',
                  '2014-10-28T00:00:00.000Z',
                  '2014-11-02T00:00:00.000Z',
                  '2014-11-07T00:00:00.000Z',
                  '2014-11-12T00:00:00.000Z',
                  '2014-11-17T00:00:00.000Z',
                  '2014-11-22T00:00:00.000Z',
                  '2014-11-27T00:00:00.000Z',
                  '2014-12-02T00:00:00.000Z',
                  '2014-12-07T00:00:00.000Z',
                  '2014-12-12T00:00:00.000Z',
                  '2014-12-17T00:00:00.000Z',
                  '2014-12-22T00:00:00.000Z',
                  '2014-12-27T00:00:00.000Z',
                  '2015-01-01T00:00:00.000Z',
                  '2015-01-06T00:00:00.000Z',
                  '2015-01-11T00:00:00.000Z',
                  '2015-01-16T00:00:00.000Z',
                  '2015-01-21T00:00:00.000Z',
                  '2015-01-26T00:00:00.000Z',
                  '2015-01-31T00:00:00.000Z',
                  '2015-02-05T00:00:00.000Z',
                  '2015-02-10T00:00:00.000Z',
                  '2015-02-15T00:00:00.000Z',
                  '2015-02-20T00:00:00.000Z',
                  '2015-02-25T00:00:00.000Z',
                  '2015-03-02T00:00:00.000Z',
                  '2015-03-07T00:00:00.000Z',
                  '2015-03-12T00:00:00.000Z',
                  '2015-03-17T00:00:00.000Z',
                  '2015-03-22T00:00:00.000Z',
                  '2015-03-27T00:00:00.000Z',
                  '2015-04-01T00:00:00.000Z',
                  '2015-04-06T00:00:00.000Z',
                  '2015-04-11T00:00:00.000Z',
                  '2015-04-16T00:00:00.000Z',
                  '2015-04-21T00:00:00.000Z',
                  '2015-04-26T00:00:00.000Z',
                  '2015-05-01T00:00:00.000Z',
                  '2015-05-06T00:00:00.000Z',
                  '2015-05-11T00:00:00.000Z',
                  '2015-05-16T00:00:00.000Z',
                  '2015-05-21T00:00:00.000Z',
                  '2015-05-26T00:00:00.000Z',
                  '2015-05-31T00:00:00.000Z',
                  '2015-06-05T00:00:00.000Z',
                  '2015-06-10T00:00:00.000Z',
                  '2015-06-15T00:00:00.000Z',
                  '2015-06-20T00:00:00.000Z',
                  '2015-06-25T00:00:00.000Z',
                  '2015-06-30T00:00:00.000Z',
                  '2015-07-05T00:00:00.000Z',
                  '2015-07-10T00:00:00.000Z',
                  '2015-07-15T00:00:00.000Z',
                  '2015-07-20T00:00:00.000Z',
                  '2015-07-25T00:00:00.000Z',
                  '2015-07-30T00:00:00.000Z',
                  '2015-08-04T00:00:00.000Z',
                  '2015-08-09T00:00:00.000Z',
                  '2015-08-14T00:00:00.000Z',
                  '2015-08-19T00:00:00.000Z',
                  '2015-08-24T00:00:00.000Z',
                  '2015-08-29T00:00:00.000Z',
                  '2015-09-03T00:00:00.000Z',
                  '2015-09-08T00:00:00.000Z',
                  '2015-09-13T00:00:00.000Z',
                  '2015-09-18T00:00:00.000Z',
                  '2015-09-23T00:00:00.000Z',
                  '2015-09-28T00:00:00.000Z',
                  '2015-10-03T00:00:00.000Z',
                  '2015-10-08T00:00:00.000Z',
                  '2015-10-13T00:00:00.000Z',
                  '2015-10-18T00:00:00.000Z',
                  '2015-10-23T00:00:00.000Z',
                  '2015-10-28T00:00:00.000Z',
                  '2015-11-02T00:00:00.000Z',
                  '2015-11-07T00:00:00.000Z',
                  '2015-11-12T00:00:00.000Z',
                  '2015-11-17T00:00:00.000Z',
                  '2015-11-22T00:00:00.000Z',
                  '2015-11-27T00:00:00.000Z',
                  '2015-12-02T00:00:00.000Z',
                  '2015-12-07T00:00:00.000Z',
                  '2015-12-12T00:00:00.000Z',
                  '2015-12-17T00:00:00.000Z',
                  '2015-12-22T00:00:00.000Z',
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

  describe('test setup completion', function() {
    it('should find the Geona object on the window', function() {
      expect(window.geonaLeafTest).to.be.an('object');
    });
    it('should find that the variable \'geona\' points to the Geona object on the window', function() {
      expect(geona).to.deep.equal(window.geonaLeafTest);
    });
    it('should find seven layers in _availableLayers', function() {
      let availableLayersArray = Object.keys(geona.map._availableLayers);
      expect(availableLayersArray.length).to.equal(7);
    });
    it('should find attribution prefix', function() {
      expect(geona.map._map.attributionControl.options.prefix).to.equal('<a href="http://leafletjs.com/"> <img border="0" width="10px" height="10px" target="_blank" alt="Leaflet" src="https://raw.githubusercontent.com/Leaflet/Leaflet/master/docs/docs/images/favicon.ico"></a> Geona');
    });
  });

  describe('addLayer()', function() {
    // The data layer we are adding to the map
    let dataLayer;
    // The list of layers on the map - could replace _mapLayers?
    let mapLayers;

    before(function() {
      dataLayer = geona.map._availableLayers.Rrs_412;
      geona.map.addLayer(dataLayer, {modifier: 'hasTime'});
    });

    it('should have added a data layer to the map', function() {
      mapLayers = geona.map._mapLayers;
      // Also tests that there isn't another layer on the map (index 0 should be the only one with data)
      expect(mapLayers.getLayers()[0].options.identifier).to.equal(dataLayer.identifier);
    });
    it('should have added that layer to _availableLayers', function() {
      expect(geona.map._availableLayers[dataLayer.identifier]).to.not.be.undefined;
    });
    it('should have added that layer to _mapLayers', function() {
      let identifiedLayer;
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.identifier === dataLayer.identifier) {
          identifiedLayer = layer;
        }
      }
      expect(identifiedLayer).to.not.be.undefined;
    });
    it('should only have one layer on the map', function() {
      expect(geona.map._mapLayers.getLayers().length).to.equal(1);
    });
    it('should add the basemap modifier to basemaps', function() {
      geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.identifier === 'terrain-light') {
          expect(layer.options.modifier).to.equal('basemap');
        }
      }
    });
    it('should display the correct attribution for basemaps', function() {
      let html = Object.keys(geona.map._map.attributionControl._attributions)[0];
      expect(html).to.deep.equal(geona.map.config.basemapLayers[0].attribution.onlineResource);
    });
    it('should add the borders modifier to borders layers', function() {
      geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.identifier === 'line_black') {
          expect(layer.options.modifier).to.equal('borders');
        }
      }
    });
    it('should remove the previous basemap when a new basemap is added', function() {
      geona.map.addLayer(geona.map._availableLayers.s2cloudless, {modifier: 'basemap'});
      let identifiers = [];
      for (let layer of geona.map._mapLayers.getLayers()) {
        identifiers.push(layer.options.identifier);
      }
      // Amount of expects might be a bit overkill
      expect(identifiers).to.include('s2cloudless');
      expect(identifiers).to.not.include('terrain-light');
      let numberOfBasemapModifiers = 0;
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.modifier === 'basemap') {
          numberOfBasemapModifiers += 1;
          expect(numberOfBasemapModifiers).to.equal(1);
        }
      }
    });
    it('should remove the previous borders when a new borders layer is added', function() {
      geona.map.addLayer(geona.map._availableLayers.line, {modifier: 'borders'});
      let identifiers = [];
      for (let layer of geona.map._mapLayers.getLayers()) {
        identifiers.push(layer.options.identifier);
      }
      // Amount of expects might be a bit overkill
      expect(identifiers).to.include('line');
      expect(identifiers).to.not.include('line_black');
      let numberOfBordersModifiers = 0;
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.modifier === 'borders') {
          numberOfBordersModifiers += 1;
          expect(numberOfBordersModifiers).to.equal(1);
        }
      }
    });
  });

  describe('_mapLayers', function() {
    it('should only contain tile layers', function() {
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.crs === undefined) {
          expect.fail(
            'Layer CRS is undefined',
            'Tile layers should have a CRS',
            `_mapLayers should only contain tile layers. Check _mapLayers for unexpected layers.
             It may also be the case that the assumption that a tile layer should have a CRS is incorrect - in
             this case, the logic in addLayer() should be updated.`
          );
        }
      }
    });
  });

  describe('removeLayer()', function() {
    let data;
    let basemap;
    let borders;

    before(function() {
      for (let layer of geona.map._mapLayers.getLayers()) {
        if (layer.options.modifier === undefined || layer.options.modifier === 'hasTime') {
          data = layer;
        } else if (layer.options.modifier === 'basemap') {
          basemap = layer;
        } else if (layer.options.modifier === 'borders') {
          borders = layer;
        }
      }
    });

    it('should remove the layer from the map', function() {
      geona.map.removeLayer(data.options.identifier);

      let layerKeys = Object.keys(geona.map._map._layers);
      for (let layer of layerKeys) {
        if (layer.options !== undefined) {
          expect(layer.options.identifier).to.not.be(data.options.identifier);
        }
      }
    });
    it('should remove the layer from the _mapLayers', function() {
      expect(geona.map._mapLayers.getLayers()).to.not.include(data);
    });
    it('should remove the basemap from the map', function() {
      geona.map.removeLayer(basemap.options.identifier);
      let layerKeys = Object.keys(geona.map._map._layers);
      for (let layer of layerKeys) {
        if (layer.options !== undefined) {
          expect(layer.options.identifier).to.not.be(basemap.options.identifier);
        }
      }
    });
    it('should remove the basemap from the _mapLayers', function() {
      expect(geona.map._mapLayers.getLayers()).to.not.include(basemap);
    });
    it('should set the config basemap to be \'none\'', function() {
      expect(geona.map.config.basemap).to.equal('none');
    });
    it('should remove the borders from the map', function() {
      geona.map.removeLayer(borders.options.identifier);
      let layerKeys = Object.keys(geona.map._map._layers);
      for (let layer of layerKeys) {
        if (layer.options !== undefined) {
          expect(layer.options.identifier).to.not.be(basemap.options.identifier);
        }
      }
    });
    it('should remove the borders from the _mapLayers', function() {
      expect(geona.map._mapLayers.getLayers()).to.not.include(borders);
    });
    it('should set the config borders to be \'none\'', function() {
      expect(geona.map.config.borders).to.equal('none');
    });
  });

  describe('reorderLayers()', function() {
    describe('reordering - 1x basemap, 1x borders, 0x data', function() {
      before(function() {
        // Basic setup with one basemap and one borders layer.
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
        geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex < lowestZIndex) {
            lowestZIndex = layer.options.zIndex;
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 0) {
            expect(layer.options.modifier).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 1', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex > highestZIndex) {
            highestZIndex = layer.options.zIndex;
          }
        }
        expect(highestZIndex).to.equal(1);
      });
      it('should find a borders layer at zIndex 1', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 1) {
            expect(layer.options.modifier).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._mapLayers.getLayers()) {
          allZIndices.push(layer.options.zIndex);
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
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
        geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
        geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex < lowestZIndex) {
            lowestZIndex = layer.options.zIndex;
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 0) {
            expect(layer.options.modifier).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 2', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex > highestZIndex) {
            highestZIndex = layer.options.zIndex;
          }
        }
        expect(highestZIndex).to.equal(2);
      });
      it('should find a borders layer at zIndex 2', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 2) {
            expect(layer.options.modifier).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, 2, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._mapLayers.getLayers()) {
          allZIndices.push(layer.options.zIndex);
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
        geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
        geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex < lowestZIndex) {
            lowestZIndex = layer.options.zIndex;
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 0) {
            expect(layer.options.modifier).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 2', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex > highestZIndex) {
            highestZIndex = layer.options.zIndex;
          }
        }
        expect(highestZIndex).to.equal(2);
      });
      it('should find a borders layer at zIndex 2', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 2) {
            expect(layer.options.modifier).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, 2, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._mapLayers.getLayers()) {
          allZIndices.push(layer.options.zIndex);
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
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
        geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
        geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
        geona.map.removeLayer('terrain-light');
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex < lowestZIndex) {
            lowestZIndex = layer.options.zIndex;
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a data layer at zIndex 0', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 0) {
            expect(layer.options.modifier).to.equal('hasTime');
          }
        }
      });
      it('should have set the highest zIndex to be 1', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex > highestZIndex) {
            highestZIndex = layer.options.zIndex;
          }
        }
        expect(highestZIndex).to.equal(1);
      });
      it('should find a borders layer at zIndex 1', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 1) {
            expect(layer.options.modifier).to.equal('borders');
          }
        }
      });
      it('should find zIndex values of 0, 1, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._mapLayers.getLayers()) {
          allZIndices.push(layer.options.zIndex);
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
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
        geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
        geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
        geona.map.removeLayer('line_black');
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex < lowestZIndex) {
            lowestZIndex = layer.options.zIndex;
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 0) {
            expect(layer.options.modifier).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 1', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex > highestZIndex) {
            highestZIndex = layer.options.zIndex;
          }
        }
        expect(highestZIndex).to.equal(1);
      });
      it('should find a data layer at zIndex 1', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 1) {
            expect(layer.options.modifier).to.equal('hasTime');
          }
        }
      });
      it('should find zIndex values of 0, 1, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._mapLayers.getLayers()) {
          allZIndices.push(layer.options.zIndex);
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
        geona.map.addLayer(geona.map._availableLayers.line_black, {modifier: 'borders'});
        geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
        geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
        geona.map.addLayer(geona.map._availableLayers.Rrs_443, {modifier: 'hasTime'});
        geona.map.addLayer(geona.map._availableLayers.Rrs_490, {modifier: 'hasTime'});
      });

      it('should have set the lowest zIndex to be 0', function() {
        let lowestZIndex = 999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex < lowestZIndex) {
            lowestZIndex = layer.options.zIndex;
          }
        }
        expect(lowestZIndex).to.equal(0);
      });
      it('should find a basemap at zIndex 0', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 0) {
            expect(layer.options.modifier).to.equal('basemap');
          }
        }
      });
      it('should have set the highest zIndex to be 4', function() {
        let highestZIndex = -999;
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex > highestZIndex) {
            highestZIndex = layer.options.zIndex;
          }
        }
        expect(highestZIndex).to.equal(4);
      });
      it('should find a data layer at zIndex 4', function() {
        for (let layer of geona.map._mapLayers.getLayers()) {
          if (layer.options.zIndex === 1) {
            expect(layer.options.modifier).to.equal('hasTime');
          }
        }
      });
      it('should find zIndex values of 0, 1, 2, 3, 4, not necessarily in that order', function() {
        let allZIndices = [];
        for (let layer of geona.map._mapLayers.getLayers()) {
          allZIndices.push(layer.options.zIndex);
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

  describe('loadNearestValidTime', function() {
    // These variables are used as shorthand for the layers in the tests.
    // They are redefined in each test to keep them up-to-date with any changes we make during the tests.
    let rrs412;
    let rrs490;

    before(function() {
      // Add a basemap, two data layers, and a borders layer.
      geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
      geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
      geona.map.addLayer(geona.map._availableLayers.Rrs_490, {modifier: 'hasTime'});
      geona.map.addLayer(geona.map._availableLayers.line, {modifier: 'borders'});
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
      expect(rrs412.options.layerTime).to.equal('2015-12-27T00:00:00.000Z');
    });
    it('should find that the layer time for the second layer added is set to the nearest valid time as the first layer', function() {
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.options.layerTime).to.equal('2015-12-27T00:00:00.000Z');
    });
    it('should change the Rrs_412 layer time to 1998-01-01T00:00:00.000Z', function() {
      geona.map.loadNearestValidTime('Rrs_412', '1998-01-01T00:00:00.000Z');
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.options.layerTime).to.equal('1998-01-01T00:00:00.000Z');
    });
    it('should change the Rrs_490 layer time to 2001-04-01T00:00:00.000Z', function() {
      geona.map.loadNearestValidTime('Rrs_490', '2001-04-01T00:00:00.000Z');
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.options.layerTime).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should hide the layers because there is no valid time', function() {
      geona.map.loadNearestValidTime('Rrs_490', '1900-12-27T00:00:00.000Z');
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.options.opacity).to.equal(0);
      expect(rrs490.options.shown).to.equal(true);

      // For the purposes of the next tests, we will hide this layer before moving it to the invalid time
      geona.map.hideLayer('Rrs_412');
      geona.map.loadNearestValidTime('Rrs_412', '1900-12-27T00:00:00.000Z');
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.options.opacity).to.equal(0);
      expect(rrs412.options.shown).to.equal(false);
    });
    it('should keep the layer times the same as their previous time after being hidden', function() {
      rrs490 = geona.map._activeLayers.Rrs_490;
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs490.options.layerTime).to.equal('2001-04-01T00:00:00.000Z');
      expect(rrs412.options.layerTime).to.equal('1998-01-01T00:00:00.000Z');
    });
    it('should have set the map time to the requested time because there is no valid time', function() {
      expect(geona.map._mapTime).to.equal('1900-12-27T00:00:00.000Z');
    });
    it('should make the layer visible', function() {
      geona.map.loadNearestValidTime('Rrs_490', '2010-01-01T00:00:00.000Z');
      rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs490.options.opacity).to.equal(1);
      expect(rrs490.options.shown).to.equal(true);
    });
    it('should have set the map time to the time of the only visible layer', function() {
      expect(geona.map._mapTime).to.equal('2008-08-08T00:00:00.000Z');
    });
    it('should keep the layer hidden if the layer had been hidden prior to moving out of valid time', function() {
      // This test relies on layer Rrs_412 being hidden prior to moving out of valid time
      geona.map.loadNearestValidTime('Rrs_412', '1998-01-01T00:00:00.000Z');
      rrs412 = geona.map._activeLayers.Rrs_412;
      expect(rrs412.options.opacity).to.equal(0);
      expect(rrs412.options.shown).to.equal(false);
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
      geona.map.addLayer(geona.map._availableLayers['terrain-light'], {modifier: 'basemap'});
      geona.map.addLayer(geona.map._availableLayers.Rrs_412, {modifier: 'hasTime'});
      geona.map.addLayer(geona.map._availableLayers.Rrs_490, {modifier: 'hasTime'});
      geona.map.addLayer(geona.map._availableLayers.line, {modifier: 'borders'});
    });

    it('should set the layers to valid times', function() {
      geona.map.loadLayersToNearestValidTime('2001-04-01T00:00:00.000Z');
      let rrs412 = geona.map._activeLayers.Rrs_412;
      let rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs412.options.layerTime).to.equal('1998-01-01T00:00:00.000Z');
      expect(rrs490.options.layerTime).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should set the map time to 2001-04-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should hide both layers', function() {
      geona.map.loadLayersToNearestValidTime('1900-01-01T00:00:00.000Z');
      let rrs412 = geona.map._activeLayers.Rrs_412;
      let rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs412.options.opacity).to.equal(0);
      expect(rrs490.options.opacity).to.equal(0);
    });
    it('should set the map time to 1900-01-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('1900-01-01T00:00:00.000Z');
    });
    it('should hide both layers', function() {
      geona.map.loadLayersToNearestValidTime('2200-01-01T00:00:00.000Z');
      let rrs412 = geona.map._activeLayers.Rrs_412;
      let rrs490 = geona.map._activeLayers.Rrs_490;
      expect(rrs412.options.opacity).to.equal(0);
      expect(rrs490.options.opacity).to.equal(0);
    });
    it('should set the map time to 2200-01-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('2200-01-01T00:00:00.000Z');
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

      let firstMapLayer = geona.map._mapLayers.getLayers()[0];
      expect(firstMapLayer.options.identifier).to.equal(wmsLayers.layers[0].identifier);
    });
    // TODO add test for saving layers once functionality implemented
    // it('should save the layers found', function() {});

    after(function() {
      // Clear all layers from the map
      let layer = geona.map._mapLayers.getLayers()[0];
      geona.map.removeLayer(layer.options.identifier);
    });
  });
});
