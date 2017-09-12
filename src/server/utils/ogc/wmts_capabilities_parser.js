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
 * @param {*} url
 * @param {*} capabilities
 * @return {Object}        Geona server config options.
 */
function parse1_0(url, capabilities) {
  let serviceId = capabilities.serviceIdentification;
  let servicePr = capabilities.serviceProvider;

  let title = parseTitles(serviceId.title);

  let abstractArray = serviceId._abstract || serviceId.abstract;
  let abstract = parseAbstracts(abstractArray);

  let serverConfig = {
    protocol: 'wmts',
    version: capabilities.version,
    url: undefined,

    service: {
      title: title || {},
      abstract: abstract || {},
      keywords: {},
      accessConstraints: serviceId.accessConstraints || [],
      onlineResource: servicePr.providerSite.href,
      contactInformation: {},
      fees: serviceId.fees,
    },
  };

  if (url) {
    serverConfig.url = url.replace(/\?.*/g, '');
  }

  if (serviceId.keywords && serviceId.keywords !== []) {
    serverConfig.service.keywords = parseKeywords(serviceId.keywords);
  }

  if (servicePr.serviceContact) {
    serverConfig.service.contactInformation.person = servicePr.serviceContact.individualName;
    serverConfig.service.contactInformation.position = servicePr.serviceContact.positionName;
    if (servicePr.serviceContact.contactInfo) {
      if (servicePr.serviceContact.contactInfo.address) {
        let provAddress = servicePr.serviceContact.contactInfo.address;
        // If email isn't the only property in address
        if (!(Object.keys(provAddress).length === 2 && provAddress.electronicMailAddress)) {
          serverConfig.service.contactInformation.address = {};
          if (provAddress.deliveryPoint) {
            serverConfig.service.contactInformation.address.addressLines = provAddress.deliveryPoint;
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
        }
        if (provAddress.electronicMailAddress) {
          serverConfig.service.contactInformation.email = provAddress.electronicMailAddress;
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
      if (dataset.value._abstract || dataset.value.abstract) {
        let datasetAbstractArray = dataset.value._abstract || dataset.value.abstract;
        layerData.abstract = parseAbstracts(datasetAbstractArray);
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
      layerData.style = {};
      for (let style of dataset.value.style) {
        layerData.style[style.identifier.value] = {};

        if (style.title) {
          layerData.style[style.identifier.value].title = parseTitles(style.title);
        }

        if (style.abstract) {
          let abstractsArray = style._abstract || style.abstract;
          layerData.style[style.identifier.value].abstract = parseAbstracts(abstractsArray);
        }

        if (style.keywords) {
          layerData.style[style.identifier.value].keywords = parseKeywords(style.keywords);
        }

        if (style.legendURL !== undefined) {
          layerData.style[style.identifier.value].legendURL = style.legendURL;
        }

        if (style.isDefault !== undefined) {
          layerData.style[style.identifier.value].isDefault = style.isDefault;
        }
      }


      // Format is a mandatory property
      layerData.format = dataset.value.format;


      if (dataset.value.infoFormat) {
        layerData.infoFormat = dataset.value.infoFormat;
      }

      if (dataset.value.dimension) {
        // TODO finish when you can find a wmts dimension example
        // layerData.dimension = parseDimensions(dataset.value.dimension);
        layerData.dimension = 'TODO';
      }

      if (dataset.value.metadata) {
        layerData.metadata = 'TODO';
      }

      // TileMatrixSetLink is a mandatory property
      layerData.tileMatrixSetLink = {};
      let tileMatrixSetLimitsObject = {};
      for (let matrixData of dataset.value.tileMatrixSetLink) {
        layerData.tileMatrixSetLink[matrixData.tileMatrixSet] = {};
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
        layerData.tileMatrixSetLink[matrixData.tileMatrixSet].tileMatrixSetLimits = tileMatrixSetLimitsObject;
      }


      if (dataset.value.resourceURL) {
        // TODO fix if we need it
        layerData.resourceUrl = {temp: dataset.value.resourceURL};
      }
    }
    serverConfig.layers.push(layerData);
  }

  let layerMatrix = capabilities.contents.tileMatrixSet;
  if (layerMatrix) {
    serverConfig.tileMatrixSets = {};
    let matrixSets = serverConfig.tileMatrixSets;
    for (let matrixSet of layerMatrix) {
      matrixSets[matrixSet.identifier.value] = {};
      matrixSets[matrixSet.identifier.value].crs = matrixSet.supportedCRS
        .replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');

      matrixSets[matrixSet.identifier.value].tileMatrices = {};
      for (let tile of matrixSet.tileMatrix) {
        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value] = {};
        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].scaleDenominator = tile
          .scaleDenominator;

        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].topLeftCorner = tile.topLeftCorner;
        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].tileWidth = tile.tileWidth;
        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].tileHeight = tile.tileHeight;
        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].matrixWidth = tile.matrixWidth;
        matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].matrixHeight = tile.matrixHeight;
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

// /**
//  *
//  * @param {Array} dimensions
//  * @return {Object}
//  */
// function parseDimensions(dimensions) {
//   let dimensionsObject = {};
//   if (dimensions !== undefined) {
//     if (dimensions !== []) {
//       //
//     }
//   }
//   return dimensionsObject;
// }
