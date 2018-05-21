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
  subFolderPath: {
    doc: 'If you wish to run the application in a subfolder then specify the path here; sub-sub-folders are permitted',
    format: String,
    default: '',
  },
};

export let client = {
  clientDomain: {
    doc: 'The domain that this client config is for. Only required when loading client config from the server.',
    format: String,
    default: '',
  },
  geonaServer: {
    doc: 'The URL of the geona server to use, including "http://" or "https://", and without a trailing "/". This value should be set if you intend to run Geona in a sub-directory',
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
        default: true,
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
      allowToggle: {
        doc: 'Whether the controls to show and hide the menu are shown.',
        format: Boolean,
        default: true,
      },
      activePanel: {
        panel: {
          doc: 'The menu panel that should be displayed when the menu is opened.',
          format: ['none', 'explore', 'layers', 'analysis', 'login', 'options', 'help', 'share'],
          default: 'none',
        },
        item: {
          doc: 'Used if panel is set to \'layers\' and tab is not set to \'none\'. The layer item on the layers panel which should be open',
          format: String,
          default: '',
        },
        tab: {
          doc: 'Used if panel is set to \'layers\' and item is not set to \'\'. The tab that should be open for the layer item.',
          format: ['none', 'settings', 'info', 'analysis'],
          default: 'none',
        },
      },
    },
    timeline: {
      opened: {
        doc: 'Whether the timeline is displayed on load.',
        format: Boolean,
        default: true,
      },
      openedWithNoLayers: {
        doc: 'Whether the timeline is displayed on load when there are no active layers.',
        format: Boolean,
        default: false,
      },
      allowToggle: {
        doc: 'Whether the controls to show and hide the timeline are shown.',
        format: Boolean,
        default: true,
      },
      allowToggleWithNoLayers: {
        doc: 'Whether the controls to show and hide the timeline are shown when there are no active data layers.',
        format: Boolean,
        default: false,
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
      identifier: {
        doc: 'The identifier for the borders layer, or \'none\'.',
        format: String,
        default: 'none',
      },
      style: {
        doc: 'The identifier for the requested style of the layer, or \'none\'.',
        format: String,
        default: 'none',
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
                  identifier: 'line_black',
                },
                {
                  identifier: 'line-white',
                },
                {
                  identifier: 'line',
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
      default: [],
      // default: ['Rrs_412', 'chlor_a'],
      // default: ['chlor_a', 'Rrs_412'],
    },
    dataLayers: {
      doc: 'The Geona-style definitions of all data to be made available by default.',
      format: Array,
      default: [
        {
          identifier: 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
          version: '1.3.0',
          url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
          service: {
            title: {
              und: 'PML RSG THREDDS Data Server',
            },
            abstract: {
              und: 'Scientific Data',
            },
            keywords: {
              und: ['meteorology', 'atmosphere', 'climate', 'ocean', 'earth science'],
            },
            onlineResource: 'http://www.pml.ac.uk',
            contactInformation: {
              person: 'Remote Sensing Group',
              phone: [
                '',
              ],
              email: [
                'rsgweb@pml.ac.uk',
              ],
            },
          },
          capability: {
            getMap: {
              formats: [
                'image/png',
                'image/png;mode=32bit',
                'image/gif',
                'image/jpeg',
                'application/vnd.google-earth.kmz',
              ],
              get: [
                'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
              ],
            },
            getFeatureInfo: {
              formats: [
                'image/png',
                'text/xml',
              ],
              get: [
                'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY',
              ],
            },
          },
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
                {
                  identifier: 'boxfill/rainbow',
                  title: {
                    und: 'boxfill/rainbow',
                  },
                  abstract: {
                    und: 'boxfill style, using the rainbow palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=chlor_a&PALETTE=rainbow',
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
                    '1998-01-11T00:00:00.000Z',
                    '1997-09-04T00:00:00.000Z',
                    '2001-07-05T00:00:00.000Z',
                  ],
                },
              },
              scale: {
                height: 500,
                width: 30,
                rotationAngle: 90,
                colorBarOnly: true,
              },
            },
            {
              identifier: 'Rrs_412',
              protocol: 'wms',
              modifier: 'hasTime',
              title: {
                und: 'surface_ratio_of_upwelling_radiance_emerging_from_sea_water_to_downwelling_radiative_flux_in_air',
              },
              abstract: {
                und: 'Sea surface reflectance defined as the ratio of water-leaving radiance to surface irradiance at 412 nm.',
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
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_speed',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/ncview',
                  title: {
                    und: 'boxfill/ncview',
                  },
                  abstract: {
                    und: 'boxfill style, using the ncview palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=ncview',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/occam',
                  title: {
                    und: 'boxfill/occam',
                  },
                  abstract: {
                    und: 'boxfill style, using the occam palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=occam',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_algae',
                  title: {
                    und: 'boxfill/cmocean_algae',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_algae palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_algae',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_oxy',
                  title: {
                    und: 'boxfill/cmocean_oxy',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_oxy palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_oxy',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_haline',
                  title: {
                    und: 'boxfill/cmocean_haline',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_haline palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_haline',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/sst_36',
                  title: {
                    und: 'boxfill/sst_36',
                  },
                  abstract: {
                    und: 'boxfill style, using the sst_36 palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=sst_36',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_dense',
                  title: {
                    und: 'boxfill/cmocean_dense',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_dense palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_dense',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/orange-descending',
                  title: {
                    und: 'boxfill/orange-descending',
                  },
                  abstract: {
                    und: 'boxfill style, using the orange-descending palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=orange-descending',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cci_blue_red',
                  title: {
                    und: 'boxfill/cci_blue_red',
                  },
                  abstract: {
                    und: 'boxfill style, using the cci_blue_red palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cci_blue_red',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_turbid',
                  title: {
                    und: 'boxfill/cmocean_turbid',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_turbid palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_turbid',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_tempo',
                  title: {
                    und: 'boxfill/cmocean_tempo',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_tempo palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_tempo',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_deep',
                  title: {
                    und: 'boxfill/cmocean_deep',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_deep palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_deep',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_curl',
                  title: {
                    und: 'boxfill/cmocean_curl',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_curl palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_curl',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_thermal',
                  title: {
                    und: 'boxfill/cmocean_thermal',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_thermal palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_thermal',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/blue-descending',
                  title: {
                    und: 'boxfill/blue-descending',
                  },
                  abstract: {
                    und: 'boxfill style, using the blue-descending palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=blue-descending',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/redblue-reverse',
                  title: {
                    und: 'boxfill/redblue-reverse',
                  },
                  abstract: {
                    und: 'boxfill style, using the redblue-reverse palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=redblue-reverse',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/soil-moisture',
                  title: {
                    und: 'boxfill/soil-moisture',
                  },
                  abstract: {
                    und: 'boxfill style, using the soil-moisture palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=soil-moisture',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_phase',
                  title: {
                    und: 'boxfill/cmocean_phase',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_phase palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_phase',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cci_main',
                  title: {
                    und: 'boxfill/cci_main',
                  },
                  abstract: {
                    und: 'boxfill style, using the cci_main palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cci_main',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/alg',
                  title: {
                    und: 'boxfill/alg',
                  },
                  abstract: {
                    und: 'boxfill style, using the alg palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=alg',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/orange',
                  title: {
                    und: 'boxfill/orange',
                  },
                  abstract: {
                    und: 'boxfill style, using the orange palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=orange',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/greyscale',
                  title: {
                    und: 'boxfill/greyscale',
                  },
                  abstract: {
                    und: 'boxfill style, using the greyscale palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=greyscale',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/greyscale-reverse',
                  title: {
                    und: 'boxfill/greyscale-reverse',
                  },
                  abstract: {
                    und: 'boxfill style, using the greyscale-reverse palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=greyscale-reverse',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/balance-blue',
                  title: {
                    und: 'boxfill/balance-blue',
                  },
                  abstract: {
                    und: 'boxfill style, using the balance-blue palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=balance-blue',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_ice',
                  title: {
                    und: 'boxfill/cmocean_ice',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_ice palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_ice',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_delta',
                  title: {
                    und: 'boxfill/cmocean_delta',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_delta palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_delta',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_balance',
                  title: {
                    und: 'boxfill/cmocean_balance',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_balance palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_balance',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_solar',
                  title: {
                    und: 'boxfill/cmocean_solar',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_solar palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_solar',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/ferret',
                  title: {
                    und: 'boxfill/ferret',
                  },
                  abstract: {
                    und: 'boxfill style, using the ferret palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=ferret',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/occam_pastel-30',
                  title: {
                    und: 'boxfill/occam_pastel-30',
                  },
                  abstract: {
                    und: 'boxfill style, using the occam_pastel-30 palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=occam_pastel-30',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/redblue',
                  title: {
                    und: 'boxfill/redblue',
                  },
                  abstract: {
                    und: 'boxfill style, using the redblue palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=redblue',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/colour-blind-safe',
                  title: {
                    und: 'boxfill/colour-blind-safe',
                  },
                  abstract: {
                    und: 'boxfill style, using the colour-blind-safe palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=colour-blind-safe',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/alg2',
                  title: {
                    und: 'boxfill/alg2',
                  },
                  abstract: {
                    und: 'boxfill style, using the alg2 palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=alg2',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_gray',
                  title: {
                    und: 'boxfill/cmocean_gray',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_gray palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_gray',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/blue',
                  title: {
                    und: 'boxfill/blue',
                  },
                  abstract: {
                    und: 'boxfill style, using the blue palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=blue',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_matter',
                  title: {
                    und: 'boxfill/cmocean_matter',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_matter palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_matter',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_amp',
                  title: {
                    und: 'boxfill/cmocean_amp',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_amp palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_amp',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/green-descending',
                  title: {
                    und: 'boxfill/green-descending',
                  },
                  abstract: {
                    und: 'boxfill style, using the green-descending palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=green-descending',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/cmocean_balance_reverse',
                  title: {
                    und: 'boxfill/cmocean_balance_reverse',
                  },
                  abstract: {
                    und: 'boxfill style, using the cmocean_balance_reverse palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=cmocean_balance_reverse',
                      },
                    },
                  ],
                },
                {
                  identifier: 'boxfill/rainbow',
                  title: {
                    und: 'boxfill/rainbow',
                  },
                  abstract: {
                    und: 'boxfill style, using the rainbow palette',
                  },
                  legendUrl: [
                    {
                      width: 110,
                      height: 264,
                      format: 'image/png',
                      onlineResource: {
                        type: 'simple',
                        href: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?REQUEST=GetLegendGraphic&LAYER=Rrs_412&PALETTE=rainbow',
                      },
                    },
                  ],
                },
              ],
              projections: [
                'EPSG:4326',
                'EPSG:3857',
              ],
              boundingBox: {
                minLat: '-89.97916412353516',
                minLon: '-179.9791717529297',
                maxLat: '89.97916412353516',
                maxLon: '179.9791717529297',
              },
              dimensions: {
                time: {
                  units: 'unknown',
                  default: '2015-12-27T00:00:00.000Z',
                  multipleValues: true,
                  nearestValue: false,
                  current: true,
                  values: [
                    // '1997-09-04T00:00:00.000Z',
                    // '1998-01-11T00:00:00.000Z',
                    // '2005-06-20T00:00:00.000Z',
                    '2015-12-27T00:00:00.000Z',
                  ],
                },
              },
              scale: {
                height: 500,
                width: 30,
                rotationAngle: 90,
                colorBarOnly: true,
              },
              layerServer: 'https__rsg.pml.ac.uk_thredds_wms_cci_all-v3.1-5day__wms_1.3.0_getcapabilities',
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
    mapTime: {
      doc: 'The current time that the entire map is set to. Individual layers may have different times loaded if they do not support the exact map time.',
      format: String,
      default: '',
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
    zoomToExtent: {
      doc: 'Whether to zoom and center the map on layers with defined extents/bounds.',
      format: Boolean,
      default: true,
    },
  },
};
