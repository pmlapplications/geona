/*
 * Default basemaps.
 *
 * Basemap object format:
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
 * {Array}  viewSettings.extent   The extent of this basemap. Array in the format [minLat, minLon, maxLat, maxLon].
 *                                Defaults to [-90, -180, 90, 180].
 * {Number} viewSettings.maxZoom  The maximum (closest) allowed zoom.
 *                                Defaults to 12.
 * {Number} viewSettings.minZoom  The minimum (furthest) allowed zoom.
 *                                Defaults to 3.
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
        // TODO these should be lowercase
        LAYERS: 'terrain-light',
        VERSION: '1.1.1',
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
        FORMAT: 'image/jpeg',
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
      params: {
        LAYERS: 's2cloudless',
        VERSION: '1.1.1',
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
      params: {
        LAYERS: 'bluemarble',
        VERSION: '1.1.1',
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
      params: {
        LAYERS: 'blackmarble',
        VERSION: '1.1.1',
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
      defaultCenter: [53.825564, -2.421976],
      extent: [-6.33, 49.83, -0.77, 60.87],
    },
  },
];

/**
 * Default border layers.
 *
 * The object format is the same as for basemaps.
 * Additional border layers also need to be added to config_schema.js in client.map.countryBorders.format.
 */
export let borderLayers = [
  {
    id: 'white',
    title: 'White border lines',
    projections: ['EPSG:4326', 'EPSG:3857'],
    source: {
      type: 'wms',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {
        LAYERS: 'rsg:full_10m_borders',
        VERSION: '1.1.0',
        STYLES: 'line-white',
      },
    },
  },
  {
    id: 'black',
    title: 'Black border lines',
    projections: ['EPSG:4326', 'EPSG:3857'],
    source: {
      type: 'wms',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {
        LAYERS: 'rsg:full_10m_borders',
        VERSION: '1.1.0',
        STYLES: 'line_black',
      },
    },
  },
  {
    id: 'blue',
    title: 'Blue border lines',
    projections: ['EPSG:4326', 'EPSG:3857'],
    source: {
      type: 'wms',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {
        LAYERS: 'rsg:full_10m_borders',
        VERSION: '1.1.0',
        STYLES: 'line',
      },
    },
  },
];
