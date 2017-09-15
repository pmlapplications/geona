/** @module utils/ogc/wmts_capabilities_parser */

/* eslint camelcase: 0 */

import {getCapabilities, jsonifyCapabilities} from './common';

/**
 * Parse a WMTS capabilities from a url.
 * @param  {String}  url The url of the service
 * @return {Promise}     A Promise that will resolve with a LayerServer config Object
 */
export function parseWmtsCapabilities(url) {
  return new Promise((resolve, reject) => {
    getCapabilities('wmts', url).then((xml) => {
      try {
        resolve(parseLocalWmtsCapabilities(xml, url));
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
 * @throws Throws any error thrown by jsonifyCapabilities.
 */
export function parseLocalWmtsCapabilities(xml, url) {
  let jsonCapabilities;

  try {
    jsonCapabilities = jsonifyCapabilities('wmts', xml);
  } catch (err) {
    throw err;
  }

  let capabilities = jsonCapabilities.value;
  // WMTS 1.0.0 is currently the only official version
  return (parse1_0(url, capabilities));
}

/**
 * Parses the converted WMTS 1.0.0 XML file returned from a GetCapabilities request into a Geona Layer format.
 * @param {String} url          The URL that has been used for the GetCapabilities request.
 * @param {Object} capabilities XML that has been unmarshalled to JSON.
 * @return {Object}             Geona server config options.
 */
function parse1_0(url, capabilities) {
  let serviceId = capabilities.serviceIdentification;
  let servicePr = capabilities.serviceProvider;

  let serverConfig = {
    protocol: 'wmts',
    version: capabilities.version,
    url: undefined,

    service: {},
  };

  if (url) {
    serverConfig.url = url.replace(/\?.*/g, '');
  }
  if (serviceId.title) {
    serverConfig.service.title = parseTitles(serviceId.title);
  }
  if (serviceId._abstract) {
    serverConfig.service.abstract = parseAbstracts(serviceId._abstract);
  }
  if (serviceId.keywords) {
    serverConfig.service.keywords = parseKeywords(serviceId.keywords);
  }
  if (serviceId.accessConstraints) {
    serverConfig.service.accessConstraints = serviceId.accessConstraints;
  }
  if (servicePr.providerSite.href) {
    serverConfig.service.onlineResource = servicePr.providerSite.href;
  }

  if (servicePr.serviceContact) {
    serverConfig.service.contactInformation = {};
    if (servicePr.serviceContact.individualName) {
      serverConfig.service.contactInformation.person = servicePr.serviceContact.individualName;
    }
    if (servicePr.serviceContact.positionName) {
      serverConfig.service.contactInformation.position = servicePr.serviceContact.positionName;
    }
    if (servicePr.serviceContact.contactInfo) {
      if (servicePr.serviceContact.contactInfo.address) {
        let provAddress = servicePr.serviceContact.contactInfo.address;
        // If email isn't the only property in address
        if (!(Object.keys(provAddress).length === 2 && provAddress.electronicMailAddress)) {
          serverConfig.service.contactInformation.address = {};
          if (provAddress.deliveryPoint) {
            if (provAddress.deliveryPoint[0] !== '') {
              serverConfig.service.contactInformation.address.addressLines = provAddress.deliveryPoint;
            }
          }
          if (provAddress.city) {
            serverConfig.service.contactInformation.address.city = provAddress.city;
          }
          if (provAddress.administrativeArea) {
            serverConfig.service.contactInformation.address.stateOrProvince = provAddress.administrativeArea;
          }
          if (provAddress.postalCode) {
            serverConfig.service.contactInformation.address.postCode = provAddress.postalCode;
          }
          if (provAddress.country) {
            serverConfig.service.contactInformation.address.country = provAddress.country;
          }
          // Due to the way unmarshalling works, some undefined values do not return as falsy. 
          if (Object.keys(serverConfig.service.contactInformation.address).length === 0) {
            serverConfig.service.contactInformation.address = undefined;
          }
        }


        if (provAddress.electronicMailAddress) {
          if (provAddress.electronicMailAddress[0] !== '') {
            serverConfig.service.contactInformation.email = provAddress.electronicMailAddress;
          }
        }
      }
      if (servicePr.serviceContact.contactInfo.phone) {
        if (servicePr.serviceContact.contactInfo.phone.voice) {
          if (servicePr.serviceContact.contactInfo.phone.voice[0]) {
            serverConfig.service.contactInformation.phone = servicePr.serviceContact.contactInfo.phone.voice;
          }
        }
      }
    }
  }
  // If we have reached this point and the contact information in our serverConfig is
  // only {address: undefined}, we remove contact information.
  if (Object.keys(serverConfig.service.contactInformation).length === 1
        && serverConfig.service.contactInformation.address === undefined) {
    serverConfig.service.contactInformation = undefined;
  }

  if (serviceId.fees) {
    serverConfig.service.fees = serviceId.fees;
  }

  let opsMetadata = capabilities.operationsMetadata;
  if (opsMetadata) {
    serverConfig.operationsMetadata = {};
    for (let operation of opsMetadata.operation) {
      serverConfig.operationsMetadata[operation.name] = {};
      // While WMTS only supports HTTP DCP, we just take the first (and only) item from the array.
      for (let getOrPost of operation.dcp[0].http.getOrPost) {
        if (getOrPost.name.localPart === 'Get') {
          if (serverConfig.operationsMetadata[operation.name].get === undefined) {
            serverConfig.operationsMetadata[operation.name].get = [];
          }
          serverConfig.operationsMetadata[operation.name].get.push(getOrPost.value.href);
        } else {
          if (serverConfig.operationsMetadata[operation.name].post === undefined) {
            serverConfig.operationsMetadata[operation.name].post = [];
          }
          serverConfig.operationsMetadata[operation.name].post.push(getOrPost.value.href);
        }
      }
    }
  }

  serverConfig.layers = [];
  let layerDataset = capabilities.contents.datasetDescriptionSummary;

  for (let dataset of layerDataset) {
    let layerData = {};
    if (dataset.value) {
      // Identifier is a mandatory property
      layerData.identifier = dataset.value.identifier.value;

      if (dataset.value.title) {
        layerData.title = parseTitles(dataset.value.title);
      }
      if (dataset.value._abstract) {
        layerData.abstract = parseAbstracts(dataset.value._abstract);
      }
      if (dataset.value.keywords) {
        layerData.keywords = parseKeywords(dataset.value.keywords);
      }
      if (dataset.value.boundingBox) {
        layerData.boundingBox = {};
        for (let box of dataset.value.boundingBox) {
          if (box.name && box.value) {
            if (box.name.localPart === 'WGS84BoundingBox') {
              layerData.boundingBox = {
                minLat: box.value.lowerCorner[1],
                minLon: box.value.lowerCorner[0],
                maxLat: box.value.upperCorner[1],
                maxLon: box.value.upperCorner[0],
              };
              layerData.boundingBox.OGC84dimensions = box.value.dimensions;
            }
          }
        }
      }
      // Style is a mandatory property
      layerData.styles = {};
      for (let style of dataset.value.style) {
        layerData.styles[style.identifier.value] = {};

        if (style.title) {
          layerData.styles[style.identifier.value].title = parseTitles(style.title);
        }

        if (style._abstract) {
          layerData.styles[style.identifier.value].abstract = parseAbstracts(style._abstract);
        }

        if (style.keywords) {
          layerData.styles[style.identifier.value].keywords = parseKeywords(style.keywords);
        }

        if (style.legendURL !== undefined) {
          layerData.styles[style.identifier.value].legendURL = style.legendURL;
        }

        if (style.isDefault !== undefined) {
          layerData.styles[style.identifier.value].isDefault = style.isDefault;
        }
      }

      // Format is a mandatory property
      layerData.formats = dataset.value.format;


      if (dataset.value.infoFormat) {
        layerData.infoFormat = dataset.value.infoFormat;
      }

      if (dataset.value.dimension) {
        layerData.dimension = parseDimensions(dataset.value.dimension);
      }

      if (dataset.value.metadata) {
        // Real metadata examples did not match the schema, so we take everything and remove TYPE_NAME afterwards
        layerData.metadata = dataset.value.metadata;
        for (let data of layerData.metadata) {
          data.TYPE_NAME = undefined;
        }
      }

      // TileMatrixSetLink is a mandatory property
      layerData.tileMatrixSetLinks = {};
      let tileMatrixSetLimitsObject = {};
      for (let matrixData of dataset.value.tileMatrixSetLink) {
        layerData.tileMatrixSetLinks[matrixData.tileMatrixSet] = {};
        if (matrixData.tileMatrixSetLimits) {
          for (let currentMatrix of matrixData.tileMatrixSetLimits.tileMatrixLimits) {
            let currentMatrixLimits = {};
            currentMatrixLimits[currentMatrix.tileMatrix] = {};
            currentMatrixLimits[currentMatrix.tileMatrix].minTileRow = currentMatrix.minTileRow;
            currentMatrixLimits[currentMatrix.tileMatrix].maxTileRow = currentMatrix.maxTileRow;
            currentMatrixLimits[currentMatrix.tileMatrix].minTileCol = currentMatrix.minTileCol;
            currentMatrixLimits[currentMatrix.tileMatrix].maxTileCol = currentMatrix.maxTileCol;
            Object.assign(tileMatrixSetLimitsObject, currentMatrixLimits);
          }
        }
        layerData.tileMatrixSetLinks[matrixData.tileMatrixSet].tileMatrixSetLimits = tileMatrixSetLimitsObject;
      }


      if (dataset.value.resourceURL) {
        layerData.resourceUrls = [];
        for (let resource of dataset.value.resourceURL) {
          let thisResource = {};
          thisResource.format = resource.format;
          thisResource.resourceType = resource.resourceType;
          thisResource.template = resource.template;
          layerData.resourceUrls.push(thisResource);
        }
      }
    }
    serverConfig.layers.push(layerData);
  }

  let layerMatrix = capabilities.contents.tileMatrixSet;
  if (layerMatrix) {
    serverConfig.tileMatrixSets = {};
    let matrixSets = serverConfig.tileMatrixSets;
    for (let matrixSet of layerMatrix) {
      let thisMatrixSet = matrixSets[matrixSet.identifier.value] = {};
      thisMatrixSet.projection = matrixSet.supportedCRS
        .replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');

      thisMatrixSet.tileMatrices = [];
      for (let tile of matrixSet.tileMatrix) {
        let thisMatrix = {};
        thisMatrix.identifier = tile.identifier.value;
        thisMatrix.scaleDenominator = tile.scaleDenominator;
        thisMatrix.topLeftCorner = tile.topLeftCorner;
        thisMatrix.tileWidth = tile.tileWidth;
        thisMatrix.tileHeight = tile.tileHeight;
        thisMatrix.matrixWidth = tile.matrixWidth;
        thisMatrix.matrixHeight = tile.matrixHeight;

        thisMatrixSet.tileMatrices.push(thisMatrix);
      }
    }
  }
  return serverConfig;
}

/**
 * Constructs an object containing titles separated by language code.
 * @param {Array} titles An array of titles with value and optional lang properties.
 * @return {Object}      Object with language separated titles.
 */
function parseTitles(titles) {
  let titleObject = {};
  if (titles !== undefined) {
    if (titles !== []) {
      if (titles.length > 1) {
        for (let currentTitle of titles) {
          if (currentTitle.lang) {
            Object.assign(titleObject, {
              [currentTitle.lang]: currentTitle.value,
            });
          } else {
            Object.assign(titleObject, {
              'und': currentTitle.value,
            });
          }
        }
      } else {
        if (titles[0].lang) {
          titleObject = {
            [titles[0].lang]: titles[0].value,
          };
        } else {
          titleObject = {
            'und': titles[0].value,
          };
        }
      }
    }
  }
  return titleObject;
}

/**
 * Constructs an object containing abstracts separated by language code.
 * @param {Array} abstracts An array of abstracts with value and optional lang properties.
 * @return {Object}         Object with language-separated abstracts.
 */
function parseAbstracts(abstracts) {
  let abstractObject = {};
  if (abstracts !== undefined) {
    if (abstracts !== []) {
      if (abstracts.length > 1) {
        for (let currentAbstract of abstracts) {
          if (currentAbstract.lang) {
            Object.assign(abstractObject, {
              [currentAbstract.lang]: currentAbstract.value,
            });
          } else {
            Object.assign(abstractObject, {
              'und': currentAbstract.value,
            });
          }
        }
      } else if (abstracts !== []) {
        if (abstracts[0].lang) {
          abstractObject = {
            [abstracts[0].lang]: abstracts[0].value,
          };
        } else {
          abstractObject = {
            'und': abstracts[0].value,
          };
        }
      }
    }
  }
  return abstractObject;
}

/**
 * Constructs an object containing arrays of keywords separated by language code.
 * @param {Array} keywords An array of keywords with value and optional lang properties.
 * @return {Object}        Object with language-separated keyword arrays.
 */
function parseKeywords(keywords) {
  let keywordObject = {};
  if (keywords !== undefined) {
    if (keywords !== []) {
      for (let keywordList of keywords) {
        if (keywordList.keyword !== []) {
          for (let keyword of keywordList.keyword) {
            // if undefined, we use the und language code
            if (!keyword.lang) {
              if (!keywordObject[keyword.lang]) {
                keywordObject.und = [];
              }
              keywordObject.und.push(keyword.value);
            } else {
              if (!keywordObject[keyword.lang]) {
                keywordObject[keyword.lang] = [];
              }
              keywordObject[keyword.lang].push(keyword.value);
            }
          }
        }
      }
    }
  }
  return keywordObject;
}

/**
 *
 * @param {Array} dimensions
 * @return {Object}
 */
function parseDimensions(dimensions) {
  let dimensionsObject = {};
  if (dimensions !== undefined) {
    if (dimensions !== []) {
      for (let dimension of dimensions) {
        dimensionsObject[dimension.identifier.value] = {};
        if (dimension.title) {
          dimensionsObject[dimension.identifier.value].title = parseTitles(dimension.title);
        }
        if (dimension._abstract) {
          dimensionsObject[dimension.identifier.value].abstract = parseAbstracts(dimension._abstract);
        }
        if (dimension.keywords) {
          dimensionsObject[dimension.identifier.value].keywords = parseKeywords(dimension.keywords);
        }
        if (dimension.uom) {
          dimensionsObject[dimension.identifier.value].uom = dimension.uom.value;
        }
        if (dimension.unitSymbol) {
          dimensionsObject[dimension.identifier.value].unitSymbol = dimension.unitSymbol;
        }

        // Default is a mandatory property
        let dimDefault = dimension._default || dimension.default;
        dimensionsObject[dimension.identifier.value].default = dimDefault;

        if (dimension.current) {
          dimensionsObject[dimension.identifier.value].current = dimension.current;
        }

        // Value is a mandatory property
        dimensionsObject[dimension.identifier.value].value = dimension.value;
      }
    }
  }
  return dimensionsObject;
}
