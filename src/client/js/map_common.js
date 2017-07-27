/**
 * New base maps should be added here by defining an object within
 * the baselayers array. The object must contain the following information:
 * - id
 * - title
 * - description
 * - projections []
 * - source: type - valid types are 'wms','osm'
 *
 * A wms tile must also include the following information:
 * - source: url
 * - source: crossOrigin
 * - source: attributions []
 * - source: params: LAYERS
 * - source: params: VERSION
 * - source: params: SRS
 * - source: params: FORMAT
 * - source: params: wrapDateLine
 *
 * The default view options are set as:
 * - zoom: 3
 * - minZoom: 3
 * - maxZoom: 12
 * - center: [0, 0]
 *
 * If you wish to change one or more these options for a layer, create
 * an object 'viewSettings' at the top layer within the main object
 * (i.e. at the same depth as id, title etc.). Then enter any different
 * settings within this 'viewSettings' object.
 */
export let baselayers = [
  {
    id: 'eox',
    title: 'EOX',
    description: 'EPSG:4326 only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: ['EOX'],
      params: {
        LAYERS: 'terrain-light',
        VERSION: '1.1.1',
        SRS: 'EPSG:4326',
        FORMAT: 'image/jpeg',
        wrapDateLine: true,
      },
    },
    viewSettings: {
      maxZoom: 13,
    },
  },
  {
    id: 'osm',
    title: 'OSM',
    description: 'EPSG:3857 only',
    projections: ['EPSG:3857'],
    source: {
      type: 'osm',
    },
    viewSettings: {
      maxZoom: 19,
    },
  },
  {
    id: 'gebco',
    title: 'GEBCO',
    projections: ['EPSG:4326', 'EPSG:3857'],
    source: {
      type: 'wms',
      url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
      crossOrigin: null,
      attributions: ['GEBCO'],
      params: {
        LAYERS: 'gebco_08_grid',
        VERSION: '1.1.1',
        SRS: 'EPSG:4326',
        FORMAT: 'image/jpeg',
        wrapDateLine: true},
    },
    viewSettings: {
      maxZoom: 7,
    },
  },
];

/**
 * New base maps should be added here by defining an object within
 * the baselayers array. The object must contain the following information:
 * - id
 * - title
 * - source: url
 * - source: crossOrigin
 * - source: params: LAYERS
 * - source: params: VERSION
 * - source: params: STYLES
 */

export let borderlayers = [
  {
    id: 'white',
    title: 'White border lines',
    source: {
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line-white'},
    },
  },
  {
    id: 'black',
    title: 'Black border lines',
    source: {
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line_black'},
    },
  },
  {
    id: 'blue',
    title: 'Blue border lines',
    source: {
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line'},
    },
  },
];
