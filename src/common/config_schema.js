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
      default: 'eox',
    },
    projection: {
      default: 'EPSG:4326',
    },
    viewSettings: {
      center: [0, 0],
      minZoom: 12,
      maxZoom: 3,
      zoom: 3,
    },
    graticule: {
      default: false,
    },
    countryBorders: {
      default: 'black',
    },
    bingMapsApiKey: {
      default: '',
    },
  },
};
