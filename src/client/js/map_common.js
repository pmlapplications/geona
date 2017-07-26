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
 */
export let baselayers = [{
  id: 'EOX',
  title: 'EOX',
  description: 'EPSG:4326 only',
  projections: ['EPSG:4326'],
  source: {
    type: 'wms',
    url: 'https://tiles.maps.eox.at/wms/?',
    crossOrigin: null,
    params: {
      LAYERS: 'terrain-light',
      VERSION: '1.1.1',
      SRS: 'EPSG:4326',
      FORMAT: 'image/jpeg',
      wrapDateLine: true,
    },
    attributions: ['EOX'],
  },
},
{
  id: 'OSM',
  title: 'OSM',
  description: 'EPSG:3857 only',
  projections: ['EPSG:3857'],
  source: {
    type: 'osm',
  },
},
{
  id: 'GEBCO',
  title: 'GEBCO',
  projections: ['EPSG:4326', 'EPSG:3857'],
  source: {
    type: 'wms',
    url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
    crossOrigin: null,
    params: {LAYERS: 'gebco_08_grid', VERSION: '1.1.1', SRS: 'EPSG:4326', FORMAT: 'image/jpeg', wrapDateLine: true},
    attributions: ['GEBCO'],
  },
}];
// ,

export let borderlayers = [{
  id: 'countries_all_white',
  title: 'White border lines',
  source: {
    url: 'https://rsg.pml.ac.uk/geoserver/wms?',
    crossOrigin: null,
    params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line-white'},
  },
},
{
  id: 'countries_all_black',
  title: 'Black border lines',
  source: {
    url: 'https://rsg.pml.ac.uk/geoserver/wms?',
    crossOrigin: null,
    params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line_black'},
  },
},
{
  id: 'countries_all_blue',
  title: 'Blue border lines',
  source: {
    url: 'https://rsg.pml.ac.uk/geoserver/wms?',
    crossOrigin: null,
    params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line'},
  },
}];
