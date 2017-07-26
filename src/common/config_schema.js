export let server = {
  port: {
    doc: 'Port to run server on',
    format: 'port',
    default: 6789,
  },
  plugins: {
    doc: 'Server plugins to load',
    format: 'Array',
    default: [],
  },
};

export let client = {
  clientDomain: {
    doc: 'The domain that this client config is for',
    format: 'String',
    default: '',
  },
  geonaServer: {
    doc: 'The URL of the geona server to use',
    format: 'String',
    default: '',
  },
  map: {
    library: {
      doc: 'Which map library to use - leaflet or openlayers.',
      format: ['openlayers', 'leaflet'],
      default: 'openlayers',
    },
    divId: {
      default: 'geona',
    },
    basemap: {
      default: 'EOX',
    },
    projection: {
      default: 'EPSG:4326',
    },
    graticules: {
      default: false,
    },
    countryBorders: {
      default: 'countries_all_black',
    },
  },
};
