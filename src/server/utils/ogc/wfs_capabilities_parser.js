/** @module utils/ogc/wfs_capabilities_parser */

/* eslint camelcase: 0 */

import {getCapabilities, jsonifyCapabilities} from './common';

/**
 * Parse a WFS capabilities from a url.
 * @param  {String}  url The url of the service
 * @return {Promise}     A Promise that will resolve with a LayerServer config Object
 */
export function parseWfsCapabilities(url) {
  return new Promise((resolve, reject) => {
    getCapabilities('wfs', url)
      .then((xml) => {
        try {
          resolve(parseLocalWfsCapabilities(xml, url));
        } catch (err) {
          reject(err);
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

/**
 * Parse an XML WFS capabilities document.
 * @param  {String} xml The XML document as a string
 * @param  {String} url (optional) The url of the service
 * @return {Object}     A LayerServer config Object
 *
 * @throws Throws any error thrown by jsonifyCapabilities, and an error if the WMS version is unsupported.
 */
export function parseLocalWfsCapabilities(xml, url) {
  let jsonCapabilities;
  try {
    jsonCapabilities = jsonifyCapabilities('wfs', xml);
  } catch (err) {
    throw err;
  }

  let capabilities = jsonCapabilities.value;

  let result;
  switch (capabilities.version) {
    case '1':
    case '1.0':
    case '1.0.0':
      throw new Error('No support for WFS 1.0.0 currently');
    case '1.1':
    case '1.1.0':
      result = parse1_1(url, capabilities);
      break;
    case '2':
    case '2.0':
    case '2.0.0':
      result = parse2_0(url, capabilities);
      break;
  }
  return result;
}

/**
 * Parses the parts that are common between all WFS versions
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilities object
 * @return {Object}              The server config
 */
function parseCommon(url, capabilities) {
  let serverConfig = {
    protocol: 'wfs',
    version: capabilities.version,
    updateSequence: capabilities.updateSequence,
    url: undefined,
  };

  if (url) {
    serverConfig.url = url.replace(/\?.*/g, '');
  }

  return serverConfig;
}

/**
 * Parser for WFS version 1.1.0
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilities object
 * @return {Object}              The server config
 */
function parse1_1(url, capabilities) {
  // FIXME need to support multiple languages for title/abstract etc.
  let serviceId = capabilities.serviceIdentification;
  let servicePr = capabilities.serviceProvider;
  let opsMeta = capabilities.operationsMetadata;
  let ftl = capabilities.featureTypeList;
  let filter = capabilities.filterCapabilities;

  let serverConfig = parseCommon(url, capabilities);

  serverConfig.service = {
    title: {und: serviceId.title},
    abstract: {und: serviceId._abstract} || {},
    keywords: {und: []},
    contactInformation: {},
  };

  if (serviceId.keywords) {
    for (let keyword of serviceId.keywords) {
      serverConfig.service.keywords.und = serverConfig.service.keywords.und.concat(keyword.keyword);
    }
  }

  if (Object.keys(servicePr).length > 1) {
    let contactInformation = {};
    contactInformation.person = servicePr.serviceContact.individualName;
    contactInformation.organization = servicePr.providerName;
    contactInformation.position = servicePr.serviceContact.positionName;
    contactInformation.phone = [];
    for (let number of servicePr.serviceContact.contactInfo.phone.voice) {
      contactInformation.phone.push(number);
    }
    contactInformation.email = [];
    for (let email of servicePr.serviceContact.contactInfo.address.electronicMailAddress) {
      contactInformation.email.push(email);
    }
    contactInformation.address = {};
    contactInformation.address.address = servicePr.serviceContact.contactInfo.address.deliveryPoint;
    contactInformation.address.city = servicePr.serviceContact.contactInfo.address.city;
    contactInformation.address.stateOrProvince = servicePr.serviceContact.contactInfo.address.administrativeArea;
    contactInformation.address.postCode = servicePr.serviceContact.contactInfo.address.postalCode;
    contactInformation.address.country = servicePr.serviceContact.contactInfo.address.country;

    serverConfig.service.contactInformation = contactInformation;
  }

  if (Object.keys(opsMeta).length > 1) {
    let operationsMetadata = {};
    for (let operation of opsMeta.operation) {
      operationsMetadata[operation.name] = {};
      operationsMetadata[operation.name].dcp = [];
      if (operation.dcp) {
        let dcpObject = {};
        dcpObject.type = 'http';
        for (let method of operation.dcp[0].http.getOrPost) {
          if (method.name.localPart === 'Get') {
            dcpObject.get = {};
            dcpObject.get.href = method.value.href;
          } else {
            dcpObject.post = {};
            dcpObject.post.href = method.value.href;
          }
        }
        operationsMetadata[operation.name].dcp.push(dcpObject);
      }
      if (operation.parameter) {
        operationsMetadata[operation.name].parameters = {};
        for (let parameter of operation.parameter) {
          operationsMetadata[operation.name].parameters[parameter.name] = {};
          operationsMetadata[operation.name].parameters[parameter.name].values = parameter.value;
        }
      }
    }
    serverConfig.operationsMetadata = operationsMetadata;
  }

  if (Object.keys(ftl).length > 1) {
    serverConfig.featureTypes = {};
    let featureTypeList = serverConfig.featureTypes;
    featureTypeList.operations = ftl.operations.operation;
    featureTypeList.featureTypes = [];
    for (let featureType of ftl.featureType) {
      let feature = {};
      feature.identifier = featureType.name.localPart;
      feature.title = featureType.title;
      feature.abstract = featureType._abstract;
      feature.keywords = [];
      for (let keyword of featureType.keywords) {
        feature.keywords = feature.keywords.concat(keyword.keyword);
      }
      feature.projection = convertCrs(featureType.defaultSRS);
      feature.boundingBoxes = [];
      for (let box of featureType.wgs84BoundingBox) {
        let boundingBox = {
          minLat: box.lowerCorner[1],
          minLon: box.lowerCorner[0],
          maxLat: box.upperCorner[1],
          maxLon: box.upperCorner[0],
          style: 'wgs84BoundingBox',
        };
        feature.boundingBoxes.push(boundingBox);
      }
      featureTypeList.featureTypes.push(feature);
    }
  }

  serverConfig.filterCapabilities = {};
  if (Object.keys(filter).length > 1) {
    let filCap = {};
    if (filter.spatialCapabilities) {
      filCap.spatialCapabilities = {};
      if (filter.spatialCapabilities.geometryOperands) {
        filCap.spatialCapabilities.geometry = [];
        for (let operand of filter.spatialCapabilities.geometryOperands.geometryOperand) {
          filCap.spatialCapabilities.geometry.push(operand.localPart);
        }
      }
      filCap.spatialCapabilities.operators = [];
      for (let operator of filter.spatialCapabilities.spatialOperators.spatialOperator) {
        filCap.spatialCapabilities.operators.push(operator.name);
      }

      if (filter.scalarCapabilities) {
        filCap.scalarCapabilities = {};
        if (filter.scalarCapabilities.logicalOperators) {
          filCap.scalarCapabilities.logical = filter.scalarCapabilities.logicalOperators.logicalOperator;
        }
        if (filter.scalarCapabilities.comparisonOperators) {
          filCap.scalarCapabilities.comparison = filter.scalarCapabilities.comparisonOperators.comparisonOperator;
        }
        if (filter.scalarCapabilities.arithmeticOperators) {
          filCap.scalarCapabilities.arithmetic = [];
          for (let op of filter.scalarCapabilities.arithmeticOperators.ops) {
            if (op.functionNames) {
              for (let name of op.functionNames.functionName) {
                filCap.scalarCapabilities.arithmetic.push({
                  name: name.value,
                  argsCount: name.nArgs,
                });
              }
            }
          }
        }
      }

      if (filter.idCapabilities) {
        filCap.idCapabilities = [];
        // TODO don't just put the whole id in
        for (let id of filter.idCapabilities.ids) {
          filCap.idCapabilities.push(id);
        }
      }
    }
    serverConfig.filterCapabilities = filCap;
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
 * Parser for WFS version 2.0.0
 * @param  {String} url          The service url
 * @param  {Object} capabilities The capabilities object
 * @return {Object}              The server config
 */
function parse2_0(url, capabilities) {
  // FIXME need to support multiple languages for title/abstract etc.
  let serviceId = capabilities.serviceIdentification;
  let servicePr = capabilities.serviceProvider;
  let opsMeta = capabilities.operationsMetadata;
  let ftl = capabilities.featureTypeList;
  let filter = capabilities.filterCapabilities;

  let serverConfig = parseCommon(url, capabilities);

  serverConfig.service = {
    title: {und: serviceId.title[0].value},
    abstract: {und: serviceId._abstract[0].value} || {},
    keywords: {und: []},
    contactInformation: {},
  };

  // FIXME currently this just collates all the keywords of different languages into one list
  if (serviceId.keywords) {
    if (serviceId.keywords[0].keyword) {
      for (let keywords of serviceId.keywords) {
        for (let keyword of keywords.keyword) {
          serverConfig.service.keywords.und.push(keyword.value);
        }
      }
    }
  }

  if (Object.keys(servicePr).length > 1) {
    let contactInformation = {};
    contactInformation.person = servicePr.serviceContact.individualName;
    contactInformation.organization = servicePr.providerName;
    contactInformation.position = servicePr.serviceContact.positionName;
    contactInformation.phone = [];
    for (let number of servicePr.serviceContact.contactInfo.phone.voice) {
      contactInformation.phone.push(number);
    }
    contactInformation.email = [];
    for (let email of servicePr.serviceContact.contactInfo.address.electronicMailAddress) {
      contactInformation.email.push(email);
    }
    contactInformation.address = {};
    contactInformation.address.address = servicePr.serviceContact.contactInfo.address.deliveryPoint;
    contactInformation.address.city = servicePr.serviceContact.contactInfo.address.city;
    contactInformation.address.stateOrProvince = servicePr.serviceContact.contactInfo.address.administrativeArea;
    contactInformation.address.postCode = servicePr.serviceContact.contactInfo.address.postalCode;
    contactInformation.address.country = servicePr.serviceContact.contactInfo.address.country;

    serverConfig.service.contactInformation = contactInformation;
  }

  if (Object.keys(opsMeta).length > 1) {
    let operationsMetadata = {};
    if (opsMeta.operation) {
      for (let operation of opsMeta.operation) {
        operationsMetadata[operation.name] = {};
        operationsMetadata[operation.name].dcp = [];

        let dcpObject = {};
        dcpObject.type = 'http';
        for (let method of operation.dcp[0].http.getOrPost) {
          if (method.name.localPart === 'Get') {
            dcpObject.get = {};
            dcpObject.get.href = method.value.href;
          } else {
            dcpObject.post = {};
            dcpObject.post.href = method.value.href;
          }
        }
        operationsMetadata[operation.name].dcp.push(dcpObject);


        if (operation.parameter) {
          operationsMetadata[operation.name].parameters = {};
          for (let parameter of operation.parameter) {
            operationsMetadata[operation.name].parameters[parameter.name] = {};
            operationsMetadata[operation.name].parameters[parameter.name].values = [];
            for (let valueOrRange of parameter.allowedValues.valueOrRange) {
              operationsMetadata[operation.name].parameters[parameter.name].values.push(valueOrRange.value);
            }
          }
        }
      }
      serverConfig.operationsMetadata = operationsMetadata;
    }

    if (opsMeta.constraint) {
      for (let constraint of opsMeta.constraint) {
        operationsMetadata[constraint.name] = {};
        // TODO I assume that it will be noValues.value
        if (constraint.noValues) {
          operationsMetadata[constraint.name].valuesCount = constraint.noValues.value;
        }
        if (constraint.defaultValue) {
          operationsMetadata[constraint.name].default = constraint.defaultValue.value;
        }
        if (constraint.allowedValues) {
          if (constraint.allowedValues.valueOrRange) {
            operationsMetadata[constraint.name].allowedValues = [];
            for (let valueOrRange of constraint.allowedValues.valueOrRange) {
              operationsMetadata[constraint.name].allowedValues.push(valueOrRange.value);
            }
          }
        }
      }
    }
  }

  if (Object.keys(ftl).length > 1) {
    serverConfig.featureTypes = {};
    let featureTypeList = serverConfig.featureTypes;
    if (ftl.operations) {
      if (ftl.operations.operation) {
        featureTypeList.operations = ftl.operations.operation;
      }
    }
    featureTypeList.featureTypes = [];
    for (let featureType of ftl.featureType) {
      let feature = {};
      feature.identifier = featureType.name.localPart;
      // TODO multi-language support
      feature.title = featureType.title[0].value;
      feature.abstract = featureType._abstract[0].value;
      feature.keywords = [];
      if (featureType.keywords) {
        if (featureType.keywords[0].keyword) {
          for (let keywords of featureType.keywords) {
            let keywordsList = [];
            for (let keyword of keywords.keyword) {
              keywordsList.push(keyword.value);
            }
            feature.keywords = feature.keywords.concat(keywordsList);
          }
        }
      }
      feature.projection = convertCrs(featureType.defaultCRS);
      feature.boundingBoxes = [];
      for (let box of featureType.wgs84BoundingBox) {
        let boundingBox = {
          minLat: box.lowerCorner[1],
          minLon: box.lowerCorner[0],
          maxLat: box.upperCorner[1],
          maxLon: box.upperCorner[0],
          style: 'wgs84BoundingBox',
        };
        feature.boundingBoxes.push(boundingBox);
      }
      featureTypeList.featureTypes.push(feature);
    }
  }

  if (Object.keys(filter).length > 1) {
    let filCap = {};
    if (filter.spatialCapabilities) {
      filCap.spatialCapabilities = {};
      if (filter.spatialCapabilities.geometryOperands) {
        filCap.spatialCapabilities.geometry = [];
        for (let operand of filter.spatialCapabilities.geometryOperands.geometryOperand) {
          filCap.spatialCapabilities.geometry.push(operand.name.localPart);
        }
      }
      filCap.spatialCapabilities.operators = [];
      for (let operator of filter.spatialCapabilities.spatialOperators.spatialOperator) {
        filCap.spatialCapabilities.operators.push(operator.name);
      }
    }

    if (filter.scalarCapabilities) {
      filCap.scalarCapabilities = {};
      if (filter.scalarCapabilities.logicalOperators) {
        if (filter.scalarCapabilities.logicalOperators.logicalOperator) {
          filCap.scalarCapabilities.logical = filter.scalarCapabilities.logicalOperators.logicalOperator;
        }
      }
      if (filter.scalarCapabilities.comparisonOperators) {
        if (filter.scalarCapabilities.comparisonOperators.comparisonOperator) {
          filCap.scalarCapabilities.comparison = filter.scalarCapabilities.comparisonOperators.comparisonOperator.name;
        }
      }
      if (filter.scalarCapabilities.arithmeticOperators) {
        if (filter.scalarCapabilities.arithmeticOperators.arithmeticOperator) {
          filCap.scalarCapabilities.arithmetic = [];
          for (let op of filter.scalarCapabilities.arithmeticOperators.ops) {
            if (op.functionNames) {
              for (let name of op.functionNames.functionName) {
                filCap.scalarCapabilities.arithmetic.push({
                  name: name.value,
                  argsCount: name.nArgs,
                });
              }
            }
          }
        }
      }
    }

    if (filter.idCapabilities) {
      filCap.idCapabilities = [];
      // TODO don't just put the whole id in (need example)
      for (let id of filter.idCapabilities.resourceIdentifier) {
        filCap.idCapabilities.push(id.name.prefix);
      }
    }

    if (filter.conformance) {
      filCap.conformance = [];
      if (filter.conformance.constraint) {
        for (let constraint of filter.conformance.constraint) {
          let conformance = {};
          if (constraint.name) {
            conformance.name = constraint.name;
          }
          if (constraint.noValues) {
            conformance.valuesCount = constraint.noValues.value;
          }
          if (constraint.defaultValue) {
            conformance.default = constraint.defaultValue.value;
          }
          filCap.conformance.push(conformance);
        }
      }
    }

    if (filter.temporalCapabilities) {
      filCap.temporalCapabilities = [];
      if (filter.temporalCapabilities.temporalOperands) {
        for (let operand of filter.temporalCapabilities.temporalOperands.temporalOperand) {
          filCap.temporalCapabilities.push(operand.name.localPart);
        }
      }
    }

    if (filter.functions) {
      filCap.functions = [];
      if (filter.functions.function) {
        for (let func of filter.functions.function) {
          let functionDescription = {
            name: func.name,
            returns: func.returns.localPart,
            arguments: [],
          };
          if (func.arguments) {
            if (func.arguments.argument) {
              for (let arg of func.arguments.argument) {
                functionDescription.arguments.push({
                  type: arg.name,
                  specific: arg.type.localPart,
                });
              }
              filCap.functions.push(functionDescription);
            }
          }
        }
      }
    }

    if (filter.extendedCapabilities) {
      // TODO once example found
      filCap.extendedCapabilities = filter.extendedCapabilities;
    }
    serverConfig.filterCapabilities = filCap;
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
 * Converts the crs from the long OGC specification style into a normal crs string.
 * @param {String}  crs The crs in OGC specification style, e.g. 'urn:ogc:def:crs:OGC:2:84'.
 * @return {String}     The crs in normal style, e.g. 'OGC:84'.
 */
function convertCrs(crs) {
  let projection = crs.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
  // Seemingly, some projections use a slightly different format
  if (projection === crs) {
    projection = crs.replace(/urn:x-ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
  }
  if (projection === 'OGC:CRS84') {
    projection = 'EPSG:4326';
  }
  return projection;
}
