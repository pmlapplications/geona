/** @module map_common */

import i18next from 'i18next';
import $ from 'jquery';

import LayerServer from '../../common/layer/server/layer_server';
import LayerServerWmts from '../../common/layer/server/layer_server_wmts';


/**
 * Variables and functions common to all map types.
 */

/**
 * Selects the appropriate language to use for a property from the available languages.
 * @param {Object} property A language-separated list of a property for a layer.
 * @return {*}              The value stored in the language property selected.
 */
export function selectPropertyLanguage(property) {
  // The current user language
  let language = i18next.language;
  // The base language for the current language, such as 'en' for 'en-GB'
  let baseLanguage = language.split('-')[0];

  if (Object.keys(property).length === 1) {
    // If there is only one possible language, return the value for that.
    let value = Object.keys(property)[0];
    return property[value];
  } else {
    if (property[language]) {
      // If there's an item for the current language
      return property[language];
    } else if (property[baseLanguage]) {
      // If there's an item for the current base language
      return property[baseLanguage];
    } else if (property.und) {
      // If there's an item for undetermined
      return property.und;
    } else {
      // Else, just select the first possible language.
      let firstLanguage = Object.keys(property)[0];
      return property[firstLanguage];
    }
  }
}

/**
 * Add the default options to a layer definition.
 * @param  {Object} layer A layer definition
 * @return {Object}         The layer with defaults added
 */
export function addLayerDefaults(layer) {
  switch (layer.protocol) {
    case 'wms':
      if (layer.crossOrigin === undefined) {
        layer.crossOrigin = null;
      }
      layer.layerServer.version = layer.layerServer.version || '1.1.1';
      layer.formats = layer.formats || 'image/png';
      if (layer.wrapDateLine === undefined) {
        layer.wrapDateLine = true;
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
   * Fetches WMS layers using a GetCapabilities request on a provided URL.
   * @param {String} url The URL of a WMS server.
   * @return {Array}     The list of layers found from the request.
   */
export function getLayersFromWms(url) {
  return new Promise((resolve, reject) => {
    // Will make a request to the Geona WMS parser to get the capabilities in Geona layer form
    let parserUrl = 'http://127.0.0.1:7890/utils/wms/getLayers/' + encodeURIComponent(url);
    $.ajax(parserUrl)
      .done((serverConfig) => {
        let layers = new LayerServer(serverConfig);
        resolve(layers);
      })
      .fail((err) => {
        reject(err);
      });
  });
}

/**
   * Fetches WMTS layers using a GetCapabilities request on a provided URL.
   * @param {String} url The URL of a WMTS server.
   * @return {Array}     The list of layers found from the request.
   */
export function getLayersFromWmts(url) {
  return new Promise((resolve, reject) => {
    // Will make a request to the Geona WMS parser to get the capabilities in Geona layer form
    let parserUrl = 'http://127.0.0.1:7890/utils/wmts/getLayers/' + encodeURIComponent(url);
    $.ajax(parserUrl)
      .done((serverConfig) => {
        let layers = new LayerServerWmts(serverConfig);
        resolve(layers);
      })
      .fail((err) => {
        reject(err);
      });
  });
}

/**
 * Gets the nearest possible time prior to or matching the requested time.
 * @param  {Layer}  geonaLayer    The Geona layer for the layer being changed.
 * @param  {String} requestedTime The requested time in ISO 8601 format.
 * @return {String}               The nearest valid time to the requested time.
 */
export function findNearestValidTime(geonaLayer, requestedTime) {
  if (geonaLayer.dimensions !== undefined) {
    if (geonaLayer.dimensions.time !== undefined) {
      // We use Date objects for easy comparison
      let sortedTimes = geonaLayer.dimensions.time.values.sort();
      // We set this to the earliest as a starting point
      let nearestValidTime = sortedTimes[0];
      let dateNearestValidTime = new Date(sortedTimes[0]);
      let dateLatestValidTime = new Date(sortedTimes[sortedTimes.length - 1]);
      let dateRequestedTime = new Date(requestedTime);

      // If the requested time is earlier than the earliest possible or latest possible
      // time for this layer, return undefined
      if (dateRequestedTime < dateNearestValidTime || dateRequestedTime > dateLatestValidTime) {
        return undefined;
      } else {
        for (let currentTime of geonaLayer.dimensions.time.values) {
          let dateCurrentTime = new Date(currentTime);
          // Must match or be earlier than the requested time
          if (dateCurrentTime <= dateRequestedTime && dateCurrentTime > dateNearestValidTime) {
            nearestValidTime = currentTime;
            dateNearestValidTime = new Date(currentTime);
          }
        }

        return nearestValidTime;
      }
    } else {
      throw new Error('Layer has no time dimension defined.');
    }
  } else {
    throw new Error('Layer has no dimension defined.');
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
    protocol: 'wms',
    identifier: 'terrain-light',
    title: {
      und: 'EOX',
    },
    description: {
      und: 'EPSG:4326 only, Europe only',
    },
    attribution: {
      title: 'EOX',
      onlineResource: 'Terrain Light { Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a> }',
    },
    projections: ['EPSG:4326'],
    formats: ['image/jpeg'],
    isTemporal: false,
    layerServer: {
      layers: ['terrain-light'],
      version: '1.1.1',
      url: 'https://tiles.maps.eox.at/wms/?',
    },
  },
  {
    protocol: 'wms',
    identifier: 's2cloudless',
    title: {
      und: 'EOX',
    },
    attribution: {
      title: 'EOX Sentinel-2 Cloudless',
      onlineResource: '<a href="https://s2maps.eu/">Sentinel-2 cloudless</a> by <a href="https://eox.at/">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016)',
    },
    projections: ['EPSG:4326'],
    formats: ['image/jpeg'],
    isTemporal: false,
    layerServer: {
      layers: ['s2cloudless'],
      version: '1.1.1',
      url: 'https://tiles.maps.eox.at/wms/?',
    },
    viewSettings: {
      maxZoom: 14,
      fitExtent: [22.02, -33.86, 82.85, 56.12],
    },
  },
  // {
  //   id: 'eoxS2Cloudless',
  //   title: 'EOX Sentinel-2 Cloudless',
  //   description: 'EPSG:4326 only, Europe only',
  //   projections: ['EPSG:4326'],
  //   source: {
  //     type: 'wms',
  //     url: 'https://tiles.maps.eox.at/wms/?',
  //     crossOrigin: null,
  //     attributions: '<a href="https://s2maps.eu/">Sentinel-2 cloudless</a> by <a href="https://eox.at/">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016)',
  //     params: {
  //       layers: 's2cloudless',
  //       version: '1.1.1',
  //       wrapDateLine: true,
  //     },
  //   },
  //   viewSettings: {
  //     maxZoom: 14,
  //     fitExtent: [22.02, -33.86, 82.85, 56.12],
  //   },
  // },
  // {
  //   identifier: 'gebco_08_grid',
  //   title: {und:'GEBCO'},
  //   projections: ['EPSG:4326', 'EPSG:3857'],
  //   protocol: 'wms',
  //   isTemporal: false,
  //   attribution: {
  //     onlineResource: 'Imagery reproduced from the GEBCO_2014 Grid, version 20150318, www.gebco.net',
  //     title: 'GEBCO',
  //   },
  //   layerServer: {
  //     url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
  //     crossOrigin: null,
  //     version: '1.1.1',
  //     params: {
  //       format: 'image/jpeg',
  //       wrapDateLine: true},
  //   },
  //   viewSettings: {
  //     maxZoom: 7,
  //   },
  // },
  // {
  //   id: 'blueMarble',
  //   title: 'Blue Marble',
  //   description: 'EPSG:4326 only',
  //   projections: ['EPSG:4326'],
  //   source: {
  //     type: 'wms',
  //     url: 'https://tiles.maps.eox.at/wms/?',
  //     crossOrigin: null,
  //     attributions: 'Blue Marble { &copy; <a href="http://nasa.gov">NASA</a> }',
  //     params: {
  //       layers: 'bluemarble',
  //       version: '1.1.1',
  //       wrapDateLine: true,
  //     },
  //   },
  //   viewSettings: {
  //     maxZoom: 8,
  //   },
  // },
  // {
  //   id: 'blackMarble',
  //   title: 'Black Marble',
  //   description: 'EPSG:4326 only',
  //   projections: ['EPSG:4326'],
  //   source: {
  //     type: 'wms',
  //     url: 'https://tiles.maps.eox.at/wms/?',
  //     crossOrigin: null,
  //     attributions: 'Black Marble { &copy; <a href="http://nasa.gov">NASA</a> }',
  //     params: {
  //       layers: 'blackmarble',
  //       version: '1.1.1',
  //       wrapDateLine: true,
  //     },
  //   },
  //   viewSettings: {
  //     maxZoom: 8,
  //   },
  // },
  // {
  //   id: 'osm',
  //   title: 'OSM',
  //   description: 'EPSG:3857 only',
  //   projections: ['EPSG:3857'],
  //   source: {
  //     type: 'osm',
  //   },
  //   viewSettings: {
  //     maxZoom: 19,
  //   },
  // },
  // {
  //   id: 'bingMapsAerial',
  //   title: 'Bing Maps - Aerial imagery',
  //   description: 'EPSG:3857 only',
  //   projections: ['EPSG:3857'],
  //   source: {
  //     type: 'bing',
  //     imagerySet: 'Aerial',
  //   },
  //   viewSettings: {
  //     maxZoom: 19,
  //   },
  // },
  // {
  //   id: 'bingMapsAerialWithLabels',
  //   title: 'Bing Maps - Aerial imagery with labels',
  //   description: 'EPSG:3857 only',
  //   projections: ['EPSG:3857'],
  //   source: {
  //     type: 'bing',
  //     imagerySet: 'AerialWithLabels',
  //   },
  //   viewSettings: {
  //     maxZoom: 19,
  //   },
  // },
  // {
  //   id: 'bingMapsRoad',
  //   title: 'Bing Maps - Road',
  //   description: 'EPSG:3857 only',
  //   projections: ['EPSG:3857'],
  //   source: {
  //     type: 'bing',
  //     imagerySet: 'Road',
  //   },
  //   viewSettings: {
  //     maxZoom: 19,
  //   },
  // },
  // {
  //   id: 'bingMapsOS',
  //   title: 'Ordnance Survey',
  //   description: 'EPSG:3857 only, coverage of UK only',
  //   projections: ['EPSG:3857'],
  //   source: {
  //     type: 'bing',
  //     imagerySet: 'ordnanceSurvey',
  //   },
  //   viewSettings: {
  //     minZoom: 10,
  //     maxZoom: 16,
  //     center: [51.502874, -0.126704],
  //     maxExtent: [49.83, -6.33, 60.87, 1.84],
  //   },
  // },
];

for (let basemap of basemaps) {
  basemap = addLayerDefaults(basemap);
}

/**
   * Default border layers.
   *
   * The object format is the same as for basemaps.
   * Additional border layers also need to be added to config_schema.js in client.map.borders.format.
   */
export const borderLayers = [
  // {
  //   id: 'line-white',
  //   title: 'White border lines',
  //   projections: ['EPSG:4326', 'EPSG:3857'],
  //   source: {
  //     type: 'wms',
  //     url: 'https://rsg.pml.ac.uk/geoserver/wms?',
  //     crossOrigin: null,
  //     params: {
  //       layers: 'rsg:full_10m_borders',
  //       version: '1.1.0',
  //       styles: 'line-white',
  //     },
  //   },
  // },
  {
    identifier: 'line_black',
    protocol: 'wms',
    title: {
      und: 'Black border lines',
    },
    projections: ['EPSG:4326', 'EPSG:3857'],
    formats: ['image/png'],
    isTemporal: false,
    styles: [
      {
        identifier: 'line_black',
      },
    ],
    layerServer: {
      layers: ['rsg:full_10m_borders'],
      version: '1.1.0',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
    },
  },
  {
    identifier: 'line',
    protocol: 'wms',
    title: {
      und: 'Blue border lines',
    },
    projections: ['EPSG:4326', 'EPSG:3857'],
    formats: ['image/png'],
    isTemporal: false,
    styles: [
      {
        identifier: 'line',
      },
    ],
    layerServer: {
      layers: ['rsg:full_10m_borders'],
      version: '1.1.0',
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
    },
  },
  // {
  //   id: 'line',
  //   title: 'Blue border lines',
  //   projections: ['EPSG:4326', 'EPSG:3857'],
  //   source: {
  //     type: 'wms',
  //     url: 'https://rsg.pml.ac.uk/geoserver/wms?',
  //     crossOrigin: null,
  //     params: {
  //       layers: 'rsg:full_10m_borders',
  //       version: '1.1.0',
  //       styles: 'line',
  //     },
  //   },
  // },
];

  /**
   * {
      identifier: 'terrain-light',
      title: {und: 'EOX'},
      description: 'EPSG:4326 only',
      projections: ['EPSG:4326'],
      protocol: 'wms',
      isTemporal: false,
      attribution: {
        onlineResource: 'Terrain Light { Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="#data">others</a>, Rendering &copy; <a href="http://eox.at">EOX</a> }',
        title: 'EOX',
      },
      layerServer: {
        url: 'https://tiles.maps.eox.at/wms/?',
        crossOrigin: null,
        version: '1.1.1',
        params: {
          version: '1.1.1',
          format: 'image/jpeg',
          wrapDateLine: true,
        },
      },
      viewSettings: {
        maxZoom: 13,
      },
    },
    // {
    //   id: 'eoxS2Cloudless',
    //   title: 'EOX Sentinel-2 Cloudless',
    //   description: 'EPSG:4326 only, Europe only',
    //   projections: ['EPSG:4326'],
    //   source: {
    //     type: 'wms',
    //     url: 'https://tiles.maps.eox.at/wms/?',
    //     crossOrigin: null,
    //     attributions: '<a href="https://s2maps.eu/">Sentinel-2 cloudless</a> by <a href="https://eox.at/">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016)',
    //     params: {
    //       layers: 's2cloudless',
    //       version: '1.1.1',
    //       wrapDateLine: true,
    //     },
    //   },
    //   viewSettings: {
    //     maxZoom: 14,
    //     fitExtent: [22.02, -33.86, 82.85, 56.12],
    //   },
    // },
    {
      identifier: 'gebco_08_grid',
      title: {und:'GEBCO'},
      projections: ['EPSG:4326', 'EPSG:3857'],
      protocol: 'wms',
      isTemporal: false,
      attribution: {
        onlineResource: 'Imagery reproduced from the GEBCO_2014 Grid, version 20150318, www.gebco.net',
        title: 'GEBCO',
      },
      layerServer: {
        url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
        crossOrigin: null,
        version: '1.1.1',
        params: {
          format: 'image/jpeg',
          wrapDateLine: true},
      },
      viewSettings: {
        maxZoom: 7,
      },
    },
    // {
    //   id: 'blueMarble',
    //   title: 'Blue Marble',
    //   description: 'EPSG:4326 only',
    //   projections: ['EPSG:4326'],
    //   source: {
    //     type: 'wms',
    //     url: 'https://tiles.maps.eox.at/wms/?',
    //     crossOrigin: null,
    //     attributions: 'Blue Marble { &copy; <a href="http://nasa.gov">NASA</a> }',
    //     params: {
    //       layers: 'bluemarble',
    //       version: '1.1.1',
    //       wrapDateLine: true,
    //     },
    //   },
    //   viewSettings: {
    //     maxZoom: 8,
    //   },
    // },
    // {
    //   id: 'blackMarble',
    //   title: 'Black Marble',
    //   description: 'EPSG:4326 only',
    //   projections: ['EPSG:4326'],
    //   source: {
    //     type: 'wms',
    //     url: 'https://tiles.maps.eox.at/wms/?',
    //     crossOrigin: null,
    //     attributions: 'Black Marble { &copy; <a href="http://nasa.gov">NASA</a> }',
    //     params: {
    //       layers: 'blackmarble',
    //       version: '1.1.1',
    //       wrapDateLine: true,
    //     },
    //   },
    //   viewSettings: {
    //     maxZoom: 8,
    //   },
    // },
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
    // {
    //   id: 'bingMapsAerial',
    //   title: 'Bing Maps - Aerial imagery',
    //   description: 'EPSG:3857 only',
    //   projections: ['EPSG:3857'],
    //   source: {
    //     type: 'bing',
    //     imagerySet: 'Aerial',
    //   },
    //   viewSettings: {
    //     maxZoom: 19,
    //   },
    // },
    // {
    //   id: 'bingMapsAerialWithLabels',
    //   title: 'Bing Maps - Aerial imagery with labels',
    //   description: 'EPSG:3857 only',
    //   projections: ['EPSG:3857'],
    //   source: {
    //     type: 'bing',
    //     imagerySet: 'AerialWithLabels',
    //   },
    //   viewSettings: {
    //     maxZoom: 19,
    //   },
    // },
    // {
    //   id: 'bingMapsRoad',
    //   title: 'Bing Maps - Road',
    //   description: 'EPSG:3857 only',
    //   projections: ['EPSG:3857'],
    //   source: {
    //     type: 'bing',
    //     imagerySet: 'Road',
    //   },
    //   viewSettings: {
    //     maxZoom: 19,
    //   },
    // },
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
   */

  /**
   * Default data layers to have available
   */
export const dataLayers = [];

for (let dataLayer of dataLayers) {
  dataLayer = addLayerDefaults(dataLayer);
}
