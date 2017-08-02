/**
 * New basemaps should be added here by defining an object within
 * the baseLayers array. The object must contain the following information:
 * - id
 * - title
 * - description
 * - projections []
 * - source: type - valid types are 'wms','osm','bing'
 *
 * A wms tile must also include the following information:
 * - source: url
 * - source: crossOrigin
 * - source: attributions []
 * - source: params: layers
 * - source: params: version
 * - source: params: format
 * - source: params: wrapDateLine
 *
 * A bing tile must also include the following information:
 * - source: imagerySet
 *
 * The default view options are set as:
 * - zoom: 3
 * - minZoom: 3
 * - maxZoom: 12
 * - center: [0, 0]
 * - extent: undefined
 *
 * If you wish to change one or more these options for a layer, create
 * an object 'viewSettings' at the top layer within the main object
 * (i.e. at the same depth as id, title etc.). Then enter any different
 * settings within this 'viewSettings' object.
 * 'center' and 'extent' should be defined as Lat,Lon (y,x)
 */
export let baseLayers = [
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
        layers: 'terrain-light',
        version: '1.1.1',
        format: 'image/jpeg',
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
        layers: 'gebco_08_grid',
        version: '1.1.1',
        format: 'image/jpeg',
        wrapDateLine: true},
    },
    viewSettings: {
      maxZoom: 7,
    },
  },
  {
    id: 'eoxS2Cloudless',
    title: 'EOX Sentinel-2 Cloudless',
    description: 'EPSG:4326 only, Europe only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: ['EOX Sentinel-2'],
      params: {
        layers: 's2cloudless',
        version: '1.1.1',
        wrapDateLine: true,
      },
    },
    viewSettings: {
      maxZoom: 14,
    },
  },
  {
    id: 'blueMarble',
    title: 'Blue Marble',
    description: 'EPSG:4326 only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: ['Blue Marble Attribution'],
      params: {
        layers: 'bluemarble',
        version: '1.1.1',
        wrapDateLine: true,
      },
    },
    viewSettings: {
      maxZoom: 8,
    },
  },
  {
    id: 'blackMarble',
    title: 'Black Marble',
    description: 'EPSG:4326 only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: ['Black Marble Attribution'],
      params: {
        layers: 'blackmarble',
        version: '1.1.1',
        wrapDateLine: true,
      },
    },
    viewSettings: {
      maxZoom: 8,
    },
  },
  {
    id: 'bingMapsAerial',
    title: 'Bing Maps - Aerial imagery',
    description: 'EPSG:3857 only',
    projections: ['EPSG:3857'],
    source: {
      type: 'bing',
      imagerySet: 'Aerial',
    },
    viewSettings: {
      maxZoom: 19,
    },
  },
  {
    id: 'bingMapsAerialWithLabels',
    title: 'Bing Maps - Aerial imagery with labels',
    description: 'EPSG:3857 only',
    projections: ['EPSG:3857'],
    source: {
      type: 'bing',
      imagerySet: 'AerialWithLabels',
    },
    viewSettings: {
      maxZoom: 19,
    },
  },
  {
    id: 'bingMapsRoad',
    title: 'Bing Maps - Road',
    description: 'EPSG:3857 only',
    projections: ['EPSG:3857'],
    source: {
      type: 'bing',
      imagerySet: 'Road',
    },
    viewSettings: {
      maxZoom: 19,
    },
  },
  {
    id: 'bingMapsOS',
    title: 'Ordnance Survey',
    description: 'EPSG:3857 only, coverage of UK only',
    projections: ['EPSG:3857'],
    source: {
      type: 'bing',
      imagerySet: 'ordnanceSurvey',
    },
    viewSettings: {
      minZoom: 10,
      maxZoom: 16,
      center: [51.502874, -0.126704],
      extent: [49.83, -6.33, 60.87, 1.84],
    },
  },
];

/**
 * New border layers should be added here by defining an object within
 * the borderLayers array. The object must contain the following information:
 * - id
 * - title
 * - source: url
 * - source: crossOrigin
 * - source: params: layers
 * - source: params: version
 * - source: params: styles
 */

export let borderLayers = [
  {
    id: 'white',
    title: 'White border lines',
    source: {
      type: 'border',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {layers: 'rsg:full_10m_borders', version: '1.1.0', styles: 'line-white'},
    },
  },
  {
    id: 'black',
    title: 'Black border lines',
    source: {
      type: 'border',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {layers: 'rsg:full_10m_borders', version: '1.1.0', styles: 'line_black'},
    },
  },
  {
    id: 'blue',
    title: 'Blue border lines',
    source: {
      type: 'border',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {layers: 'rsg:full_10m_borders', version: '1.1.0', styles: 'line'},
    },
  },
];
