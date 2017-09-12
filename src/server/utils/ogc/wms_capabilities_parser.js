/* eslint camelcase: 0 */

import {getCapabilities, jsonifyCapabilities} from './common';

/**
 * Parse a WMS capabilities from a url.
 * @param  {String}  url The url of the service
 * @return {Promise}     A Promise that will resolve with a LayerServer config Object
 */
export function parseWmsCapabilities(url) {
  return new Promise((resolve, reject) => {
    getCapabilities('wms', url).then((xml) => {
      try {
        resolve(parseLocalWmsCapabilities(xml, url));
      } catch (err) {
        reject(err);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Parse an XML WMTS capabilitise document.
 * @param  {String} xml The XML document as a string
 * @param  {String} url (optional) The url of the service
 * @return {Object}     A LayerServer config Object
 *
 * @throws Throws any error thrown by jsonifyCapabilities, and an error if the WMS version is unsupported.
 */
export function parseLocalWmsCapabilities(xml, url) {
  let jsonCapabilities;

  try {
    jsonCapabilities = jsonifyCapabilities('wms', xml);
  } catch (err) {
    throw err;
  }

  let capabilities = jsonCapabilities.value;

  let result;

  switch (capabilities.version) {
    case '1.0.0':
      throw new Error('No support for WMS 1.0.0 currently');
    case '1.1.0':
    case '1.1.1':
      result = parse1_1(url, capabilities);
      break;
    case '1.3.0':
      result = parse1_3(url, capabilities);
      break;
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
  let service = capabilities.service;
  let capability = capabilities.capability;

  let serverConfig = {
    protocol: 'wms',
    version: capabilities.version,
    url: undefined,

    service: {
      title: {und: service.title},
      abstract: {und: service._abstract} || {und: service.abstract} || {},
      keywords: {und: []},
      onlineResource: service.onlineResource.href,
      contactInformation: {},
    },

    capability: {},
  };

  if (url) {
    serverConfig.url = url.replace(/\?.*/g, '');
  }

  if (service.keywordList) {
    for (let keyword of service.keywordList.keyword) {
      serverConfig.service.keywords.und.push(keyword.value);
    }
  }

  if (service.contactInformation) {
    let contactInfo = service.contactInformation;
    let serverConfigContactInfo = serverConfig.service.contactInformation;

    if (contactInfo.contactPersonPrimary) {
      serverConfigContactInfo.person = contactInfo.contactPersonPrimary.contactPerson;
      serverConfigContactInfo.organization = contactInfo.contactPersonPrimary.contactOrganisation;
    }

    serverConfigContactInfo.position = contactInfo.contactPosition;
    serverConfigContactInfo.addressLines = [contactInfo.contactAddress];
    serverConfigContactInfo.phone = [contactInfo.contactVoiceTelephone];
    serverConfigContactInfo.email = [contactInfo.contactElectronicMailAddress];
  }

  if (capability.layer) {
    serverConfig.layers = digForWmsLayers(capabilities.version, capability.layer);
  }

  return serverConfig;
}

/**
 * Parser for WMS version 1.1.0 or 1.1.1
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilites object
 * @return {Object}              The server config
 */
function parse1_1(url, capabilities) {
  let capability = capabilities.capability;

  let serverConfig = parseCommon(url, capabilities);

  if (capability.request) {
    if (capability.request.getMap) {
      serverConfig.capability.getMap = {
        formats: getFormats(capability.request.getMap.format),
      };
    }
    if (capability.request.getFeatureInfo) {
      serverConfig.capability.getFeatureInfo = {
        formats: getFormats(capability.request.getFeatureInfo.format),
      };
    }
  }

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

/**
 * Parser for WMS version 1.3.0
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilities object
 * @return {Object}              The server config
 */
function parse1_3(url, capabilities) {
  let capability = capabilities.capability;

  let serverConfig = parseCommon(url, capabilities);

  if (capability.request) {
    if (capability.request.getMap) {
      serverConfig.capability.getMap = {
        formats: capability.request.getMap.format,
      };
    }
    if (capability.request.getFeatureInfo) {
      serverConfig.capability.getFeatureInfo = {
        formats: capability.request.getFeatureInfo.format,
      };
    }
    if (capability.request.extendedOperation) {
      for (let operation of capability.request.extendedOperation) {
        switch (operation.name.localPart) {
          case 'GetLegendGraphic':
            serverConfig.capability.getLegendGraphic = {
              formats: operation.value.format,
            };
            break;
        }
      }
    }
  }

  return serverConfig;
}

/**
 * Digs for all layers nested under the provided layer
 * @param  {String} wmsVersion  The WMS version
 * @param  {Object} layer       The layer to search under
 * @param  {Object} parentLayer (optional) The parent layer of the layer
 * @return {Array}              An array of all renderable layers found
 */
function digForWmsLayers(wmsVersion, layer, parentLayer = {}) {
  let layers = [];

  let thisLayer = parseLayerCommon(layer, parentLayer);

  switch (wmsVersion) {
    case '1.1.0':
    case '1.1.1':
      thisLayer = parseLayer1_1(layer, parentLayer);
      break;
    case '1.3.0':
      thisLayer = parseLayer1_3(layer, parentLayer);
      break;
  }

  // If this layer has a name, and therefore supports getMap, add it to the array of layers
  if (thisLayer.name) {
    layers.push(thisLayer);
  }

  // If this layer has sub-layers, load them and add them to the array of layers
  if (layer.layer) {
    for (let subLayer of layer.layer) {
      layers = layers.concat(digForWmsLayers(wmsVersion, subLayer, thisLayer));
    }
  }

  return layers;
}

/**
 * Parser for layer properties that are common between WMS versions
 * @param  {Object} layer       The layer
 * @param  {Object} parentLayer (optional) The parent layer of the layer
 * @return {Object}             The parsed layer
 */
function parseLayerCommon(layer, parentLayer = {}) {
  // Create thisLayer with the basic non-inheritable properties
  let thisLayer = {
    name: layer.name,
    title: layer.title,
    abstract: layer._abstract,
  };

  // Load the keywords
  if (layer.keywordList) {
    thisLayer.keywords = [];
    for (let keyword of layer.keywordList.keyword) {
      thisLayer.keywords.push(keyword.value);
    }
  }

  // Load the attribution with 'replace' inheritance
  if (layer.attribution) {
    thisLayer.attribution = {
      title: layer.attribution.title,
    };

    if (layer.attribution.onlineResource) {
      thisLayer.attribution.onlineResource = layer.attribution.onlineResource.href;
    }

    if (layer.attribution.logoURL) {
      thisLayer.attribution.logo = {
        width: layer.attribution.logoURL.width,
        height: layer.attribution.logoURL.height,
        format: layer.attribution.logoURL.format,
      };

      if (layer.attribution.logoURL.onlineResource) {
        thisLayer.attribution.logo.onlineResource = layer.attribution.logoURL.onlineResource.href;
      }
    }
  } else if (parentLayer.attribution) {
    thisLayer.attribution = parentLayer.attribution;
  }

  // Load the authorities with 'replace' inheritance
  if (layer.authorityURL) {
    thisLayer.authorities = [];
    for (let authority of layer.authorityURL) {
      let thisAuthority = {
        name: authority.name,
      };
      if (authority.onlineResource) {
        thisAuthority.onlineResource = authority.onlineResource.href;
      }
      thisLayer.authorities.push(thisAuthority);
    }

    if (parentLayer.authorities) {
      // Add any authorities from the parent layer
      thisLayer.authorities = thisLayer.authorities.concat(parentLayer.authorities);
      // Remove duplicates with ES6 magic
      thisLayer.authorities = thisLayer.authorities.filter((authority, index, thisArray) =>
        thisArray.findIndex((otherAuthority) => {
          return otherAuthority.name === authority.name;
        }) === index);
    }
  } else if (parentLayer.authorities) {
    thisLayer.authorities = parentLayer.authorities;
  }

  return thisLayer;
}

/**
 * Parser for a WMS 1.1.0 or 1.1.1 layer
 * @param  {Object} layer       The layer
 * @param  {Object} parentLayer The parent layer of the layer
 * @return {Object}             The parsed layer
 */
function parseLayer1_1(layer, parentLayer = {}) {
  let thisLayer = parseLayerCommon(layer, parentLayer);

  // Load the projections with 'add' inheritance
  if (layer.srs) {
    thisLayer.projections = [];

    for (let srs of layer.srs) {
      thisLayer.projections.push(srs.value);
    }

    if (parentLayer.projections) {
      // Add any projections from the parent layer
      thisLayer.projections = thisLayer.projections.concat(parentLayer.projections);
      // Remove any duplicates
      thisLayer.projections = Array.from(new Set(thisLayer.projections));
    }
  } else if (parentLayer.projections) {
    // If this layer has no crs defined, but the parent layer has projections, use those
    thisLayer.projections = parentLayer.projections;
  }

  // Load the bounding box with 'replace' inheritance
  if (layer.latLonBoundingBox) {
    thisLayer.boundingBox = {
      minLat: layer.latLonBoundingBox.miny,
      minLon: layer.latLonBoundingBox.minx,
      maxLat: layer.latLonBoundingBox.maxy,
      maxLon: layer.latLonBoundingBox.maxx,
    };
  } else if (parentLayer.projections) {
    thisLayer.boundingBox = parentLayer.boundingBox;
  }

  // Load dimensions with 'replace' inheritance
  thisLayer.dimensions = parentLayer.dimensions;
  if (layer.dimension) {
    if (!parentLayer.dimensions) {
      thisLayer.dimensions = {};
    }
    for (let dimension of layer.dimension) {
      thisLayer.dimensions[dimension.name] = {
        units: dimension.units,
        unitSymbol: dimension.unitSymbol,
      };
    }

    for (let extent of layer.extent) {
      let dimension = thisLayer.dimensions[extent.name];
      dimension.default = extent._default;
      dimension.multipleValues = extent.multipleValues === 1 || extent.multipleValues === '1';
      dimension.nearestValue = extent.nearestValue === 1 || extent.nearestValue === '1';
      dimension.current = extent.current === 1 || extent.current === '1';
      dimension.values = extent.value;

      if (dimension.values) {
        dimension.values = dimension.values.replace(/\r\n\s*/g, '').split(',');
      }

      for (let value of dimension.values) {
        if (value.includes('/')) {
          if (!dimension.intervals) {
            dimension.intervals = [];
          }
          let minMaxResolution = value.split('/');
          dimension.intervals.push({
            min: minMaxResolution[0],
            max: minMaxResolution[1],
            resolution: minMaxResolution[2],
          });
        }
      }

      if (dimension.intervals) {
        dimension.values = undefined;
      }
    }
  }

  return thisLayer;
}

/**
 * Parser for a WMS 1.3.0 layer
 * @param  {Object} layer       The layer
 * @param  {Object} parentLayer The parent layer of the layer
 * @return {Object}             The parsed layer
 */
function parseLayer1_3(layer, parentLayer = {}) {
  let thisLayer = parseLayerCommon(layer, parentLayer);

  // Load the projections with 'add' inheritance
  if (layer.crs) {
    thisLayer.projections = layer.crs;

    if (parentLayer.projections) {
      // Add any projections from the parent layer
      thisLayer.projections = thisLayer.projections.concat(parentLayer.projections);
      // Remove any duplicates
      thisLayer.projections = Array.from(new Set(thisLayer.projections));
    }
  } else if (parentLayer.projections) {
    // If this layer has no crs defined, but the parent layer has projections, use those
    thisLayer.projections = parentLayer.projections;
  }

  // Load the bounding box with 'replace' inheritance
  if (layer.exGeographicBoundingBox) {
    thisLayer.boundingBox = {
      minLat: layer.exGeographicBoundingBox.southBoundLatitude,
      minLon: layer.exGeographicBoundingBox.westBoundLongitude,
      maxLat: layer.exGeographicBoundingBox.northBoundLatitude,
      maxLon: layer.exGeographicBoundingBox.eastBoundLongitude,
    };
  } else if (parentLayer.projections) {
    thisLayer.boundingBox = parentLayer.boundingBox;
  }

  // Load dimensions with 'replace' inheritance
  thisLayer.dimensions = parentLayer.dimensions;
  if (layer.dimension) {
    if (!parentLayer.dimensions) {
      thisLayer.dimensions = {};
    }
    for (let dimension of layer.dimension) {
      thisLayer.dimensions[dimension.name] = {
        units: dimension.units,
        unitSymbol: dimension.unitSymbol,
        default: dimension._default,
        multipleValues: dimension.multipleValues,
        nearestValue: dimension.nearestValue,
        current: dimension.current,
        values: dimension.value,
      };

      if (thisLayer.dimensions[dimension.name].values) {
        thisLayer.dimensions[dimension.name].values = thisLayer.dimensions[dimension.name].values.replace(/\r\n\s*/g, '').split(',');
      }

      for (let value of thisLayer.dimensions[dimension.name].values) {
        if (value.includes('/')) {
          if (!thisLayer.dimensions[dimension.name].intervals) {
            thisLayer.dimensions[dimension.name].intervals = [];
          }
          let minMaxResolution = value.split('/');
          thisLayer.dimensions[dimension.name].intervals.push({
            min: minMaxResolution[0],
            max: minMaxResolution[1],
            resolution: minMaxResolution[2],
          });
        }
      }

      if (thisLayer.dimensions[dimension.name].intervals) {
        thisLayer.dimensions[dimension.name].values = undefined;
      }
    }
  }

  return thisLayer;
}
