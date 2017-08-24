/**
 * Variables and functions common to all map types.
 */

/**
 * Add the default options to a layer definition.
 * @param  {Object} layer A layer definition
 * @return {Object}         The layer with defaults added
 */
export function addLayerDefaults(layer) {
  switch (layer.source.type) {
    case 'wms':
      if (layer.source.crossOrigin === undefined) {
        layer.source.crossOrigin = null;
      }
      layer.source.params.version = layer.source.params.version || '1.1.1';
      layer.source.params.format = layer.source.params.format || 'image/jpeg';
      if (layer.source.params.wrapDateLine === undefined) {
        layer.source.params.wrapDateLine = true;
      }
  }
  return layer;
}

/**
 * Format a latitude or longitude label for a graticule line.
 * @param  {Number} latLonValue    The lat or lon value
 * @param  {String} positiveEnding Ending to use for positive values. For example, 'N'
 * @param  {String} negativeEnding Ending to use for negative values. For example, 'S'
 * @return {String}                The formatted string
 */
export function latLonLabelFormatter(latLonValue, positiveEnding, negativeEnding) {
  // Modulus with floats is evil, so convert our latLonValue to an integer first
  let value = Math.round(latLonValue.toFixed(2) * 100);

  // Equivalent to if (latLonValue % 0.1 === 0)
  if (value % 10 === 0) {
    // If the value is divisible by 0.1

    // Convert back to a float
    value = value / 100;

    // Adjust the value if the map has wrapped around
    while (value > 180) {
      // If it is greater than 180, reduce it by 360 until is is less than 180
      value = value - 360;
    }
    while (value < -180) {
      // If it is less than -180, increase it by 360 until is is greater than -180
      value = value + 360;
    }

    if (value > 0) {
      return (value + ' ' + positiveEnding);
    } else if (value < 0) {
      return (value * -1 + ' ' + negativeEnding);
    } else {
      return '0';
    }
  } else {
    return '';
  }
}

/**
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
 *   {String} source.attributions
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

export const basemaps = [
  {
    id: 'eox',
    title: 'EOX',
    description: 'EPSG:4326 only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: 'Terrain Light { Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a> }',
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
    id: 'eoxS2Cloudless',
    title: 'EOX Sentinel-2 Cloudless',
    description: 'EPSG:4326 only, Europe only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: '<a href="https://s2maps.eu/">Sentinel-2 cloudless</a> by <a href="https://eox.at/">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016)',
      params: {
        layers: 's2cloudless',
        version: '1.1.1',
        wrapDateLine: true,
      },
    },
    viewSettings: {
      maxZoom: 14,
      fitExtent: [22.02, -33.86, 82.85, 56.12],
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
      attributions: 'Imagery reproduced from the GEBCO_2014 Grid, version 20150318, www.gebco.net',
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
    id: 'blueMarble',
    title: 'Blue Marble',
    description: 'EPSG:4326 only',
    projections: ['EPSG:4326'],
    source: {
      type: 'wms',
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      attributions: 'Blue Marble { &copy; <a href="http://nasa.gov">NASA</a> }',
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
      attributions: 'Black Marble { &copy; <a href="http://nasa.gov">NASA</a> }',
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
      maxExtent: [49.83, -6.33, 60.87, 1.84],
    },
  },
];

for (let basemap of basemaps) {
  basemap = addLayerDefaults(basemap);
}

/**
 * Default border layers.
 *
 * The object format is the same as for basemaps.
 * Additional border layers also need to be added to config_schema.js in client.map.countryBorders.format.
 */
export const borderLayers = [
  {
    id: 'white',
    title: 'White border lines',
    projections: ['EPSG:4326', 'EPSG:3857'],
    source: {
      type: 'wms',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {
        layers: 'rsg:full_10m_borders',
        version: '1.1.0',
        styles: 'line-white',
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
        layers: 'rsg:full_10m_borders',
        version: '1.1.0',
        styles: 'line_black',
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
        layers: 'rsg:full_10m_borders',
        version: '1.1.0',
        styles: 'line',
      },
    },
  },
];
