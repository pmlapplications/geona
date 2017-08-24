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
        default: true,
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
      default: 'eox',
    },
    bingMapsApiKey: {
      doc: 'An API key to use Bing maps basemaps.',
      format: String,
      default: '',
    },
    countryBorders: {
      doc: 'Which country borders to display, or \'none\'.',
      format: ['white', 'black', 'blue', 'none'],
      default: 'black',
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
    layers: {
      doc: 'Initial layers to load.',
      format: Array,
      default: [
        {
          name: 'chlor_a',
          source: {
            type: 'wms',
            url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY',
            attributions: ['PML Remote Sensing Group'],
            params: {
              layers: 'chlor_a',
              format: 'image/png',
              styles: 'boxfill/alg',
              time: '2015-12-27T00:00:00.000Z',
              wrapDateLine: true,
            },
          },
        },
        {
          name: 'ph_hcmr',
          title: 'pH - Mediterranean Sea - HCMR',
          abstract: 'pH of Mediterranean Sea by HCMR',
          projections: ['EPSG:4326', 'EPSG:3857'],
          source: {
            type: 'wms',
            url: 'http://ogc.hcmr.gr:8080/thredds/wms/POMERSEM_MED_MONTHLY',
            attributions: ['HCMR'],
            params: {
              layers: 'pH',
              version: '1.1.1',
              format: 'image/png',
              styles: 'boxfill/rainbow',
              numColorBands: 255,
              time: '2013-12-15T00:00:00.000Z',
              wrapDateLine: true,
            },
          },
        },
      ],
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
    viewSettings: {
      // Settings for the view.  Basemap specific options may override these.

      center: {
        doc: 'The map center.',
        format: Array,
        default: [0, 0],
      },
      fitExtent: {
        doc: 'Extent to fit the view to. Will override zoom. Array in the format [minLat, minLon, maxLat, maxLon]',
        format: Array,
        default: [-90, -180, 90, 180],
      },
      maxExtent: {
        doc: 'Extent to restrict the view to. Array in the format [minLat, minLon, maxLat, maxLon]',
        format: Array,
        default: [-100, Number.NEGATIVE_INFINITY, 100, Number.POSITIVE_INFINITY],
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
