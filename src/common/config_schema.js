export let server = {
  port: {
    doc: 'Port to run server on.',
    format: 'port',
    default: 6789,
  },
  plugins: {
    doc: 'Server plugins to load.',
    format: 'Array',
    default: [],
  },
};

export let client = {
  clientDomain: {
    doc: 'The domain that this client config is for.',
    format: 'String',
    default: '',
  },
  geonaServer: {
    doc: 'The URL of the geona server to use.',
    format: 'String',
    default: '',
  },
  map: {
    // Most important options
    divId: {
      doc: 'The div to put the map in.',
      format: 'String',
      default: 'geona',
    },
    library: {
      doc: 'Which map library to use.',
      format: ['openlayers', 'leaflet'],
      default: 'openlayers',
    },

    // Common options
    basemap: {
      doc: 'The basemap to use, or \'none\'.',
      format: 'String',
      default: 'eox',
    },
    bingMapsApiKey: {
      doc: 'An API key to use Bing maps basemaps.',
      format: 'String',
      default: '',
    },
    countryBorders: {
      doc: 'Which country borders to display, or \'none\'.',
      format: ['white', 'black', 'blue', 'none'],
      default: 'black',
    },
    graticule: {
      doc: 'Display a graticule or not.',
      format: 'Boolean',
      default: false,
    },
    projection: {
      doc: 'The projection to use. Must be supported by the chosen basemap.',
      format: ['EPSG:3857', 'EPSG:4326'],
      default: 'EPSG:4326',
    },

    // Other options
    additionalBasemaps: {
      doc: 'Basemaps to add in addition to the defaults.',
      format: 'Array',
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
       *   {Array}  source.attributions
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
      doc: 'Settings for the view.  Basemap specific options may override these.',

      center: {
        doc: 'The map center.',
        format: 'Array',
        default: [0, 0],
      },
      fitExtent: {
        doc: 'Extent to fit the view to. Will override zoom. Array in the format [minLat, minLon, maxLat, maxLon]',
        format: 'Array',
        default: [-90, -180, 90, 180],
      },
      maxExtent: {
        doc: 'Extent to restrict the view to. Array in the format [minLat, minLon, maxLat, maxLon]',
        format: 'Array',
        default: [-90, -180, 90, 180],
      },
      maxZoom: {
        doc: 'The maximum (closest) allowed zoom.',
        format: 'Number',
        default: 12,
      },
      minZoom: {
        doc: 'The minimum (furthest) allowed zoom.',
        format: 'Number',
        default: 3,
      },
      zoom: {
        doc: 'The starting zoom level.',
        format: 'Number',
        default: 3,
      },
    },
  },
};
