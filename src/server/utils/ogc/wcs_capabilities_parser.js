/** @module utils/ogc/wcs_capabilities_parser */

/* eslint camelcase: 0 */

import {getCapabilities, describeCoverage, jsonifyCapabilities} from './common';
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
 * @param {*} url 
 * @param {*} capabilities 
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
 * @param  {String} xml The XML document as a string
 * @param  {String} url (optional) The url of the service
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
  // what need here
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
    if (method.TYPE_NAME === 'WCS_1_0_0.DCPTypeType.HTTP.Get') {
      onlineResource.getCapabilities.get = getCapGetOrPost[method].onlineResource.href;
    } else {
      onlineResource.getCapabilities.post = getCapGetOrPost[method].onlineResource.href;
    }
  }
  let desCovGetOrPost = capability.request.describeCoverage.dcpType[0].http.getOrPost;
  for (let method = 0; method < desCovGetOrPost.length; method++) {
    if (method.TYPE_NAME === 'WCS_1_0_0.DCPTypeType.HTTP.Get') {
      onlineResource.describeCoverage.get = desCovGetOrPost[method].onlineResource.href;
    } else {
      onlineResource.describeCoverage.post = desCovGetOrPost[method].onlineResource.href;
    }
  }
  let getCovGetOrPost = capability.request.getCoverage.dcpType[0].http.getOrPost;
  for (let method = 0; method < getCovGetOrPost.length; method++) {
    if (method.TYPE_NAME === 'WCS_1_0_0.DCPTypeType.HTTP.Get') {
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
      // dcpType will only ever have one entry ('http') in version 1.0.0
      onlineResource: capability.request.getCapabilities.dcpType[0].http.getOrPost[0].onlineResource.href,
      // There is only ever one access constraint in 1.0.0
      accessConstraints: service.accessConstraints[0].value,
      fees: service.fees.value,
    },

    capability: {},
  };

  serverConfig.layers = digForWcsLayers();

  if (url !== undefined) {
    serverConfig.url = url.replace(/\?.*/g, '');
  }

  for (let brief of content.coverageOfferingBrief) {
    let layer = {
      identifier: brief.wcsName,
      description: brief.wcsDescription,
      label: brief.label,
    };
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

// TODO this uses xml-js rather than jsonix. Change?
/**
 * 
 * @param  {JSON}  coverage The coverage for all layers from a WCS DescribeCoverage request
 * @return {Array}          The populated layers found
 */
function digForWcsLayers(coverage) {
  let layers = [];

  for (let element of coverage.elements[0].elements) {
    let layer = {};
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
        case 'domainSet':
          for (let domain of layerData.elements) {
            if (domain.name === 'temporalDomain') {
              // layer.time
              for (let time of domain.elements) {
                // 
              }
            }
          }
          break;
      }
    }
  }

  return layers;
}
