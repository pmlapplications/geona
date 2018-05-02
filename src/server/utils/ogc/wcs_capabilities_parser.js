/** @module utils/ogc/wcs_capabilities_parser */

/* eslint camelcase: 0 */

import {getCapabilities, describeCoverage, jsonifyCapabilities} from './common';
import proj4 from 'proj4';
// TODO try and fix the jsonix now
let parseXml = require('xml-js');
let fs = require('fs');

/**
 * Parse a WCS capabilities from a url.
 * @param  {String}  url The url of the service
 * @return {Promise}     A Promise that will resolve with a LayerServer config Object
 */
export function parseWcsCapabilities(url) {
  return new Promise((resolve, reject) => {
    getCapabilities('wcs', url).then((xml) => {
      try {
        resolve(_parseWcsCoverage(url, xml));
      } catch (err) {
        reject(err);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Parse a WCS DescribeCoverage from a url
 * @param  {String}  url             The DescribeCoverage URL to query.
 * @param  {String}  capabilitiesXml The XML returned from a GetCapabilities request for this server.
 * @return {Promise}                 The DescribeCoverage for the supplied URL.
 */
function _parseWcsCoverage(url, capabilitiesXml) {
  return new Promise((resolve, reject) => {
    describeCoverage('wcs', url).then((coverageXml) => {
      try {
        resolve(parseLocalWcsCapabilities(capabilitiesXml, coverageXml, url));
      } catch (err) {
        reject(err);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Parse an XML WCS capabilities document.
 * @param  {String} capabilitiesXml The capabilities XML as a string.
 * @param  {String} coverageXml     The coverage XML as a string.
 * @param  {String} [url]           The url of the service.
 * @return {Object}     A LayerServer config Object
 *
 * @throws Throws any error thrown by jsonifyCapabilities, and an error if the WCS version is unsupported.
 */
export function parseLocalWcsCapabilities(capabilitiesXml, coverageXml, url) {
  let jsonCapabilities;
  try {
    jsonCapabilities = jsonifyCapabilities('wcs', capabilitiesXml);
  } catch (err) {
    throw err;
  }
  let jsonCoverage;
  try {
    jsonCoverage = parseXml.xml2json(coverageXml, {compact: false, spaces: 2});
  } catch (err) {
    throw err;
  }
  // try {
  //   jsonCoverage = jsonifyCapabilities('wcs', coverageXml);
  // } catch (err) {
  //   throw err;
  // }
  // fs.writeFile('describecoveragejson.json', jsonCoverage, function(err) {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   console.log('file saved');
  // });
  // console.log(jsonCoverage);

  let capabilities = jsonCapabilities.value;

  let result;
  switch (capabilities.version) {
    case '1.0.0':
      result = parse1_0(url, capabilities, jsonCoverage);
      break;
    case '2.0.0':
      throw new Error('No support for WCS 2.0 currently');
  }
  return result;
}

/**
 * Parses the parts that are common between all WMS versions
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilities object
 * @return {Object}              The server config
 */
function parseCommon(url, capabilities) {
  // When more than just v1.0 is supported use this method
  return undefined;
}

/**
 * Parser for WCS version 1.0.0
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilites object
 * @param  {Object} coverage     The coverage object
 * @return {Object}              The server config
 */
function parse1_0(url, capabilities, coverage) {
  let capability = capabilities.capability;

  let service = capabilities.service;
  let content = capabilities.contentMetadata;
  // console.log(JSON.stringify(service));
  // console.log(JSON.stringify(capability));
  // console.log(JSON.stringify(capabilities));

  let onlineResource = {
    getCapabilities: {},
    describeCoverage: {},
    getCoverage: {},
    exception: capability.exception.format,
  };

  // Check if we have Get, Post, or both methods for the online resource
  let getCapGetOrPost = capability.request.getCapabilities.dcpType[0].http.getOrPost;
  for (let method = 0; method < getCapGetOrPost.length; method++) {
    if (getCapGetOrPost[method].TYPE_NAME === 'WCS_1_0_0.DCPTypeType.HTTP.Get') {
      onlineResource.getCapabilities.get = getCapGetOrPost[method].onlineResource.href;
    } else {
      onlineResource.getCapabilities.post = getCapGetOrPost[method].onlineResource.href;
    }
  }
  let desCovGetOrPost = capability.request.describeCoverage.dcpType[0].http.getOrPost;
  for (let method = 0; method < desCovGetOrPost.length; method++) {
    if (desCovGetOrPost[method].TYPE_NAME === 'WCS_1_0_0.DCPTypeType.HTTP.Get') {
      onlineResource.describeCoverage.get = desCovGetOrPost[method].onlineResource.href;
    } else {
      onlineResource.describeCoverage.post = desCovGetOrPost[method].onlineResource.href;
    }
  }
  let getCovGetOrPost = capability.request.getCoverage.dcpType[0].http.getOrPost;
  for (let method = 0; method < getCovGetOrPost.length; method++) {
    if (getCovGetOrPost[method].TYPE_NAME === 'WCS_1_0_0.DCPTypeType.HTTP.Get') {
      onlineResource.getCoverage.get = getCovGetOrPost[method].onlineResource.href;
    } else {
      onlineResource.getCoverage.post = getCovGetOrPost[method].onlineResource.href;
    }
  }

  let serverConfig = {
    protocol: 'wcs',
    version: capabilities.version,
    url: undefined,

    service: {
      // Title etc. are not defined in wcs layers (or jsonix isn't parsing correctly)
      onlineResource: onlineResource,
      // There is only ever one access constraint in 1.0.0
      accessConstraints: service.accessConstraints[0].value,
      fees: service.fees.value,
    },
  };

  serverConfig.layers = digForWcsLayers(coverage);

  if (url !== undefined) {
    serverConfig.url = url.replace(/\?.*/g, '');
  }

  // console.log(coverage);

  /**
   * Extracts the supported formats from the formatArray
   * @param  {Array} formatArray The array of formats from the capabilities JSON
   * @return {Array}             The formats
   */
  function getFormats(formatArray) {
    let formats = [];
    for (let format of formatArray) {
      formats.push(format.value);
    }
    return formats;
  }

  return serverConfig;
}

// TODO this uses xml-js rather than jsonix. Change if you can figure out a working jsonix context for WCS
/**
 * Populates an array for all the layer definitions found.
 * @param  {JSON}  coverage The coverage for all layers from a WCS DescribeCoverage request
 * @return {Array}          The populated layers found
 */
function digForWcsLayers(coverage) {
  let cov = JSON.parse(coverage);
  let layers = [];

  for (let element of cov.elements[0].elements) {
    let layer = {};
    let i = 0;

    layer.projections = [];
    for (let layerData of element.elements) {
      switch (layerData.name) {
        case 'description':
          layer.description = layerData.elements[0].text;
          break;
        case 'name':
          layer.identifier = layerData.elements[0].text;
          break;
        case 'label':
          layer.abstract = layerData.elements[0].text;
          break;
        case 'lonLatEnvelope':
          if (layerData.attributes !== undefined) {
            layer.projections.push(convertCrs(layerData.attributes.srsName));
          }
          layer.boundingBox = populateBoundingBox(layerData);
          break;
        case 'domainSet':
          layer.dimensions = {
            time: {},
          };
          for (let domain of layerData.elements) {
            if (domain.name === 'temporalDomain') {
              // TODO
              // layer.dimensions.time.default;
              layer.dimensions.time.values = [];
              for (let time of domain.elements) {
                layer.dimensions.time.values.push(time.elements[0].text);
              }
            } else if (domain.name === 'spatialDomain') {
              let times = [];
              for (let type of domain.elements) {
                if (type.name === 'EnvelopeWithTimePeriod') {
                  for (let boxOrTime of type.elements) {
                    if (boxOrTime.name === 'gml:timePosition') {
                      times.push(boxOrTime.elements[0].text);
                    }
                  }
                }
              }

              layer.dimensions.time.default = times.sort()[times.length - 1];
            }
          }

          if (Object.keys(layer.dimensions.time).length === 0) {
            delete layer.dimensions.time;
            if (Object.keys(layer.dimensions).length === 0) {
              delete layer.dimensions;
            }
          }

          break;
      }
    }
    layers.push(layer);
  }
  return layers;
}

/**
 * Converts the crs from the long OGC specification style into a normal crs string.
 * @param {String}  crs The crs in OGC specification style, e.g. 'urn:ogc:def:crs:OGC:2:84'.
 * @return {String}     The crs in normal style, e.g. 'OGC:84'.
 */
function convertCrs(crs) {
  let projection = crs.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
  if (projection === 'OGC:CRS84') {
    projection = 'EPSG:4326';
  }
  return projection;
}

/**
 * Populates and returns an Object containing bounding box data
 * with the correct axis orientation, projection code and dimensions.
 * @param {Object}  envelope The the lon/lat envelope
 * @return {Object}          The bounding box data as an Object
 */
function populateBoundingBox(envelope) {
  let boundingBox;
  // Holds the two pairs of coordinates for the bounding box
  let coordSet = [];
  // Find the coordinates for the bounding box
  for (let element of envelope.elements) {
    if (element.name === 'gml:pos') {
      let coords = element.elements[0].text.split(' ');
      coordSet.push(coords);
    }
  }
  // Puts the lower-value coordinates first in the array
  if (coordSet[0][0] > coordSet[1][0]) {
    coordSet.reverse();
  }

  // Gets the proj4 axis orientation, e.g. 'enu' and takes only the first two letters to get the x/y order
  let xyOrientation = proj4(convertCrs(envelope.attributes.srsName)).oProj.axis.substr(0, 2);

  if (xyOrientation === 'en') {
    boundingBox = {
      minLat: coordSet[0][1],
      minLon: coordSet[0][0],
      maxLat: coordSet[1][1],
      maxLon: coordSet[1][0],
      style: 'boundingBox',
    };
  } else {
    boundingBox = {
      minLat: coordSet[0][0],
      minLon: coordSet[0][1],
      maxLat: coordSet[1][0],
      maxLon: coordSet[1][1],
      style: 'boundingBox',
    };
  }
  return boundingBox;
}
