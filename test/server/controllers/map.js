import chai from 'chai';
import chaiHttp from 'chai-http';

import fs from 'fs';
import request from 'request';

import {resetParameterTypes, getLayerServerFromCacheOrUrl} from '../../../src/server/controllers/map';

chai.use(chaiHttp);
let expect = chai.expect;

describe('server/controllers/map', function() {
  // Path to the cache folder
  let cacheUri = '/local1/data/scratch/git/web-development/gp2-contribution-guide/cache/';
  // Path to the dependencies expected folder
  let expectedUri = '/local1/data/scratch/git/web-development/gp2-contribution-guide/test_dependencies/expected/server/controllers/';
  // Server Geona is running on
  let geonaServer = 'http://192.171.164.90:7890';

  describe('getCache()', function() {
    before(function() {
      // Write a TEMPORARY_TEST_FILE.json
      let exampleJson = {
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
      };
      fs.writeFileSync(cacheUri + 'TEMPORARY_TEST_FILE.json', JSON.stringify(exampleJson), 'utf8');
    });

    it('should return the file', function(done) {
      // Search for TEMPORARY_TEST_FILE.json
      this.timeout(10000); // eslint-disable-line no-invalid-this
      let searchFile = geonaServer + '/map/getCache/TEMPORARY_TEST_FILE.json';
      request(searchFile, (err, response) => {
        expect(err).to.be.null;
        expect(response.statusCode).to.equal(200);
        let expectedResponse = fs.readFileSync(expectedUri + 'map__getCache__success_expected_response.json', 'utf8');
        expect(response.body).to.deep.equal(expectedResponse);
        done();
      });
    });
    it('should return a 404 error', function(done) {
      // Search for '.json'
      this.timeout(10000); // eslint-disable-line no-invalid-this
      let searchFile = geonaServer + '/map/getCache/.json';
      request(searchFile, (err, response) => {
        expect(err).to.be.null;
        expect(response.statusCode).to.equal(404);
        let expectedResponse = fs.readFileSync(expectedUri + 'map__getCache__404_expected_response.json', 'utf8');
        expect(response.body).to.deep.equal(expectedResponse);
        done();
      });
    });

    after(function() {
      // Delete the TEMPORARY_TEST_FILE.json
      fs.unlinkSync(cacheUri + 'TEMPORARY_TEST_FILE.json');
    });
  });

  describe('getLayerServerFromCacheOrUrl()', function() {
    before(function() {
      // Delete the file from cache if it already exists
      let layerServerPath = cacheUri + 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_getcapabilities.json';
      if (fs.existsSync(layerServerPath)) {
        fs.unlinkSync(layerServerPath);
      }
    });

    it('should make a request to the URL and find a LayerServer', function(done) {
      this.timeout(10000); // eslint-disable-line no-invalid-this
      getLayerServerFromCacheOrUrl(geonaServer, 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY?request=GetCapabilities&service=WMS', 'wms', true, false)
        .then(function(layerServer) {
          let expectedLayerServer = fs.readFileSync(expectedUri + 'map__getCache__layer_server.json', 'utf8');
          expect(layerServer).to.deep.equal(expectedLayerServer);
          done();
        })
        .catch(function(err) {
          expect.fail(err);
          done();
        });
    });
    it('should have saved the LayerServer', function() {
      try {
        let searchResult = fs.readFileSync(cacheUri + 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_getcapabilities.json', 'utf8');
        let expectedLayerServer = fs.readFileSync(expectedUri + 'map__getCache__layer_server.json', 'utf8');
        expect(searchResult).to.deep.equal(expectedLayerServer);
      } catch (err) {
        if (err.code === 'ENOENT') {
          expect.fail(err);
        } else {
          throw err;
        }
      }
    });
    it('should make a request to the cache and find a LayerServer', function(done) {
      getLayerServerFromCacheOrUrl(geonaServer, 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY?request=GetCapabilities&service=WMS', 'wms', false, true)
        .then(function(layerServer) {
          let expectedLayerServer = fs.readFileSync(expectedUri + 'map__getCache__layer_server.json', 'utf8');
          expect(layerServer).to.deep.equal(expectedLayerServer);
          done();
        })
        .catch(function(err) {
          expect.fail(err);
          done();
        });

      // afterwards delete cached file in preparation for next test
      fs.unlinkSync(cacheUri + 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_getcapabilities.json');
    });
    it('should make a request to the URL and not save the LayerServer', function(done) {
      this.timeout(10000); // eslint-disable-line no-invalid-this
      getLayerServerFromCacheOrUrl(geonaServer, 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY?request=GetCapabilities&service=WMS', 'wms', false, false)
        .then(function(layerServer) {
          let expectedLayerServer = fs.readFileSync(expectedUri + 'map__getCache__layer_server.json', 'utf8');
          expect(layerServer).to.deep.equal(expectedLayerServer);
          let fileCached = fs.existsSync(cacheUri + 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_getcapabilities.json', 'utf8');
          expect(fileCached).to.equal(false);
          done();
        })
        .catch(function(err) {
          console.error(err);
          expect.fail();
          done();
        });
    });
  });

  describe('resetParameterTypes()', function() {
    it('should return a decimal number', function() {
      let float = resetParameterTypes(['3.64'])[0];
      expect(float).to.equal(3.64);
      expect(typeof float).to.equal('number');
    });
    it('should return an integer number', function() {
      let integer = resetParameterTypes(['70'])[0];
      expect(integer).to.equal(70);
      expect(typeof integer).to.equal('number');
    });
    it('should return Infinity', function() {
      let infinity = resetParameterTypes(['Infinity'])[0];
      expect(infinity).to.equal(Infinity);
    });
    it('should return negative Infinity', function() {
      let negInfinity = resetParameterTypes(['-Infinity'])[0];
      expect(negInfinity).to.equal(-Infinity);
    });
    it('should return a string', function() {
      let string = resetParameterTypes(['test'])[0];
      expect(typeof string).to.equal('string');
    });
    it('should return undefined', function() {
      let undef = resetParameterTypes(['undefined'])[0];
      expect(undef).to.equal(undefined);
      expect(typeof undef).to.equal('undefined');
    });
    it('should return null', function() {
      let nul = resetParameterTypes(['null'])[0];
      expect(nul).to.equal(null);
      expect(typeof nul).to.equal('object');
    });
    it('should return a Boolean true', function() {
      let tru = resetParameterTypes(['true'])[0];
      expect(tru).to.equal(true);
      expect(typeof tru).to.equal('boolean');
    });
    it('should return a Boolean false', function() {
      let fals = resetParameterTypes(['false'])[0];
      expect(fals).to.equal(false);
      expect(typeof fals).to.equal('boolean');
    });
  });
});
