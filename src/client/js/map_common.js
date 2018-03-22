/** @module map_common */

import i18next from 'i18next';
import $ from 'jquery';
import request from 'request';
import moment from 'moment';
import _ from 'lodash';

import {urlToFilename} from '../../common/map';
import LayerWms from '../../common/layer/layer_wms';
import LayerWmts from '../../common/layer/layer_wmts';


// TODO some of these functions perhaps shouldn't be in here
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
 * Checks if the url has been saved in the cache previously
 * @param {String} url The URL to check the cache for
 * @return {Boolean}   True if the URL has been saved previously
 */
export function urlInCache(url) {
  return new Promise((resolve, reject) => {
    let searchFile = 'http://127.0.0.1:7890/map/getCache/' + encodeURIComponent(urlToFilename(url) + '.json');
    request(searchFile, (err, response) => {
      if (err) {
        reject(err);
      } else if (response.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * Fetches layers for all supported services.
 * @param  {String}  url        URL for service request
 * @param  {String}  service    Explicitly-defined service type
 * @param  {Boolean} [save]     Whether to save the retrieved config to cache
 * @param  {Boolean} [useCache] Whether to retrieve from cache or to fetch from the web and overwrite
 * @return {Array}              List of layers found from the request
 */
export function getLayerServer(url, service, save = false, useCache = false) {
  return new Promise((resolve, reject) => {
    // ajax to server getLayerServer
    let requestUrl = encodeURIComponent(url) + '/' + service + '/' + save + '/' + useCache;
    $.ajax('http://127.0.0.1:7890/map/getLayerServer/' + requestUrl)
      .done((layerServerJson) => {
        resolve(layerServerJson);
      })
      .fail((err) => {
        reject(err);
      });
  });
}

/**
 * Gets the nearest possible time prior to or matching the requested time.
 * @param  {String[]} times         The list of times to get the time from.
 * @param  {String}   requestedTime The requested time in ISO 8601 format.
 *
 * @return {String|undefined}       The nearest valid time to the requested time.
 */
export function findNearestValidTime(times, requestedTime) {
  // TODO remove the sort - map_libraries should sort instead
  let sortedTimes = times.sort();
  // We set this to the earliest as a starting point
  let nearestValidTime = sortedTimes[0];
  // We use Date objects for easy comparison
  let dateNearestValidTime = new Date(sortedTimes[0]);
  let dateLatestValidTime = new Date(sortedTimes[sortedTimes.length - 1]);
  let dateRequestedTime = new Date(requestedTime);

  // If the requested time is earlier than the earliest possible or later than the latest possible
  // time for this layer, return undefined
  if (dateRequestedTime < dateNearestValidTime || dateRequestedTime > dateLatestValidTime) {
    return undefined;
  } else {
    for (let currentTime of times) {
      let dateCurrentTime = new Date(currentTime);
      // Must match or be earlier than the requested time
      if (dateCurrentTime <= dateRequestedTime && dateCurrentTime > dateNearestValidTime) {
        nearestValidTime = currentTime;
        dateNearestValidTime = new Date(currentTime);
      }
    }

    return nearestValidTime;
  }
}

/**
 * Constructs an extent which encapsulates the bounds of both passed extents.
 * @param  {Object} extent1 A Geona extent.
 * @param  {Object} extent2 A Geona extent.
 * @return {Object}         A Geona extent constructed from the two parameter extents.
 */
export function constructExtent(extent1, extent2) {
  let newExtent = {};

  if (extent1.minLat === undefined || extent1.minLon === undefined || extent1.maxLat === undefined || extent1.maxLon === undefined) { // eslint-disable-line max-len
    throw new Error('First parameter: ' + extent1 + ' contains undefined values.');
  }
  if (extent2.minLat === undefined || extent2.minLon === undefined || extent2.maxLat === undefined || extent2.maxLon === undefined) { // eslint-disable-line max-len
    throw new Error('Second parameter: ' + extent2 + ' contains undefined values.');
  }

  // minLat
  if (extent1.minLat > extent2.minLat && extent1.minLat !== -90) {
    newExtent.minLat = extent1.minLat;
  } else {
    newExtent.minLat = extent2.minLat;
  }
  // minLon
  if (extent1.minLon > extent2.minLon && extent1.minLon !== -Infinity && extent1.minLon !== -180) {
    newExtent.minLon = extent1.minLon;
  } else {
    newExtent.minLon = extent2.minLon;
  }
  // maxLat
  if (extent1.maxLat < extent2.maxLat && extent1.maxLat !== 90) {
    newExtent.maxLat = extent1.maxLat;
  } else {
    newExtent.maxLat = extent2.maxLat;
  }
  // maxLon
  if (extent1.maxLon < extent2.maxLon && extent1.maxLon !== Infinity && extent1.minLon !== 180) {
    newExtent.maxLon = extent1.maxLon;
  } else {
    newExtent.maxLon = extent2.maxLon;
  }

  return newExtent;
}

/**
 * Generates an array of datetimes from 'start/end/interval' definitions
 * @param  {Layer}    geonaLayer A Geona Layer definition.
 * @return {String[]}            The newly-generated datetime values based on the data in the geonaLayer.
 */
export function generateDatetimesFromIntervals(geonaLayer) {
  // Some servers will represent time as 'startDate/endDate/period' so we will have to generate that data
  let datetimes = [];

  // Generate any dates if necessary
  if (geonaLayer.dimensions.time.intervals) {
    let allGeneratedTimes = [];
    let times = geonaLayer.dimensions.time.intervals;
    for (let i = 0; i < times.length; i++) {
      let startDate = times[i].min;
      let endDate = times[i].max;
      let duration = moment.duration(times[i].resolution);

      let generatedTimes = [startDate];
      let nextTime = moment(startDate).add(duration);

      // use moment
      while (nextTime < moment(endDate)) {
        generatedTimes.push(nextTime.toISOString());
        nextTime.add(duration);
      }
      generatedTimes.push(endDate);

      // Store the generated times to be added outside of the loop
      allGeneratedTimes.push(generatedTimes);
    }

    // Concatenate all the generated times with any other values
    for (let generatedTimes of allGeneratedTimes) {
      datetimes = datetimes.concat(generatedTimes);
    }

    // Remove duplicate times
    datetimes = _.uniq(datetimes);
    // Sort from least-to-most recent
    datetimes.sort();
  }
  return datetimes;
}

/**
 * Loads the default/config Geona Layers and their corresponding LayerServers
 * @param  {Object} config The config for the map
 * @return {Object}           The availableLayers and availableLayerServers
 */
export function loadDefaultLayersAndLayerServers(config) {
  // TODO actually instantiate some layer servers instead of just using the Objects

  // We will be modifying the config, so we want to clone it.
  // This is in case we have been passed a reference to the map's config, which we do not want to alter.
  // let config = JSON.parse(JSON.stringify(mapConfig)); // Fastest deep clone according to stackoverflow.com/a/5344074

  let basemaps = getBasemapLayerServers(config);
  let borders = getBordersLayerServers(config);
  let data = getDataLayerServers(config);
  let allLayerServers = basemaps.concat(borders, data);

  let loadedServersAndLayers = {
    availableLayers: {},
    availableLayerServers: {},
  };
  // Merge duplicate servers
  let uniqueLayerServers = {};
  for (let layerServer of allLayerServers) {
    if (uniqueLayerServers[layerServer.identifier] === undefined) {
      uniqueLayerServers[layerServer.identifier] = layerServer;
    } else { // Merge the layers from both
      uniqueLayerServers[layerServer.identifier].layers =
          uniqueLayerServers[layerServer.identifier].layers.concat(layerServer.layers);
    }
  }
  // Extract the layers from all the layerServers
  for (let layerServerIdentifier of Object.keys(uniqueLayerServers)) {
    let layerServer = uniqueLayerServers[layerServerIdentifier];
    for (let layer of layerServer.layers) {
      if (loadedServersAndLayers.availableLayers[layer.identifier] === undefined) {
        if (layer.protocol !== 'bing' || config.bingMapsApiKey) {
          if (layer.layerServer === layerServer.identifier) {
            let geonaLayer;
            switch (layer.protocol.toLowerCase()) {
              case 'wms':
                geonaLayer = new LayerWms(layer, layerServer);
                break;
              case 'wmts':
                geonaLayer = new LayerWmts(layer, layerServer);
                break;
              default:
                throw new Error('Unsupported layer protocol: ' + layer.protocol.toLowerCase());
            }
            loadedServersAndLayers.availableLayers[layer.identifier] = geonaLayer;
          } else {
            throw new Error(
              'Layer ' + layer.identifier + ' in LayerServer ' + layerServer.identifier +
                ' has different LayerServer property (' + layer.layerServer +
                '). Please ensure the Layer\'s layerServer property matches the identifier for its LayerServer.'
            );
          }
        } else {
          console.error('bingMapsApiKey is null or undefined');
        }
      } else {
        console.error('Layer with identifier ' + layer.identifier + ' has already been added to the list of available layers');
      }
    }
  }

  // Save the non-layer information for the LayerServers
  for (let layerServerIdentifier of Object.keys(uniqueLayerServers)) {
    let layerServer = {};

    for (let property of Object.keys(uniqueLayerServers[layerServerIdentifier])) {
      if (property !== 'layers') {
        layerServer[property] = uniqueLayerServers[layerServerIdentifier][property];
      }
    }
    loadedServersAndLayers.availableLayerServers[layerServerIdentifier] = layerServer;
  }

  return loadedServersAndLayers;
}

/**
 * Load the default basemaps, and any defined in the config.
 * @param  {Object} config The config for the map
 * @return {Array}         The basemap servers, including duplicates.
 */
function getBasemapLayerServers(config) {
  let basemapServers = [];
  for (let layerServer of basemapLayers) {
    basemapServers.push(layerServer);
  }
  if (config.basemapLayers !== undefined) {
    for (let layerServer of config.basemapLayers) {
      basemapServers.push(layerServer);
    }
  }
  return basemapServers;
}

/**
 * Load the default border layers, and any defined in the config.
 * @param  {Object} config The config for the map
 * @return {Array}         The borders servers, including duplicates.
 */
function getBordersLayerServers(config) {
  let borderServers = [];
  for (let layerServer of borderLayers) {
    borderServers.push(layerServer);
  }
  if (config.bordersLayers !== undefined) {
    for (let layerServer of config.bordersLayers) {
      borderServers.push(layerServer);
    }
  }
  return borderServers;
}


/**
 * Load the default data layers, and any defined in the config.
 * @param  {Object} config The config for the map
 * @return {Array}         The data servers, including duplicates.
 */
function getDataLayerServers(config) {
  let data = [];
  for (let layerServer of dataLayers) {
    data.push(layerServer);
  }
  if (config.dataLayers !== undefined) {
    for (let layerServer of config.dataLayers) {
      data.push(layerServer);
    }
  }
  return data;
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

export const basemapLayers = [
  {
    identifier: 'https__www.gebco.net_data_and_products_gebco_web_services_web_map_service_mapserv__wms_1.1.1_getcapabilities',
    version: '1.1.1',
    url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
    layers: [
      {
        protocol: 'wms',
        identifier: 'gebco_08_grid',
        modifier: 'basemap',
        title: {
          und: 'GEBCO',
        },
        attribution: {
          title: 'GEBCO',
          onlineResource: 'Imagery reproduced from the GEBCO_2014 Grid, version 20150318, www.gebco.net',
        },
        projections: ['EPSG:4326', 'EPSG:3857'],
        formats: ['image/jpeg'],
        isTemporal: false,
        layerServer: 'https__www.gebco.net_data_and_products_gebco_web_services_web_map_service_mapserv__wms_1.1.1_getcapabilities',
        viewSettings: {
          maxZoom: 7,
        },
      },
    ],
  },
  {
    identifier: 'https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities',
    version: '1.1.1',
    url: 'https://tiles.maps.eox.at/wms/?',
    layers: [
      {
        protocol: 'wms',
        identifier: 's2cloudless',
        modifier: 'basemap',
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
        layerServer: 'https__tiles.maps.eox.at_wms__wms_1.1.1_getcapabilities',
        viewSettings: {
          maxZoom: 14,
          fitExtent: {
            minLat: 22.02,
            minLon: -33.86,
            maxLat: 82.85,
            maxLon: 56.12,
          },
        },
      },
    ],
  },
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

for (let basemap of basemapLayers) {
  basemap = addLayerDefaults(basemap);
}

/**
   * Default border layers.
   *
   * The object format is the same as for basemaps.
   * Additional border layers also need to be added to config_schema.js in client.map.borders.format.
   */
export const borderLayers = [
  {
    identifier: 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
    version: '1.1.0',
    url: 'https://rsg.pml.ac.uk/geoserver/wms?',
    layers: [
      {
        identifier: 'rsg:full_10m_borders',
        protocol: 'wms',
        modifier: 'borders',
        title: {
          und: 'World country border lines',
        },
        projections: ['EPSG:4326', 'EPSG:3857'],
        formats: ['image/png'],
        isTemporal: false,
        styles: [
          {
            identifier: 'line_black',
          },
          {
            identifier: 'line-white',
          },
          {
            identifier: 'line',
          },
        ],
        layerServer: 'https__rsg.pml.ac.uk_geoserver_wms__wms_1.1.0_getcapabilities',
      },
    ],
  },
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
