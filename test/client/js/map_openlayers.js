import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
// import fs from 'fs';

import 'jquery';
import {load} from '../../../src/client_loader/loader.js';

import {getLayerServer} from '../../../src/client/js/map_common.js';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
let expect = chai.expect;

// TODO tests for all functions using WMTS layers (esp. time)
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

    // let config1 = JSON.parse(fs.readFile('/local1/data/scratch/git/web-development/gp2-contribution-guide/test_dependencies/resources/client/js/openlayers_map_config_1.json', 'utf8', (err) => {
    //   // if (err !== null) {
    //   //   res.status(404).send('File not found');
    //   // } else {
    //   //   res.sendFile(searchFile);
    //   // }
    // }));

    let config1 = {
      'geonaVariable': 'geonaOlTest',
      'onReadyCallback': 'geonaOnReady',
      'geonaServer': 'http://192.171.164.90:7890',
      'divId': 'oltest',
      'map': {
        'library': 'openlayers',
        'graticule': true,
        'bingMapsApiKey': 'AgNtBFpBNF81T-ODIf_9WzE8UF_epbsfiSu9RYMbLfq_wXU_bBVAoyBw8VzfSjkd',
        'basemap': 'none',
        'borders': {
          'identifier': 'none',
          'style': 'none',
        },
        'data': [],
        'basemapLayers': [
          {
            'identifier': 'https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities',
            'version': '1.1.1',
            'url': 'https://tiles.maps.eox.at/wms/?',
            'layers': [
              {
                'protocol': 'wms',
                'identifier': 'terrain-light',
                'modifier': 'basemap',
                'title': {
                  'und': 'EOX',
                },
                'attribution': {
                  'title': 'EOX',
                  'onlineResource': 'Terrain Light { Data &copy; <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> contributors and <a href=\'#data\'>others</a>, Rendering &copy; <a href=\'http://eox.at\'>EOX</a>',
                },
                'projections': [
                  'EPSG:4326',
                ],
                'formats': [
                  'image/jpeg',
                ],
                'isTemporal': false,
                'layerServer': 'https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities',
                'viewSettings': {
                  'maxZoom': 13,
                },
              },
            ],
          },
          {
            'identifier': 'https__www.gebco.net_data_and_products_gebco_web_services_web_map_service_mapserv__wms_1.1.1_getcapabilities',
            'version': '1.1.1',
            'url': 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
            'layers': [
              {
                'protocol': 'wms',
                'identifier': 'gebco_08_grid',
                'modifier': 'basemap',
                'title': {
                  'und': 'GEBCO',
                },
                'attribution': {
                  'title': 'GEBCO',
                  'onlineResource': 'Imagery reproduced from the GEBCO_2014 Grid, version 20150318, www.gebco.net',
                },
                'projections': ['EPSG:4326', 'EPSG:3857'],
                'formats': ['image/jpeg'],
                'isTemporal': false,
                'layerServer': 'https__www.gebco.net_data_and_products_gebco_web_services_web_map_service_mapserv__wms_1.1.1_getcapabilities',
                'viewSettings': {
                  'maxZoom': 7,
                },
              },
            ],
          },
        ],
        'bordersLayers': [
          {
            'identifier': 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
            'version': '1.1.0',
            'url': 'https://rsg.pml.ac.uk/geoserver/wms?',
            'layers': [
              {
                'identifier': 'rsg:full_10m_borders',
                'protocol': 'wms',
                'modifier': 'borders',
                'title': {
                  'und': 'Country border lines',
                },
                'projections': [
                  'EPSG:4326',
                  'EPSG:3857',
                ],
                'formats': [
                  'image/png',
                ],
                'isTemporal': false,
                'styles': [
                  {
                    'name': 'line_black',
                  },
                  {
                    'name': 'line-white',
                  },
                  {
                    'name': 'line',
                  },
                ],
                'layerServer': 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
              },
            ],
          },
        ],
        'dataLayers': [
          {
            'identifier': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities',
            'version': '1.3.0',
            'url': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY',
            'layers': [
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
                    'identifier': 'boxfill/cmocean_speed',
                    'title': {
                      'und': 'boxfill/cmocean_speed',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_speed palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/ncview',
                    'title': {
                      'und': 'boxfill/ncview',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the ncview palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/occam',
                    'title': {
                      'und': 'boxfill/occam',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the occam palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_algae',
                    'title': {
                      'und': 'boxfill/cmocean_algae',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_algae palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_oxy',
                    'title': {
                      'und': 'boxfill/cmocean_oxy',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_oxy palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_haline',
                    'title': {
                      'und': 'boxfill/cmocean_haline',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_haline palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/sst_36',
                    'title': {
                      'und': 'boxfill/sst_36',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the sst_36 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_dense',
                    'title': {
                      'und': 'boxfill/cmocean_dense',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_dense palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/orange-descending',
                    'title': {
                      'und': 'boxfill/orange-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the orange-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cci_blue_red',
                    'title': {
                      'und': 'boxfill/cci_blue_red',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cci_blue_red palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_turbid',
                    'title': {
                      'und': 'boxfill/cmocean_turbid',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_turbid palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_tempo',
                    'title': {
                      'und': 'boxfill/cmocean_tempo',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_tempo palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_deep',
                    'title': {
                      'und': 'boxfill/cmocean_deep',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_deep palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_curl',
                    'title': {
                      'und': 'boxfill/cmocean_curl',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_curl palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_thermal',
                    'title': {
                      'und': 'boxfill/cmocean_thermal',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_thermal palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/blue-descending',
                    'title': {
                      'und': 'boxfill/blue-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the blue-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/redblue-reverse',
                    'title': {
                      'und': 'boxfill/redblue-reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the redblue-reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/soil-moisture',
                    'title': {
                      'und': 'boxfill/soil-moisture',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the soil-moisture palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_phase',
                    'title': {
                      'und': 'boxfill/cmocean_phase',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_phase palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/alg',
                    'title': {
                      'und': 'boxfill/alg',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the alg palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cci_main',
                    'title': {
                      'und': 'boxfill/cci_main',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cci_main palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/orange',
                    'title': {
                      'und': 'boxfill/orange',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the orange palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/greyscale',
                    'title': {
                      'und': 'boxfill/greyscale',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the greyscale palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/greyscale-reverse',
                    'title': {
                      'und': 'boxfill/greyscale-reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the greyscale-reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/balance-blue',
                    'title': {
                      'und': 'boxfill/balance-blue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the balance-blue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_ice',
                    'title': {
                      'und': 'boxfill/cmocean_ice',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_ice palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_delta',
                    'title': {
                      'und': 'boxfill/cmocean_delta',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_delta palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_balance',
                    'title': {
                      'und': 'boxfill/cmocean_balance',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_balance palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_solar',
                    'title': {
                      'und': 'boxfill/cmocean_solar',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_solar palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/occam_pastel-30',
                    'title': {
                      'und': 'boxfill/occam_pastel-30',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the occam_pastel-30 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/ferret',
                    'title': {
                      'und': 'boxfill/ferret',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the ferret palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/redblue',
                    'title': {
                      'und': 'boxfill/redblue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the redblue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/colour-blind-safe',
                    'title': {
                      'und': 'boxfill/colour-blind-safe',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the colour-blind-safe palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/alg2',
                    'title': {
                      'und': 'boxfill/alg2',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the alg2 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_gray',
                    'title': {
                      'und': 'boxfill/cmocean_gray',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_gray palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/blue',
                    'title': {
                      'und': 'boxfill/blue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the blue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_matter',
                    'title': {
                      'und': 'boxfill/cmocean_matter',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_matter palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_amp',
                    'title': {
                      'und': 'boxfill/cmocean_amp',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_amp palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/green-descending',
                    'title': {
                      'und': 'boxfill/green-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the green-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_balance_reverse',
                    'title': {
                      'und': 'boxfill/cmocean_balance_reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_balance_reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/rainbow',
                    'title': {
                      'und': 'boxfill/rainbow',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the rainbow palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                ],
                'projections': [
                  'EPSG:4326',
                  'CRS: 84',
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
                'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities',
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
                    'identifier': 'boxfill/cmocean_speed',
                    'title': {
                      'und': 'boxfill/cmocean_speed',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_speed palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/ncview',
                    'title': {
                      'und': 'boxfill/ncview',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the ncview palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/occam',
                    'title': {
                      'und': 'boxfill/occam',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the occam palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_algae',
                    'title': {
                      'und': 'boxfill/cmocean_algae',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_algae palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_oxy',
                    'title': {
                      'und': 'boxfill/cmocean_oxy',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_oxy palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_haline',
                    'title': {
                      'und': 'boxfill/cmocean_haline',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_haline palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/sst_36',
                    'title': {
                      'und': 'boxfill/sst_36',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the sst_36 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_dense',
                    'title': {
                      'und': 'boxfill/cmocean_dense',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_dense palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/orange-descending',
                    'title': {
                      'und': 'boxfill/orange-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the orange-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cci_blue_red',
                    'title': {
                      'und': 'boxfill/cci_blue_red',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cci_blue_red palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_turbid',
                    'title': {
                      'und': 'boxfill/cmocean_turbid',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_turbid palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_tempo',
                    'title': {
                      'und': 'boxfill/cmocean_tempo',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_tempo palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_deep',
                    'title': {
                      'und': 'boxfill/cmocean_deep',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_deep palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_curl',
                    'title': {
                      'und': 'boxfill/cmocean_curl',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_curl palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_thermal',
                    'title': {
                      'und': 'boxfill/cmocean_thermal',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_thermal palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/blue-descending',
                    'title': {
                      'und': 'boxfill/blue-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the blue-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/redblue-reverse',
                    'title': {
                      'und': 'boxfill/redblue-reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the redblue-reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/soil-moisture',
                    'title': {
                      'und': 'boxfill/soil-moisture',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the soil-moisture palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_phase',
                    'title': {
                      'und': 'boxfill/cmocean_phase',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_phase palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/alg',
                    'title': {
                      'und': 'boxfill/alg',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the alg palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cci_main',
                    'title': {
                      'und': 'boxfill/cci_main',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cci_main palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/orange',
                    'title': {
                      'und': 'boxfill/orange',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the orange palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/greyscale',
                    'title': {
                      'und': 'boxfill/greyscale',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the greyscale palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/greyscale-reverse',
                    'title': {
                      'und': 'boxfill/greyscale-reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the greyscale-reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/balance-blue',
                    'title': {
                      'und': 'boxfill/balance-blue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the balance-blue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_ice',
                    'title': {
                      'und': 'boxfill/cmocean_ice',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_ice palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_delta',
                    'title': {
                      'und': 'boxfill/cmocean_delta',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_delta palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_balance',
                    'title': {
                      'und': 'boxfill/cmocean_balance',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_balance palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_solar',
                    'title': {
                      'und': 'boxfill/cmocean_solar',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_solar palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/occam_pastel-30',
                    'title': {
                      'und': 'boxfill/occam_pastel-30',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the occam_pastel-30 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/ferret',
                    'title': {
                      'und': 'boxfill/ferret',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the ferret palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/redblue',
                    'title': {
                      'und': 'boxfill/redblue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the redblue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/colour-blind-safe',
                    'title': {
                      'und': 'boxfill/colour-blind-safe',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the colour-blind-safe palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/alg2',
                    'title': {
                      'und': 'boxfill/alg2',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the alg2 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_gray',
                    'title': {
                      'und': 'boxfill/cmocean_gray',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_gray palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/blue',
                    'title': {
                      'und': 'boxfill/blue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the blue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_matter',
                    'title': {
                      'und': 'boxfill/cmocean_matter',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_matter palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_amp',
                    'title': {
                      'und': 'boxfill/cmocean_amp',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_amp palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/green-descending',
                    'title': {
                      'und': 'boxfill/green-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the green-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_balance_reverse',
                    'title': {
                      'und': 'boxfill/cmocean_balance_reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_balance_reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/rainbow',
                    'title': {
                      'und': 'boxfill/rainbow',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the rainbow palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                ],
                'projections': [
                  'EPSG:4326',
                  'CRS: 84',
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
                'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities',
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
                    'identifier': 'boxfill/cmocean_speed',
                    'title': {
                      'und': 'boxfill/cmocean_speed',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_speed palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/ncview',
                    'title': {
                      'und': 'boxfill/ncview',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the ncview palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/occam',
                    'title': {
                      'und': 'boxfill/occam',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the occam palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_algae',
                    'title': {
                      'und': 'boxfill/cmocean_algae',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_algae palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_oxy',
                    'title': {
                      'und': 'boxfill/cmocean_oxy',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_oxy palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_haline',
                    'title': {
                      'und': 'boxfill/cmocean_haline',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_haline palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/sst_36',
                    'title': {
                      'und': 'boxfill/sst_36',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the sst_36 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_dense',
                    'title': {
                      'und': 'boxfill/cmocean_dense',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_dense palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/orange-descending',
                    'title': {
                      'und': 'boxfill/orange-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the orange-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cci_blue_red',
                    'title': {
                      'und': 'boxfill/cci_blue_red',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cci_blue_red palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_turbid',
                    'title': {
                      'und': 'boxfill/cmocean_turbid',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_turbid palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_tempo',
                    'title': {
                      'und': 'boxfill/cmocean_tempo',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_tempo palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_deep',
                    'title': {
                      'und': 'boxfill/cmocean_deep',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_deep palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_curl',
                    'title': {
                      'und': 'boxfill/cmocean_curl',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_curl palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_thermal',
                    'title': {
                      'und': 'boxfill/cmocean_thermal',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_thermal palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/blue-descending',
                    'title': {
                      'und': 'boxfill/blue-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the blue-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/redblue-reverse',
                    'title': {
                      'und': 'boxfill/redblue-reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the redblue-reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/soil-moisture',
                    'title': {
                      'und': 'boxfill/soil-moisture',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the soil-moisture palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_phase',
                    'title': {
                      'und': 'boxfill/cmocean_phase',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_phase palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/alg',
                    'title': {
                      'und': 'boxfill/alg',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the alg palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cci_main',
                    'title': {
                      'und': 'boxfill/cci_main',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cci_main palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/orange',
                    'title': {
                      'und': 'boxfill/orange',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the orange palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/greyscale',
                    'title': {
                      'und': 'boxfill/greyscale',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the greyscale palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/greyscale-reverse',
                    'title': {
                      'und': 'boxfill/greyscale-reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the greyscale-reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/balance-blue',
                    'title': {
                      'und': 'boxfill/balance-blue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the balance-blue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_ice',
                    'title': {
                      'und': 'boxfill/cmocean_ice',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_ice palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_delta',
                    'title': {
                      'und': 'boxfill/cmocean_delta',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_delta palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_balance',
                    'title': {
                      'und': 'boxfill/cmocean_balance',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_balance palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_solar',
                    'title': {
                      'und': 'boxfill/cmocean_solar',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_solar palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/occam_pastel-30',
                    'title': {
                      'und': 'boxfill/occam_pastel-30',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the occam_pastel-30 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/ferret',
                    'title': {
                      'und': 'boxfill/ferret',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the ferret palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/redblue',
                    'title': {
                      'und': 'boxfill/redblue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the redblue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/colour-blind-safe',
                    'title': {
                      'und': 'boxfill/colour-blind-safe',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the colour-blind-safe palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/alg2',
                    'title': {
                      'und': 'boxfill/alg2',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the alg2 palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_gray',
                    'title': {
                      'und': 'boxfill/cmocean_gray',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_gray palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/blue',
                    'title': {
                      'und': 'boxfill/blue',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the blue palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_matter',
                    'title': {
                      'und': 'boxfill/cmocean_matter',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_matter palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_amp',
                    'title': {
                      'und': 'boxfill/cmocean_amp',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_amp palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/green-descending',
                    'title': {
                      'und': 'boxfill/green-descending',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the green-descending palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/cmocean_balance_reverse',
                    'title': {
                      'und': 'boxfill/cmocean_balance_reverse',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the cmocean_balance_reverse palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                  {
                    'identifier': 'boxfill/rainbow',
                    'title': {
                      'und': 'boxfill/rainbow',
                    },
                    'abstract': {
                      'und': 'boxfill style, using the rainbow palette ',
                    },
                    'legendUrl': [
                      {
                        'width': '110',
                        'height': '264',
                        'format': 'image/png',
                      },
                    ],
                  },
                ],
                'projections': [
                  'EPSG:4326',
                  'CRS: 84',
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
                'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities',
              },
            ],
          },
          {
            identifier: 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
            version: '1.3.0',
            url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
            layers: [
              {
                identifier: 'chlor_a',
                protocol: 'wms',
                modifier: 'hasTime',
                title: {
                  und: 'mass_concentration_of_chlorophyll_a_in_sea_water',
                },
                abstract: {
                  und: 'Chlorophyll-a concentration in seawater (not log-transformed), generated by SeaDAS using a blended combination of OCI (OC4v6 + Hu\'s CI), OC3 and OC5, depending on water class memberships',
                },
                styles: [
                  {
                    identifier: 'boxfill/cmocean_speed',
                    title: {
                      und: 'boxfill/cmocean_speed',
                    },
                    abstract: {
                      und: 'boxfill style, using the cmocean_speed palette',
                    },
                    legendUrl: [
                      {
                        width: 110,
                        height: 264,
                        format: 'image/png',
                        onlineResource: {
                          type: 'simple',
                          href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=chlor_a&PALETTE=cmocean_speed',
                        },
                      },
                    ],
                  },
                ],
                projections: [
                  'EPSG:3857',
                ],
                layerServer: 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
                boundingBox: {
                  minLat: -89.97916412353516,
                  minLon: -179.9791717529297,
                  maxLat: 89.97916412353516,
                  maxLon: 179.9791717529297,
                },
                dimensions: {
                  time: {
                    units: 'unknown',
                    default: '2016-12-31T00:00:00.000Z',
                    multipleValues: true,
                    current: true,
                    values: [
                      '2016-12-31T00:00:00.000Z',
                      '1997-09-04T00:00:00.000Z',
                      '2001-07-05T00:00:00.000Z',
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    };

    Promise.resolve(load(config1)).then(function() {
      console.warn('geonaServer is set to \'' + config1.geonaServer + '\' - please ensure this is the address you want to use for your testing.');
    })
      .catch(function(err) {
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

  // Will be used as shorthand in the tests
  // Basemaps
  let terrainLight;
  let gebco08Grid;
  let eox;
  let gebco;
  // Borders
  let rsgFull10mBorders;
  let rsgGeoserver;
  // Data
  let rrs412;
  let rrs443;
  let rrs490;
  let chlorA;
  let rsgCci;
  let rsgCci315;


  describe('test setup completion', function() {
    it('should find the Geona object on the window', function() {
      expect(window.geonaOlTest).to.be.an('object');
    });
    it('should find that the variable \'geona\' points to the Geona object on the window', function() {
      expect(geona).to.deep.equal(window.geonaOlTest);
    });
    it('should find eight layers in _availableLayers', function() {
      let availableLayersArray = Object.keys(geona.map._availableLayers);
      expect(availableLayersArray.length).to.equal(8);
    });
    it('should find five layerServers in _availableLayerServers', function() {
      let availableLayerServersArray = Object.keys(geona.map._availableLayerServers);
      expect(availableLayerServersArray.length).to.equal(5);
    });

    after(function() {
    // Shorthand for the available layers, used to keep tests shorter and more readable
    // Basemaps
      terrainLight = geona.map._availableLayers['terrain-light'];
      gebco08Grid = geona.map._availableLayers.gebco_08_grid;
      // Borders
      rsgFull10mBorders = geona.map._availableLayers['rsg:full_10m_borders'];
      // Data
      rrs412 = geona.map._availableLayers.Rrs_412;
      rrs443 = geona.map._availableLayers.Rrs_443;
      rrs490 = geona.map._availableLayers.Rrs_490;
      chlorA = geona.map._availableLayers.chlor_a;

      // Shorthand for the available layerServers, used to keep tests shorter and more readable
      // Basemaps
      eox = geona.map._availableLayerServers['https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities'];
      gebco = geona.map._availableLayerServers['https__www.gebco.net_data_and_products_gebco_web_services_web_map_service_mapserv__wms_1.1.1_getcapabilities'];
      // Borders
      rsgGeoserver = geona.map._availableLayerServers['https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities'];
      // Data
      rsgCci = geona.map._availableLayerServers['https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities'];
      rsgCci315 = geona.map._availableLayerServers['https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities'];
    });
  });


  describe('addLayer()', function() {
    // The list of layers on the map
    let mapLayers;

    before(function() {
      geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
    });

    it('should have added a data layer to the map', function() {
      mapLayers = geona.map._map.getLayers();
      // Also tests that there isn't another layer on the map (index 0 should be the only one with data)
      expect(mapLayers.getArray()[0].get('identifier')).to.equal(rrs412.identifier);
    });
    it('should have added that layer to _availableLayers', function() {
      expect(geona.map._availableLayers[rrs412.identifier]).to.not.be.undefined;
    });
    it('should have added that layer to _activeLayers', function() {
      expect(geona.map._activeLayers[rrs412.identifier]).to.not.be.undefined;
    });
    it('should only have one layer on the map', function() {
      expect(mapLayers.getArray().length).to.equal(1);
      expect(Object.keys(geona.map._activeLayers).length).to.equal(1);
    });
    it('should add the basemap modifier to basemaps', function() {
      geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
      expect(geona.map._activeLayers['terrain-light'].get('modifier')).to.equal('basemap');
    });
    it('should display the correct attribution for basemaps', function() {
      let html = geona.map._map.getLayers().getArray()[1].getSource().getAttributions()[0].getHTML();
      expect(html).to.deep.equal('Geona | ' + geona.map.config.basemapLayers[0].layers[0].attribution.onlineResource);
    });
    it('should not allow a data layer to be added which does not support the current projection', function() {
      expect(function() {
        geona.map.addLayer(chlorA, rsgCci315, {modifier: 'hasTime'});
      }).to.throw('The layer chlor_a cannot be displayed with the current EPSG:4326 map projection.');
    });
    it('should not allow the basemap to automatically switch the projection if any layers do not support the target projection', function() {
      geona.map.addLayer(gebco08Grid, gebco, {modifier: 'basemap'});
      geona.map.setProjection('EPSG:3857');
      geona.map.addLayer(chlorA, rsgCci315, {modifier: 'hasTime'});

      expect(function() {
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
      }).to.throw('Currently active layer chlor_a does not support the new basemap projection EPSG:4326');

      geona.map.removeLayer('chlor_a');
    });
    it('should add the borders modifier to borders layers', function() {
      geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line_black'});
      expect(geona.map._activeLayers['rsg:full_10m_borders'].get('modifier')).to.equal('borders');
    });
    it('should remove the previous basemap when a new basemap is added', function() {
      geona.map.addLayer(gebco08Grid, gebco, {modifier: 'basemap'});
      expect(geona.map._activeLayers.gebco_08_grid).to.not.be.undefined;
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
      geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line'});
      expect(geona.map._activeLayers['rsg:full_10m_borders'].getSource().getParams().STYLES).to.equal('line');
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
    // Will hold the currently active map layers
    let data;
    let basemap;
    let borders;

    before(function() {
      // Set the variables above to the currently active map layers
      for (let layer of geona.map._map.getLayers().getArray()) {
        if (layer.get('modifier') === undefined || layer.get('modifier') === 'hasTime') {
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
    it('should set the config borders to be identifier: \'none\'', function() {
      expect(geona.map.config.borders.identifier).to.equal('none');
    });
  });

  describe('setProjection()', function() {
    before(function() {
      geona.map.addLayer(gebco08Grid, gebco, {modifier: 'basemap'});
    });

    it('should change the projection from EPSG:4326 to EPSG:3857', function() {
      expect(function() {
        geona.map.setProjection('EPSG:3857');
      }).to.not.throw();
      expect(geona.map.config.projection).to.equal('EPSG:3857');
      expect(geona.map._map.getView().getProjection().getCode()).to.equal('EPSG:3857');
    });
    it('should not allow the projection to change to a type unsupported by the basemap', function() {
      expect(function() {
        geona.map.setProjection('FAKEPROJ');
      }).to.throw('Layer gebco_08_grid does not support projection type FAKEPROJ.');
      expect(geona.map.config.projection).to.equal('EPSG:3857');
      expect(geona.map._map.getView().getProjection().getCode()).to.equal('EPSG:3857');
    });
    it('should not allow the projection to change to a type unsupported by a non-basemap layer', function() {
      geona.map.addLayer(chlorA, rsgCci315, {modifier: 'hasTime'});

      expect(function() {
        geona.map.setProjection('EPSG:4326');
      }).to.throw('Layer chlor_a does not support projection type EPSG:4326.');
      expect(geona.map.config.projection).to.equal('EPSG:3857');
      expect(geona.map._map.getView().getProjection().getCode()).to.equal('EPSG:3857');
    });

    after(function() {
      geona.map.removeLayer('chlor_a');
      geona.map.removeLayer('gebco_08_grid');
    });
  });

  // These tests might have too much duplication
  // (i.e. could be made to test the same number of aspects in fewer lines of code).
  // They also might not be comprehensive, as reorderLayers() deals with a variety of situations.
  describe('reorderLayers()', function() {
    describe('reordering - 1x basemap, 1x borders, 0x data', function() {
      before(function() {
        // Basic setup with one basemap and one borders layer.
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
        geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders'});
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
        geona.map.removeLayer('rsg:full_10m_borders');
      });
    });

    describe('reordering - 1x basemap, 1x borders, 1x data', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
        geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders'});
        geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
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
        geona.map.removeLayer('rsg:full_10m_borders');
        geona.map.removeLayer('Rrs_412');
      });
    });

    describe('reordering - 1x data, 1x borders, 1x basemap', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
        geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line_black'});
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
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
        geona.map.removeLayer('rsg:full_10m_borders');
        geona.map.removeLayer('terrain-light');
      });
    });

    describe('reordering - 1x data, 1x borders, 1x basemap, basemap removed', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
        geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
        geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line_black'});
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
            expect(layer.get('modifier')).to.equal('hasTime');
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
        geona.map.removeLayer('rsg:full_10m_borders');
      });
    });

    describe('reordering - 1x borders, 1x data, 1x basemap, borders removed', function() {
      before(function() {
        // Setup with one basemap, one borders layer, and one data layer.
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
        geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
        geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line_black'});
        geona.map.removeLayer('rsg:full_10m_borders');
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
            expect(layer.get('modifier')).to.equal('hasTime');
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
        geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line_black'});
        geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
        geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
        geona.map.addLayer(rrs443, rsgCci, {modifier: 'hasTime'});
        geona.map.addLayer(rrs490, rsgCci, {modifier: 'hasTime'});
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
            expect(layer.get('modifier')).to.equal('hasTime');
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
      it('should find zIndex values of 0, 1, 2, 3, not necessarily in that order', function() {
        // Remove data layer from middle
        geona.map.removeLayer('Rrs_443');

        let allZIndices = [];
        for (let layer of geona.map._map.getLayers().getArray()) {
          allZIndices.push(layer.get('zIndex'));
        }
        // zIndices don't have to be in ascending order, but we sort here for easy comparison.
        expect(allZIndices.sort()).to.deep.equal([0, 1, 2, 3]);
      });

      after(function() {
        // Remove the layers ready for the next tests.
        geona.map.removeLayer('rsg:full_10m_borders');
        geona.map.removeLayer('Rrs_490');
        geona.map.removeLayer('Rrs_412');
        geona.map.removeLayer('terrain-light');
      });
    });
  });

  describe('loadNearestValidTime', function() {
    // These variables are used as shorthand for the active layers in the tests.
    // They are redefined in each test to keep them up-to-date with any changes we make during the tests.
    let rrs412Active;
    let rrs490Active;

    before(function() {
      // Add a basemap, two data layers, and a borders layer.
      geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
      geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
      geona.map.addLayer(rrs490, rsgCci, {modifier: 'hasTime'});
      geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line'});
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
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs412Active.get('layerTime')).to.equal('2015-12-27T00:00:00.000Z');
    });
    it('should find that the layer time for the second layer added is set to the nearest valid time as the first layer', function() {
      rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs490Active.get('layerTime')).to.equal('2015-12-27T00:00:00.000Z');
    });
    it('should change the Rrs_412 layer time to 1998-01-01T00:00:00.000Z', function() {
      geona.map.loadNearestValidTime('Rrs_412', '1998-01-01T00:00:00.000Z');
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs412Active.get('layerTime')).to.equal('1998-01-01T00:00:00.000Z');
    });
    it('should change the Rrs_490 layer time to 2001-04-01T00:00:00.000Z', function() {
      geona.map.loadNearestValidTime('Rrs_490', '2001-04-01T00:00:00.000Z');
      rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs490Active.get('layerTime')).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should hide the layers because there is no valid time', function() {
      geona.map.loadNearestValidTime('Rrs_490', '1900-12-27T00:00:00.000Z');
      rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs490Active.getVisible()).to.equal(false);
      expect(rrs490Active.get('shown')).to.equal(true);

      // For the purposes of the next tests, we will hide this layer before moving it to the invalid time
      geona.map.hideLayer('Rrs_412');
      geona.map.loadNearestValidTime('Rrs_412', '1900-12-27T00:00:00.000Z');
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs412Active.getVisible()).to.equal(false);
      expect(rrs412Active.get('shown')).to.equal(false);
    });
    it('should keep the layer times the same as their previous time after being hidden', function() {
      rrs490Active = geona.map._activeLayers.Rrs_490;
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs490Active.get('layerTime')).to.equal('2001-04-01T00:00:00.000Z');
      expect(rrs412Active.get('layerTime')).to.equal('1998-01-01T00:00:00.000Z');
    });
    it('should have set the map time to the requested time because there is no valid time', function() {
      expect(geona.map._mapTime).to.equal('1900-12-27T00:00:00.000Z');
    });
    it('should make the layer visible', function() {
      geona.map.loadNearestValidTime('Rrs_490', '2010-01-01T00:00:00.000Z');
      rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs490Active.getVisible()).to.equal(true);
      expect(rrs490Active.get('shown')).to.equal(true);
    });
    it('should have set the map time to the time of the only visible layer', function() {
      expect(geona.map._mapTime).to.equal('2008-08-08T00:00:00.000Z');
    });
    it('should keep the layer hidden if the layer is out of valid time', function() {
      geona.map.showLayer('Rrs_412');
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs412Active.getVisible()).to.equal(false);
    });
    it('should keep the layer hidden if the layer had been hidden prior to moving out of valid time', function() {
      geona.map.hideLayer('Rrs_412');
      geona.map.loadNearestValidTime('Rrs_412', '1998-01-01T00:00:00.000Z');
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs412Active.getVisible()).to.equal(false);
      expect(rrs412Active.get('shown')).to.equal(false);
    });

    after(function() {
      geona.map.removeLayer('terrain-light');
      geona.map.removeLayer('Rrs_412');
      geona.map.removeLayer('Rrs_490');
      geona.map.removeLayer('rsg:full_10m_borders');
    });
  });

  describe('loadLayersToNearestValidTime', function() {
    before(function() {
      // Add a basemap, two data layers, and a borders layer.
      geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
      geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
      geona.map.addLayer(rrs490, rsgCci, {modifier: 'hasTime'});
      geona.map.addLayer(rsgFull10mBorders, rsgGeoserver, {modifier: 'borders', requestedStyle: 'line'});
    });

    it('should set the layers to valid times', function() {
      geona.map.loadLayersToNearestValidTime('2001-04-01T00:00:00.000Z');
      let rrs412Active = geona.map._activeLayers.Rrs_412;
      let rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs412Active.get('layerTime')).to.equal('1998-01-01T00:00:00.000Z');
      expect(rrs490Active.get('layerTime')).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should set the map time to 2001-04-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('2001-04-01T00:00:00.000Z');
    });
    it('should hide both layers', function() {
      geona.map.loadLayersToNearestValidTime('1900-01-01T00:00:00.000Z');
      let rrs412Active = geona.map._activeLayers.Rrs_412;
      let rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs412Active.getVisible()).to.equal(false);
      expect(rrs490Active.getVisible()).to.equal(false);
    });
    it('should set the map time to 1900-01-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('1900-01-01T00:00:00.000Z');
    });
    it('should hide both layers', function() {
      geona.map.loadLayersToNearestValidTime('2200-01-01T00:00:00.000Z');
      let rrs412Active = geona.map._activeLayers.Rrs_412;
      let rrs490Active = geona.map._activeLayers.Rrs_490;
      expect(rrs412Active.getVisible()).to.equal(false);
      expect(rrs490Active.getVisible()).to.equal(false);
    });
    it('should set the map time to 2200-01-01T00:00:00.000Z', function() {
      expect(geona.map._mapTime).to.equal('2200-01-01T00:00:00.000Z');
    });

    after(function() {
      geona.map.removeLayer('terrain-light');
      geona.map.removeLayer('Rrs_412');
      geona.map.removeLayer('Rrs_490');
      geona.map.removeLayer('rsg:full_10m_borders');
    });
  });

  describe('changeLayerStyle', function() {
    // This variable is used as shorthand for the active layer in the tests.
    // It is redefined in each test to keep it up-to-date with any changes we make during the tests.
    let rrs412Active;

    before(function() {
      geona.map.addLayer(terrainLight, eox, {modifier: 'basemap'});
      geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
      geona.map.addLayer(rrs490, rsgCci, {modifier: 'hasTime'});
    });

    it('should throw an error that the layer isn\'t in _availableLayers', function() {
      expect(function() {
        geona.map.changeLayerStyle('', 'boxfill/occam');
      }).to.throw(Error);
    });
    it('should throw an error that the layer isn\'t in _activeLayers', function() {
      expect(function() {
        geona.map.changeLayerStyle('Rrs_443', 'boxfill/occam');
      }).to.throw(Error);
    });
    it('should throw an error that the layer has no available styles', function() {
      expect(function() {
        geona.map.changeLayerStyle('terrain-light', '');
      }).to.throw(Error);
    });
    it('should throw an error that the layer doesn\'t support the requested style', function() {
      expect(function() {
        geona.map.changeLayerStyle('Rrs_412', '');
      }).to.throw(Error);
    });

    // Defined in the next test, used elsewhere
    let initialZIndex;
    it('should change the layer style', function() {
      rrs412Active = geona.map._activeLayers.Rrs_412;
      initialZIndex = rrs412Active.get('zIndex');

      let initialStyle = rrs412Active.get('source').getParams().STYLES;
      geona.map.changeLayerStyle('Rrs_412', 'boxfill/occam');
      rrs412Active = geona.map._activeLayers.Rrs_412;
      expect(rrs412Active.get('source').getParams().STYLES).to.equal('boxfill/occam');
      expect(rrs412Active.get('source').getParams().STYLES).to.not.equal(initialStyle);
    });
    it('should keep the zIndex the same before and after changing style', function() {
      // Uses the zIndex defined in the previous test
      let currentZIndex = rrs412Active.get('zIndex');
      expect(currentZIndex).to.equal(initialZIndex);
    });
    it('should keep the style after the time changes', function() {
      let initialStyle = rrs412Active.get('source').getParams().STYLES;
      let initialTime = rrs412Active.get('layerTime');
      geona.map.loadNearestValidTime('Rrs_412', '2002-01-01T00:00:00.000Z');

      rrs412Active = geona.map._activeLayers.Rrs_412;
      let currentStyle = rrs412Active.get('source').getParams().STYLES;
      let currentTime = rrs412Active.get('layerTime');
      expect(currentStyle).to.equal(initialStyle);
      expect(currentTime).to.not.equal(initialTime);
    });

    after(function() {
      geona.map.removeLayer('terrain-light');
      geona.map.removeLayer('Rrs_412');
      geona.map.removeLayer('Rrs_490');
    });
  });

  describe('layerGet', function() {
    before(function() {
      geona.map.addLayer(rrs412, rsgCci, {modifier: 'hasTime'});
    });

    it('should return a zIndex of 0 from the layer identifier', function() {
      let zIndex = geona.map.layerGet('Rrs_412', 'zIndex');
      expect(zIndex).to.equal(0);
    });
    it('should throw an undefined error from the layer identifier', function() {
      expect(function() {
        geona.map.layerGet('', 'zIndex');
      }).to.throw(TypeError);
    });

    after(function() {
      geona.map.removeLayer('Rrs_412');
    });
  });

  describe('getLayersFromWms()', function() {
    let wmsLayerServerInfo;
    before(function(done) {
      this.timeout(10000); // eslint-disable-line no-invalid-this
      getLayerServer(geona.geonaServer, 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY', 'wms', false, false)
        .then(function(layerServerInfo) {
          wmsLayerServerInfo = layerServerInfo;
          done();
        })
        .catch(function(err) {
          console.error(err);
          done();
        });
    });

    it('should have found some layers', function() {
      expect(wmsLayerServerInfo.layers.length).to.be.above(0);
    });
    it('should add one of the retrieved layers to the map', function() {
      if (wmsLayerServerInfo.layers[0].dimensions) {
        if (wmsLayerServerInfo.layers[0].dimensions.time) {
          geona.map.addLayer(wmsLayerServerInfo.layers[0], wmsLayerServerInfo.layerServer, {modifier: 'hasTime'});
        } else {
          geona.map.addLayer(wmsLayerServerInfo.layers[0], wmsLayerServerInfo.layerServer);
        }
      } else {
        geona.map.addLayer(wmsLayerServerInfo.layers[0], wmsLayerServerInfo.layerServer);
      }

      let firstMapLayer = geona.map._map.getLayers().getArray()[0];
      expect(firstMapLayer.get('identifier')).to.equal(wmsLayerServerInfo.layers[0].identifier);
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
    let wmtsLayerServerInfo;
    before(function(done) {
      this.timeout(10000); // eslint-disable-line no-invalid-this
      getLayerServer(geona.geonaServer, 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?VERSION=1.0.0&Request=GetCapabilities&Service=WMTS', 'wmts', false, false)
        .then(function(layerServerInfo) {
          wmtsLayerServerInfo = layerServerInfo;
          done();
        })
        .catch(function(err) {
          console.error(err);
          done();
        });
    });

    it('should have found some layers', function() {
      expect(wmtsLayerServerInfo.layers.length).to.be.above(0);
    });
    it('should add one of the retrieved layers to the map', function() {
      geona.map.addLayer(wmtsLayerServerInfo.layers[0], wmtsLayerServerInfo.layerServer);

      let firstMapLayer = geona.map._map.getLayers().getArray()[0];
      expect(firstMapLayer.get('identifier')).to.equal(wmtsLayerServerInfo.layers[0].identifier);
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
