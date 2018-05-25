import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import * as paths from '../../setup';

import {load} from '../../../src/client_loader/loader.js';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/test/geona', function() {
  // Shorthand for window.geonaTest, used in the actual tests
  let geonaOl;
  let geonaL;
  // Shorthand for scalebar, used in the actual tests
  let scalebar;


  // Shorthand for data layers and servers
  let rrs412;
  let chlorA;

  let expectedDefaultOpenLayersState = {
    'map': {
      'library': 'openlayers',
      'basemap': 'terrain-light',
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
                'onlineResource': 'Terrain Light { Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a> }',
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
      ],
      'bingMapsApiKey': '',
      'borders': {
        'identifier': 'none',
        'style': 'none',
      },
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
                  'identifier': 'line_black',
                },
                {
                  'identifier': 'line-white',
                },
                {
                  'identifier': 'line',
                },
              ],
              'layerServer': 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
            },
          ],
        },
      ],
      'data': [],
      'dataLayers': [
        {
          'identifier': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
          'version': '1.3.0',
          'url': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
          'service': {
            'title': {
              'und': 'PML RSG THREDDS Data Server',
            },
            'abstract': {
              'und': 'Scientific Data',
            },
            'keywords': {
              'und': [
                'meteorology',
                'atmosphere',
                'climate',
                'ocean',
                'earth science',
              ],
            },
            'onlineResource': 'http://www.pml.ac.uk',
            'contactInformation': {
              'person': 'Remote Sensing Group',
              'phone': [
                '',
              ],
              'email': [
                'rsgweb@pml.ac.uk',
              ],
            },
          },
          'capability': {
            'getMap': {
              'formats': [
                'image/png',
                'image/png;mode=32bit',
                'image/gif',
                'image/jpeg',
                'application/vnd.google-earth.kmz',
              ],
              'get': [
                'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
              ],
            },
            'getFeatureInfo': {
              'formats': [
                'image/png',
                'text/xml',
              ],
              'get': [
                'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
              ],
            },
          },
          'layers': [
            {
              'identifier': 'chlor_a',
              'protocol': 'wms',
              'modifier': 'hasTime',
              'title': {
                'und': 'mass_concentration_of_chlorophyll_a_in_sea_water',
              },
              'abstract': {
                'und': 'Chlorophyll-a concentration in seawater (not log-transformed), generated by SeaDAS using a blended combination of OCI (OC4v6 + Hu\'s CI), OC3 and OC5, depending on water class memberships',
              },
              'styles': [
                {
                  'identifier': 'boxfill/cmocean_speed',
                  'title': {
                    'und': 'boxfill/cmocean_speed',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_speed palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=chlor_a&PALETTE=cmocean_speed',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/rainbow',
                  'title': {
                    'und': 'boxfill/rainbow',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the rainbow palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=chlor_a&PALETTE=rainbow',
                      },
                    },
                  ],
                },
              ],
              'projections': [
                'EPSG:4326',
                'EPSG:3857',
              ],
              'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
              'boundingBox': {
                'minLat': -89.97916412353516,
                'minLon': -179.9791717529297,
                'maxLat': 89.97916412353516,
                'maxLon': 179.9791717529297,
              },
              'dimensions': {
                'time': {
                  'units': 'unknown',
                  'default': '2016-12-31T00:00:00.000Z',
                  'multipleValues': true,
                  'current': true,
                  'values': [
                    '1997-09-04T00:00:00.000Z',
                    '1998-01-11T00:00:00.000Z',
                    '2001-07-05T00:00:00.000Z',
                    '2016-12-31T00:00:00.000Z',
                  ],
                },
              },
              'scale': {
                'height': 500,
                'width': 30,
                'rotationAngle': 90,
                'colorBarOnly': true,
              },
            },
            {
              'identifier': 'Rrs_412',
              'protocol': 'wms',
              'modifier': 'hasTime',
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
                    'und': 'boxfill style, using the cmocean_speed palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_speed',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/ncview',
                  'title': {
                    'und': 'boxfill/ncview',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the ncview palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=ncview',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/occam',
                  'title': {
                    'und': 'boxfill/occam',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the occam palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=occam',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_algae',
                  'title': {
                    'und': 'boxfill/cmocean_algae',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_algae palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_algae',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_oxy',
                  'title': {
                    'und': 'boxfill/cmocean_oxy',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_oxy palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_oxy',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_haline',
                  'title': {
                    'und': 'boxfill/cmocean_haline',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_haline palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_haline',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/sst_36',
                  'title': {
                    'und': 'boxfill/sst_36',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the sst_36 palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=sst_36',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_dense',
                  'title': {
                    'und': 'boxfill/cmocean_dense',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_dense palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_dense',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/orange-descending',
                  'title': {
                    'und': 'boxfill/orange-descending',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the orange-descending palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=orange-descending',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cci_blue_red',
                  'title': {
                    'und': 'boxfill/cci_blue_red',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cci_blue_red palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cci_blue_red',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_turbid',
                  'title': {
                    'und': 'boxfill/cmocean_turbid',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_turbid palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_turbid',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_tempo',
                  'title': {
                    'und': 'boxfill/cmocean_tempo',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_tempo palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_tempo',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_deep',
                  'title': {
                    'und': 'boxfill/cmocean_deep',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_deep palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_deep',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_curl',
                  'title': {
                    'und': 'boxfill/cmocean_curl',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_curl palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_curl',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_thermal',
                  'title': {
                    'und': 'boxfill/cmocean_thermal',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_thermal palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_thermal',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/blue-descending',
                  'title': {
                    'und': 'boxfill/blue-descending',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the blue-descending palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=blue-descending',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/redblue-reverse',
                  'title': {
                    'und': 'boxfill/redblue-reverse',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the redblue-reverse palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=redblue-reverse',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/soil-moisture',
                  'title': {
                    'und': 'boxfill/soil-moisture',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the soil-moisture palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=soil-moisture',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_phase',
                  'title': {
                    'und': 'boxfill/cmocean_phase',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_phase palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_phase',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cci_main',
                  'title': {
                    'und': 'boxfill/cci_main',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cci_main palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cci_main',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/alg',
                  'title': {
                    'und': 'boxfill/alg',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the alg palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=alg',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/orange',
                  'title': {
                    'und': 'boxfill/orange',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the orange palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=orange',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/greyscale',
                  'title': {
                    'und': 'boxfill/greyscale',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the greyscale palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=greyscale',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/greyscale-reverse',
                  'title': {
                    'und': 'boxfill/greyscale-reverse',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the greyscale-reverse palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=greyscale-reverse',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/balance-blue',
                  'title': {
                    'und': 'boxfill/balance-blue',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the balance-blue palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=balance-blue',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_ice',
                  'title': {
                    'und': 'boxfill/cmocean_ice',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_ice palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_ice',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_delta',
                  'title': {
                    'und': 'boxfill/cmocean_delta',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_delta palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_delta',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_balance',
                  'title': {
                    'und': 'boxfill/cmocean_balance',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_balance palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_balance',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_solar',
                  'title': {
                    'und': 'boxfill/cmocean_solar',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_solar palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_solar',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/ferret',
                  'title': {
                    'und': 'boxfill/ferret',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the ferret palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=ferret',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/occam_pastel-30',
                  'title': {
                    'und': 'boxfill/occam_pastel-30',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the occam_pastel-30 palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=occam_pastel-30',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/redblue',
                  'title': {
                    'und': 'boxfill/redblue',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the redblue palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=redblue',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/colour-blind-safe',
                  'title': {
                    'und': 'boxfill/colour-blind-safe',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the colour-blind-safe palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=colour-blind-safe',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/alg2',
                  'title': {
                    'und': 'boxfill/alg2',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the alg2 palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=alg2',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_gray',
                  'title': {
                    'und': 'boxfill/cmocean_gray',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_gray palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_gray',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/blue',
                  'title': {
                    'und': 'boxfill/blue',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the blue palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=blue',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_matter',
                  'title': {
                    'und': 'boxfill/cmocean_matter',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_matter palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_matter',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_amp',
                  'title': {
                    'und': 'boxfill/cmocean_amp',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_amp palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_amp',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/green-descending',
                  'title': {
                    'und': 'boxfill/green-descending',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the green-descending palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=green-descending',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_balance_reverse',
                  'title': {
                    'und': 'boxfill/cmocean_balance_reverse',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_balance_reverse palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_balance_reverse',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/rainbow',
                  'title': {
                    'und': 'boxfill/rainbow',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the rainbow palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=rainbow',
                      },
                    },
                  ],
                },
              ],
              'projections': [
                'EPSG:4326',
                'EPSG:3857',
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
                    '2015-12-27T00:00:00.000Z',
                  ],
                },
              },
              'scale': {
                'height': 500,
                'width': 30,
                'rotationAngle': 90,
                'colorBarOnly': true,
              },
              'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
            },
          ],
        },
      ],
      'graticule': false,
      'projection': 'EPSG:4326',
      'mapTime': '',
      'additionalBasemaps': [],
      'viewSettings': {
        'center': {
          'lat': 0,
          'lon': 0,
        },
        'fitExtent': {
          'minLat': -90,
          'minLon': -180,
          'maxLat': 90,
          'maxLon': 180,
        },
        'maxExtent': {
          'minLat': -90,
          'minLon': 'sanitized.-Infinity',
          'maxLat': 90,
          'maxLon': 'sanitized.Infinity',
        },
        'maxZoom': 13,
        'minZoom': 3,
        'zoom': 3,
      },
      'zoomToExtent': true,
    },
    'intro': {
      'termsAndConditions': {
        'require': false,
        'backgroundImage': 'http://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg',
      },
      'splashScreen': {
        'display': true,
        'content': 'intro:splashScreen.content',
        'backgroundImage': 'http://www.hdwallpaperspulse.com/wp-content/uploads/2016/08/24/colorful-background-hd.jpg',
      },
    },
    'controls': {
      'timeline': {
        'opened': false,
        'openedWithNoLayers': false,
        'allowToggle': true,
        'allowToggleWithNoLayers': false,
        'openOnLayerLoad': true,
      },
      'menu': {
        'opened': true,
        'allowToggle': true,
        'activePanel': {
          'panel': 'none',
          'item': '',
          'tab': 'none',
        },
      },
    },
  };

  let expectedDefaultLeafletState = {
    'map': {
      'library': 'leaflet',
      'basemap': 'terrain-light',
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
                'onlineResource': 'Terrain Light { Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a> }',
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
      ],
      'bingMapsApiKey': '',
      'borders': {
        'identifier': 'none',
        'style': 'none',
      },
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
                  'identifier': 'line_black',
                },
                {
                  'identifier': 'line-white',
                },
                {
                  'identifier': 'line',
                },
              ],
              'layerServer': 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
            },
          ],
        },
      ],
      'data': [],
      'dataLayers': [
        {
          'identifier': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
          'version': '1.3.0',
          'url': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
          'service': {
            'title': {
              'und': 'PML RSG THREDDS Data Server',
            },
            'abstract': {
              'und': 'Scientific Data',
            },
            'keywords': {
              'und': [
                'meteorology',
                'atmosphere',
                'climate',
                'ocean',
                'earth science',
              ],
            },
            'onlineResource': 'http://www.pml.ac.uk',
            'contactInformation': {
              'person': 'Remote Sensing Group',
              'phone': [
                '',
              ],
              'email': [
                'rsgweb@pml.ac.uk',
              ],
            },
          },
          'capability': {
            'getMap': {
              'formats': [
                'image/png',
                'image/png;mode=32bit',
                'image/gif',
                'image/jpeg',
                'application/vnd.google-earth.kmz',
              ],
              'get': [
                'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
              ],
            },
            'getFeatureInfo': {
              'formats': [
                'image/png',
                'text/xml',
              ],
              'get': [
                'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
              ],
            },
          },
          'layers': [
            {
              'identifier': 'chlor_a',
              'protocol': 'wms',
              'modifier': 'hasTime',
              'title': {
                'und': 'mass_concentration_of_chlorophyll_a_in_sea_water',
              },
              'abstract': {
                'und': 'Chlorophyll-a concentration in seawater (not log-transformed), generated by SeaDAS using a blended combination of OCI (OC4v6 + Hu\'s CI), OC3 and OC5, depending on water class memberships',
              },
              'styles': [
                {
                  'identifier': 'boxfill/cmocean_speed',
                  'title': {
                    'und': 'boxfill/cmocean_speed',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_speed palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=chlor_a&PALETTE=cmocean_speed',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/rainbow',
                  'title': {
                    'und': 'boxfill/rainbow',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the rainbow palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=chlor_a&PALETTE=rainbow',
                      },
                    },
                  ],
                },
              ],
              'projections': [
                'EPSG:4326',
                'EPSG:3857',
              ],
              'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
              'boundingBox': {
                'minLat': -89.97916412353516,
                'minLon': -179.9791717529297,
                'maxLat': 89.97916412353516,
                'maxLon': 179.9791717529297,
              },
              'dimensions': {
                'time': {
                  'units': 'unknown',
                  'default': '2016-12-31T00:00:00.000Z',
                  'multipleValues': true,
                  'current': true,
                  'values': [
                    '1997-09-04T00:00:00.000Z',
                    '1998-01-11T00:00:00.000Z',
                    '2001-07-05T00:00:00.000Z',
                    '2016-12-31T00:00:00.000Z',
                  ],
                },
              },
              'scale': {
                'height': 500,
                'width': 30,
                'rotationAngle': 90,
                'colorBarOnly': true,
              },
            },
            {
              'identifier': 'Rrs_412',
              'protocol': 'wms',
              'modifier': 'hasTime',
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
                    'und': 'boxfill style, using the cmocean_speed palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_speed',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/ncview',
                  'title': {
                    'und': 'boxfill/ncview',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the ncview palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=ncview',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/occam',
                  'title': {
                    'und': 'boxfill/occam',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the occam palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=occam',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_algae',
                  'title': {
                    'und': 'boxfill/cmocean_algae',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_algae palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_algae',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_oxy',
                  'title': {
                    'und': 'boxfill/cmocean_oxy',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_oxy palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_oxy',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_haline',
                  'title': {
                    'und': 'boxfill/cmocean_haline',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_haline palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_haline',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/sst_36',
                  'title': {
                    'und': 'boxfill/sst_36',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the sst_36 palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=sst_36',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_dense',
                  'title': {
                    'und': 'boxfill/cmocean_dense',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_dense palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_dense',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/orange-descending',
                  'title': {
                    'und': 'boxfill/orange-descending',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the orange-descending palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=orange-descending',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cci_blue_red',
                  'title': {
                    'und': 'boxfill/cci_blue_red',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cci_blue_red palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cci_blue_red',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_turbid',
                  'title': {
                    'und': 'boxfill/cmocean_turbid',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_turbid palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_turbid',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_tempo',
                  'title': {
                    'und': 'boxfill/cmocean_tempo',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_tempo palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_tempo',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_deep',
                  'title': {
                    'und': 'boxfill/cmocean_deep',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_deep palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_deep',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_curl',
                  'title': {
                    'und': 'boxfill/cmocean_curl',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_curl palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_curl',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_thermal',
                  'title': {
                    'und': 'boxfill/cmocean_thermal',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_thermal palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_thermal',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/blue-descending',
                  'title': {
                    'und': 'boxfill/blue-descending',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the blue-descending palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=blue-descending',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/redblue-reverse',
                  'title': {
                    'und': 'boxfill/redblue-reverse',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the redblue-reverse palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=redblue-reverse',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/soil-moisture',
                  'title': {
                    'und': 'boxfill/soil-moisture',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the soil-moisture palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=soil-moisture',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_phase',
                  'title': {
                    'und': 'boxfill/cmocean_phase',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_phase palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_phase',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cci_main',
                  'title': {
                    'und': 'boxfill/cci_main',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cci_main palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cci_main',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/alg',
                  'title': {
                    'und': 'boxfill/alg',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the alg palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=alg',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/orange',
                  'title': {
                    'und': 'boxfill/orange',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the orange palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=orange',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/greyscale',
                  'title': {
                    'und': 'boxfill/greyscale',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the greyscale palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=greyscale',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/greyscale-reverse',
                  'title': {
                    'und': 'boxfill/greyscale-reverse',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the greyscale-reverse palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=greyscale-reverse',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/balance-blue',
                  'title': {
                    'und': 'boxfill/balance-blue',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the balance-blue palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=balance-blue',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_ice',
                  'title': {
                    'und': 'boxfill/cmocean_ice',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_ice palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_ice',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_delta',
                  'title': {
                    'und': 'boxfill/cmocean_delta',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_delta palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_delta',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_balance',
                  'title': {
                    'und': 'boxfill/cmocean_balance',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_balance palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_balance',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_solar',
                  'title': {
                    'und': 'boxfill/cmocean_solar',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_solar palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_solar',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/ferret',
                  'title': {
                    'und': 'boxfill/ferret',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the ferret palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=ferret',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/occam_pastel-30',
                  'title': {
                    'und': 'boxfill/occam_pastel-30',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the occam_pastel-30 palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=occam_pastel-30',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/redblue',
                  'title': {
                    'und': 'boxfill/redblue',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the redblue palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=redblue',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/colour-blind-safe',
                  'title': {
                    'und': 'boxfill/colour-blind-safe',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the colour-blind-safe palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=colour-blind-safe',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/alg2',
                  'title': {
                    'und': 'boxfill/alg2',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the alg2 palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=alg2',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_gray',
                  'title': {
                    'und': 'boxfill/cmocean_gray',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_gray palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_gray',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/blue',
                  'title': {
                    'und': 'boxfill/blue',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the blue palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=blue',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_matter',
                  'title': {
                    'und': 'boxfill/cmocean_matter',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_matter palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_matter',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_amp',
                  'title': {
                    'und': 'boxfill/cmocean_amp',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_amp palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_amp',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/green-descending',
                  'title': {
                    'und': 'boxfill/green-descending',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the green-descending palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=green-descending',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/cmocean_balance_reverse',
                  'title': {
                    'und': 'boxfill/cmocean_balance_reverse',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the cmocean_balance_reverse palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_balance_reverse',
                      },
                    },
                  ],
                },
                {
                  'identifier': 'boxfill/rainbow',
                  'title': {
                    'und': 'boxfill/rainbow',
                  },
                  'abstract': {
                    'und': 'boxfill style, using the rainbow palette',
                  },
                  'legendUrl': [
                    {
                      'width': 110,
                      'height': 264,
                      'format': 'image/png',
                      'onlineResource': {
                        'type': 'simple',
                        'href': 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=rainbow',
                      },
                    },
                  ],
                },
              ],
              'projections': [
                'EPSG:4326',
                'EPSG:3857',
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
                    '2015-12-27T00:00:00.000Z',
                  ],
                },
              },
              'scale': {
                'height': 500,
                'width': 30,
                'rotationAngle': 90,
                'colorBarOnly': true,
              },
              'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
            },
          ],
        },
      ],
      'graticule': false,
      'projection': 'EPSG:4326',
      'mapTime': '',
      'additionalBasemaps': [],
      'viewSettings': {
        'center': {
          'lon': 0,
          'lat': 0.087890625,
        },
        'fitExtent': {
          'minLat': -90,
          'minLon': -180,
          'maxLat': 90,
          'maxLon': 180,
        },
        'maxExtent': {
          'minLat': -90,
          'minLon': 'sanitized.-Infinity',
          'maxLat': 90,
          'maxLon': 'sanitized.Infinity',
        },
        'maxZoom': 13,
        'minZoom': 3,
        'zoom': 3,
      },
      'zoomToExtent': true,
    },
    'intro': {
      'termsAndConditions': {
        'require': false,
        'backgroundImage': 'http://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg',
      },
      'splashScreen': {
        'display': true,
        'content': 'intro:splashScreen.content',
        'backgroundImage': 'http://www.hdwallpaperspulse.com/wp-content/uploads/2016/08/24/colorful-background-hd.jpg',
      },
    },
    'controls': {
      'timeline': {
        'opened': false,
        'openedWithNoLayers': false,
        'allowToggle': true,
        'allowToggleWithNoLayers': false,
        'openOnLayerLoad': true,
      },
      'menu': {
        'opened': true,
        'allowToggle': true,
        'activePanel': {
          'panel': 'none',
          'item': '',
          'tab': 'none',
        },
      },
    },
  };


  before(function(done) {
    this.timeout(5000); // eslint-disable-line no-invalid-this

    /**
     * Called when the map has finished creation and exists as an object.
     */
    function geonaOnReadyOl() {
      console.log('OL is ready.');
      geonaOl = window.geonaOlTest;
      done();
    }
    /**
     * Called when the map has finished creation and exists as an object.
     */
    function geonaOnReadyL() {
      console.log('L is ready.');
      geonaL = window.geonaLTest;
      done();
    }

    window.geonaOnReadyOl = geonaOnReadyOl;
    window.geonaOnReadyL = geonaOnReadyL;

    let config1 = {
      geonaVariable: 'geonaOlTest',
      onReadyCallback: 'geonaOnReadyOl',
      geonaServer: '/geona',
      divId: 'oltest',
    };

    let config2 = {
      geonaVariable: 'geonaLTest',
      onReadyCallback: 'geonaOnReadyL',
      geonaServer: '/geona',
      divId: 'leaftest',
      map: {
        library: 'leaflet',
      },
    };

    // Load the OL map...
    Promise.resolve(load(config1))
      .then(function() {
        console.warn('geonaServer is set to \'' + config1.geonaServer + '\' - please ensure this is the address you want to use for your testing.');
        // ... then load the Leaflet map. This stops a done() being called before one map has finished loading
        Promise.resolve(load(config2))
          .then(function() {
            console.warn('geonaServer is set to \'' + config2.geonaServer + '\' - please ensure this is the address you want to use for your testing.');
          })
          .catch(function(err) {
            console.error(err);
            done();
          });
      })
      .catch(function(err) {
        console.error(err);
        done();
      });
  });

  describe('_saveGeonaState()', function() {
    it('should return the default state for the OpenLayers config', function() {
      let testDefaultOpenLayersState = geonaOl._saveGeonaState();
      expect(testDefaultOpenLayersState).to.deep.equal(JSON.stringify(expectedDefaultOpenLayersState));
    });

    it('should return the updated OpenLayers map state', function() {
      expect.fail();
      // todo - this should ideally make changes to every aspect of the map, controls and intro portions of the config
      // e.g. The map should change center, latlon, data... and then those changes should match the expected config after the changes have been made
    });
    it('should return the default state for the Leaflet config', function() {
      let testDefaultLeafletState = geonaL._saveGeonaState();
      expect(testDefaultLeafletState).to.deep.equal(JSON.stringify(expectedDefaultLeafletState));
    });
    it('should return the updated Leaflet map state', function() {
      expect.fail();
      // todo - this should ideally make changes to every aspect of the map, controls and intro portions of the config
      // e.g. The map should change center, latlon, data... and then those changes should match the expected config after the changes have been made
    });
  });
});

describe('saveGeonaStateToBrowser()', function() {
  it('should save the default state for the OpenLayers config to the browser local storage', function() {
    expect.fail();
    // todo
  });
  it('should save the updated OpenLayers map state to the browser local storage', function() {
    expect.fail();
    // todo
  });
  it('should save the default state for the Leaflet config to the browser local storage', function() {
    expect.fail();
    // todo
  });
  it('should save the updated Leaflet map state to the browser local storage', function() {
    expect.fail();
    // todo
  });
});
