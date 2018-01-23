/** @module config_schema */

export let server = {
  port: {
    doc: 'Port to run server on.',
    format: 'port',
    default: 6789,
  },
  plugins: {
    doc: 'Server plugins to load.',
    format: Array,
    default: [],
  },
};

export let client = {
  clientDomain: {
    doc: 'The domain that this client config is for. Only required when loading client config from the server.',
    format: String,
    default: '',
  },
  geonaServer: {
    doc: 'The URL of the geona server to use, including "http://" or "https://", and without a trailing "/".',
    format: String,
    default: '',
  },
  divId: {
    doc: 'The div ID to put the Geona instance in.',
    format: String,
    default: '#geona',
  },
  geonaVariable: {
    doc: 'The string name of a global (window) variable to store the geona instance in as soon as it is created (before it\'s finished initializing).',
    format: String,
    default: '',
  },
  onReadyCallback: {
    doc: 'The string name of a global (window) function to call when geona has finished initializing. The geona instance is provided as the only parameter.',
    format: String,
    default: '',
  },
  intro: {
    termsAndConditions: {
      require: {
        doc: 'Whether we will display and require accepting the terms and conditions on page load.',
        format: Boolean,
        default: false,
      },
      backgroundImage: {
        doc: 'The image to use as the background on the terms and conditions screen.',
        format: String,
        default: 'http://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg',
      },
    },
    splashScreen: {
      display: {
        doc: 'Whether we will display the splash screen on page load.',
        format: Boolean,
        default: false,
      },
      content: {
        doc: 'The HTML (or a translation key) that will be displayed on the splash screen.',
        format: String,
        default: 'intro:splashScreen.content',
      },
      backgroundImage: {
        doc: 'The image to use as the background on the splash screen.',
        format: String,
        default: 'http://www.hdwallpaperspulse.com/wp-content/uploads/2016/08/24/colorful-background-hd.jpg',
      },
    },
  },
  controls: {
    menu: {
      opened: {
        doc: 'Whether the full menu is displayed on load.',
        format: Boolean,
        default: true,
      },
      collapsible: {
        doc: 'Whether the controls to show and hide the menu are shown.',
        format: Boolean,
        default: true,
      },
    },
    timeline: {
      opened: {
        doc: 'Whether the timeline is displayed on load.',
        format: Boolean,
        default: true,
      },
      collapsible: {
        doc: 'Whether the controls to show and hide the timeline are shown.',
        format: Boolean,
        default: true,
      },
      openOnLayerLoad: {
        doc: 'Whether the timeline should be opened when a layer is added to the map.',
        format: Boolean,
        default: true,
      },
    },
  },
  map: {
    /* Most important options */
    library: {
      doc: 'Which map library to use.',
      format: ['openlayers', 'leaflet'],
      default: 'openlayers',
    },

    /* Common options */
    basemap: {
      doc: 'The basemap to use, or \'none\'.',
      format: String,
      default: 'terrain-light',
    },
    basemapLayers: {
      doc: 'The Geona-style definitions of all basemaps to be made available by default',
      format: Array,
      default: [
        {
          identifier: 'https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities',
          version: '1.1.1',
          url: 'https://tiles.maps.eox.at/wms/?',
          layers: [
            {
              protocol: 'wms',
              identifier: 'terrain-light',
              modifier: 'basemap',
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
              layerServer: 'https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities',
              viewSettings: {
                maxZoom: 13,
              },
            },
          ],
        },
      ],
    },
    bingMapsApiKey: {
      doc: 'An API key to use Bing maps basemaps.',
      format: String,
      default: '',
    },
    // Takes an identifier and a style (for no borders, just set both to 'none')
    borders: {
      doc: 'Which country borders to display, or \'none\'.',
      format: Object,
      default: {
        identifier: 'rsg:full_10m_borders',
        style: 'line_black',
      },
    },
    bordersLayers: {
      doc: 'The Geona-style definitions of all borders layers to be made available by default',
      format: Array,
      default: [
        {
          identifier: 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
          version: '1.1.0',
          url: 'https://rsg.pml.ac.uk/geoserver/wms?',
          layers: [
            {
              identifier: 'rsg:full_10m_borders',
              protocol: 'wms',
              modifier: 'borders',
              title: {
                und: 'Country border lines',
              },
              projections: ['EPSG:4326', 'EPSG:3857'],
              formats: ['image/png'],
              isTemporal: false,
              styles: [
                {
                  name: 'line_black',
                },
                {
                  name: 'line-white',
                },
                {
                  name: 'line',
                },
              ],
              layerServer: 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
            },
          ],
        },
      ],
    },
    data: {
      doc: 'The identifier for the data layers to put on the map by default.',
      format: Array,
      default: ['Rrs_412'],
    },
    // Required parameters: 'identifier', 'protocol', 'projections', 'layerServer'
    // Required layerServer parameters: 'layers', 'version', 'url'
    dataLayers: {
      doc: 'The Geona-style definitions of all data to be made available by default.',
      format: Array,
      default: [
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
                'EPSG:4326',
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
        {
          identifier: 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities',
          version: '1.3.0',
          url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY',
          layers: [
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
                  identifier: 'boxfill/cmocean_speed',
                  title: {
                    und: 'boxfill/cmocean_speed',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_speed palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/ncview',
                  title: {
                    und: 'boxfill/ncview',
                  },
                  abstract: {
                    und: 'boxfill style, using the ncview palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/occam',
                  title: {
                    und: 'boxfill/occam',
                  },
                  abstract: {
                    und: 'boxfill style, using the occam palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_algae',
                  title: {
                    und: 'boxfill/cmocean_algae',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_algae palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_oxy',
                  title: {
                    und: 'boxfill/cmocean_oxy',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_oxy palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_haline',
                  title: {
                    und: 'boxfill/cmocean_haline',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_haline palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/sst_36',
                  title: {
                    und: 'boxfill/sst_36',
                  },
                  abstract: {
                    und: 'boxfill style, using the sst_36 palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_dense',
                  title: {
                    und: 'boxfill/cmocean_dense',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_dense palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/orange-descending',
                  title: {
                    und: 'boxfill/orange-descending',
                  },
                  abstract: {
                    und: 'boxfill style, using the orange-descending palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cci_blue_red',
                  title: {
                    und: 'boxfill/cci_blue_red',
                  },
                  abstract: {
                    und: 'boxfill style, using the cci_blue_red palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_turbid',
                  title: {
                    und: 'boxfill/cmocean_turbid',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_turbid palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_tempo',
                  title: {
                    und: 'boxfill/cmocean_tempo',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_tempo palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_deep',
                  title: {
                    und: 'boxfill/cmocean_deep',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_deep palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_curl',
                  title: {
                    und: 'boxfill/cmocean_curl',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_curl palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_thermal',
                  title: {
                    und: 'boxfill/cmocean_thermal',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_thermal palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/blue-descending',
                  title: {
                    und: 'boxfill/blue-descending',
                  },
                  abstract: {
                    und: 'boxfill style, using the blue-descending palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/redblue-reverse',
                  title: {
                    und: 'boxfill/redblue-reverse',
                  },
                  abstract: {
                    und: 'boxfill style, using the redblue-reverse palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/soil-moisture',
                  title: {
                    und: 'boxfill/soil-moisture',
                  },
                  abstract: {
                    und: 'boxfill style, using the soil-moisture palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_phase',
                  title: {
                    und: 'boxfill/cmocean_phase',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_phase palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/alg',
                  title: {
                    und: 'boxfill/alg',
                  },
                  abstract: {
                    und: 'boxfill style, using the alg palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cci_main',
                  title: {
                    und: 'boxfill/cci_main',
                  },
                  abstract: {
                    und: 'boxfill style, using the cci_main palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/orange',
                  title: {
                    und: 'boxfill/orange',
                  },
                  abstract: {
                    und: 'boxfill style, using the orange palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/greyscale',
                  title: {
                    und: 'boxfill/greyscale',
                  },
                  abstract: {
                    und: 'boxfill style, using the greyscale palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/greyscale-reverse',
                  title: {
                    und: 'boxfill/greyscale-reverse',
                  },
                  abstract: {
                    und: 'boxfill style, using the greyscale-reverse palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/balance-blue',
                  title: {
                    und: 'boxfill/balance-blue',
                  },
                  abstract: {
                    und: 'boxfill style, using the balance-blue palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_ice',
                  title: {
                    und: 'boxfill/cmocean_ice',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_ice palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_delta',
                  title: {
                    und: 'boxfill/cmocean_delta',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_delta palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_balance',
                  title: {
                    und: 'boxfill/cmocean_balance',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_balance palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_solar',
                  title: {
                    und: 'boxfill/cmocean_solar',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_solar palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/occam_pastel-30',
                  title: {
                    und: 'boxfill/occam_pastel-30',
                  },
                  abstract: {
                    und: 'boxfill style, using the occam_pastel-30 palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/ferret',
                  title: {
                    und: 'boxfill/ferret',
                  },
                  abstract: {
                    und: 'boxfill style, using the ferret palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/redblue',
                  title: {
                    und: 'boxfill/redblue',
                  },
                  abstract: {
                    und: 'boxfill style, using the redblue palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/colour-blind-safe',
                  title: {
                    und: 'boxfill/colour-blind-safe',
                  },
                  abstract: {
                    und: 'boxfill style, using the colour-blind-safe palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/alg2',
                  title: {
                    und: 'boxfill/alg2',
                  },
                  abstract: {
                    und: 'boxfill style, using the alg2 palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_gray',
                  title: {
                    und: 'boxfill/cmocean_gray',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_gray palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/blue',
                  title: {
                    und: 'boxfill/blue',
                  },
                  abstract: {
                    und: 'boxfill style, using the blue palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_matter',
                  title: {
                    und: 'boxfill/cmocean_matter',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_matter palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_amp',
                  title: {
                    und: 'boxfill/cmocean_amp',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_amp palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/green-descending',
                  title: {
                    und: 'boxfill/green-descending',
                  },
                  abstract: {
                    und: 'boxfill style, using the green-descending palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_balance_reverse',
                  title: {
                    und: 'boxfill/cmocean_balance_reverse',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_balance_reverse palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
                    },
                  ],
                },
                {
                  identifier: 'boxfill/rainbow',
                  title: {
                    und: 'boxfill/rainbow',
                  },
                  abstract: {
                    und: 'boxfill style, using the rainbow palette ',
                  },
                  legendUrl: [
                    {
                      width: '110',
                      height: '264',
                      format: 'image/png',
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
                    '1997-09-04T00:00:00.000Z',
                    '1998-01-11T00:00:00.000Z',
                    '2005-06-20T00:00:00.000Z',
                    '2015-12-27T00:00:00.000Z',
                  ],
                },
              },
              'layerServer': 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.0-5day__wms_1.3.0_getcapabilities',
            },
          ],
        },
      ],
    },
    graticule: {
      doc: 'Display a graticule or not.',
      format: Boolean,
      default: false,
    },
    projection: {
      doc: 'The projection to use. Must be supported by the chosen basemap.',
      format: ['EPSG:3857', 'EPSG:4326'],
      default: 'EPSG:4326',
    },

    /* Other options */
    additionalBasemaps: {
      doc: 'Basemaps to add in addition to the defaults.',
      format: Array,
      default: [],
      /* Basemap object format:
       * {String} id                    ID for this basemap
       * {String} title
       * {String} description
       * {Array}  projections           Projections supported
       * {Object} source
       * {String} source.type           The type of basemap - wms, osm, bing
       *
       * For a WMS source:
       *   {String} source.url          WMS url
       *   {String} source.crossOrigin  The crossOrigin attribute for loaded images
       *   {String} source.attributions
       *   {Object} source.params       WMS request parameters
       *
       * For a Bing source:
       *   {String} source.imagerySet   Bing imagery to use
       *
       * {Object} viewSettings          View settings for this basemap
       * {Number} viewSettings.center   Map center to move to when loading this basemap.
       *                                Defaults to undefined
       * {Array}  viewSettings.extent   The extent of this basemap. Array in the format [minLat, minLon, maxLat, maxLon]
       *                                Defaults to [-90, -180, 90, 180].
       * {Number} viewSettings.maxZoom  The maximum (closest) allowed zoom.
       *                                Defaults to 12.
       * {Number} viewSettings.minZoom  The minimum (furthest) allowed zoom.
       *                                Defaults to 3.
       */
    },
    // Settings for the view.  Basemap specific options may override these.
    viewSettings: {
      // The coordinate the map is intially centered on, in the form {lat, lon}
      center: {
        lat: {
          doc: 'The latitude of the initial map centerpoint.',
          format: Number,
          default: 0,
        },
        lon: {
          doc: 'The longitude of the initial map centerpoint.',
          format: Number,
          default: 0,
        },
      },
      // TODO does this override center?
      // Soft extent to fit the view to (panning beyond the soft extent is allowed). Will override zoom.
      // Object in the format {minLat, minLon, maxLat, maxLon}
      fitExtent: {
        minLat: {
          doc: 'The west-most latitude of the initial map soft extent.',
          format: Number,
          default: -90,
        },
        minLon: {
          doc: 'The south-most longitude of the initial map soft extent.',
          format: Number,
          default: -180,
        },
        maxLat: {
          doc: 'The east-most latitude of the initial map soft extent.',
          format: Number,
          default: 90,
        },
        maxLon: {
          doc: 'The north-most longitude of the initial map soft extent.',
          format: Number,
          default: 180,
        },
      },
      maxExtent: {
        // Max extent to restrict the view to (panning beyond the max extent is not possible).
        // Object in the format {minLat, minLon, maxLat, maxLon}
        minLat: {
          doc: 'The west-most latitude of the map max extent.',
          format: Number,
          default: -90,
        },
        minLon: {
          doc: 'The south-most longitude of the map max extent.',
          format: Number,
          default: Number.NEGATIVE_INFINITY,
        },
        maxLat: {
          doc: 'The east-most latitude of the map max extent.',
          format: Number,
          default: 90,
        },
        maxLon: {
          doc: 'The north-most longitude of the map max extent.',
          format: Number,
          default: Number.POSITIVE_INFINITY,
        },
      },
      maxZoom: {
        doc: 'The maximum (closest) allowed zoom.',
        format: Number,
        default: 12,
      },
      minZoom: {
        doc: 'The minimum (furthest) allowed zoom.',
        format: Number,
        default: 3,
      },
      zoom: {
        doc: 'The starting zoom level.',
        format: Number,
        default: 3,
      },
    },
  },
};
