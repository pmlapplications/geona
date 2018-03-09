import chai from 'chai';
import chaiHttp from 'chai-http';
import i18next from 'i18next';

import {load} from '../../../../src/client_loader/loader.js';

import {getFutureDate, getPastDate} from '../../../../src/client/js/gui/timeline';

chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/test/gui/timeline', function() {
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

    Promise.resolve(load(config1)).catch(function(err) {
      console.error(err);
      done();
    });
  });
  describe('getFutureDate', function() {
    before(function() {

    });

    it('should ', function() {

    });

    after(function() {

    });
  });
});
