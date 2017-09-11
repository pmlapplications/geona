/* eslint camelcase: 0 */

import {getCapabilities} from './common';

export function parseWmtsCapabilities(url) {
  return new Promise((resolve, reject) => {
    console.log('parseWmtsCapabilities');
    getCapabilities('wmts', url).then((jsonCapabilities) => {
      console.log('getCapabilities done');
      let capabilities = jsonCapabilities.value;

      switch (capabilities.version) {
        case '1.0.0':
          resolve(parse1_0(url, capabilities));
          break;
      }
    }).catch((err) => {
      reject(err);
    });
  });
}


function parse1_0(url, capabilities) {
  let serviceId = capabilities.serviceIdentification;
  let servicePr = capabilities.serviceProvider;

  let title = parseTitles(serviceId.title);

  // TODO Discussion on using || based on http://www.codereadability.com/javascript-default-parameters-with-or-operator/
  let abstractArray = serviceId._abstract || serviceId.abstract;
  let abstract = parseAbstracts(abstractArray);

  let serverConfig = {
    protocol: 'wmts',
    version: capabilities.version,
    url: url.replace(/\?.*/g, ''),

    service: {
      title: title || {},
      abstract: abstract || {},
      keywords: {},
      accessConstraints: serviceId.accessConstraints || [],
      onlineResource: servicePr.providerSite.href,
      contactInformation: {},
      fees: serviceId.fees,
    },

    layers: {
      operationsMetadata: {},
    },
  };

  if (serviceId.keywords && serviceId.keywords !== []) {
    serverConfig.service.keywords = parseKeywords(serviceId.keywords);
  }

  if (servicePr.serviceContact) {
    serverConfig.service.contactInformation.person = servicePr.serviceContact.individualName;
    serverConfig.service.contactInformation.position = servicePr.serviceContact.positionName;
    if (servicePr.serviceContact.contactInfo) {
      if (servicePr.serviceContact.contactInfo.address) {
        // If email isn't the only property in address
        if (!(Object.keys(servicePr.serviceContact.contactInfo.address).length === 2 && servicePr.serviceContact.contactInfo.address.electronicMailAddress)) {
          serverConfig.service.contactInformation.address = {};
          serverConfig.service.contactInformation.address.address = servicePr.serviceContact.contactInfo.address.deliveryPoint;
          serverConfig.service.contactInformation.address.city = servicePr.serviceContact.contactInfo.address.city;
          serverConfig.service.contactInformation.address.stateOrProvince = servicePr.serviceContact.contactInfo.address.administrativeArea;
          serverConfig.service.contactInformation.address.postCode = servicePr.serviceContact.contactInfo.address.postalCode;
          serverConfig.service.contactInformation.address.country = servicePr.serviceContact.contactInfo.address.country;
        }
        serverConfig.service.contactInformation.email = servicePr.serviceContact.contactInfo.address.electronicMailAddress;
      }
      if (servicePr.serviceContact.contactInfo.phone) {
        serverConfig.service.contactInformation.phone = servicePr.serviceContact.contactInfo.phone.voice;
      }
    }
  }

  // TODO move this underneath the following code, and uncomment line below
  // serverConfig.layers.operationsMetadata = {};
  serverConfig.layers.operationsMetadata = {
    identifier: {},
    title: {},
    abstract: {},
    keywords: {},
    boundingBox: {},
    style: {},
    format: {},
    infoFormat: {},
    dimension: {},
    metadata: {},
    tileMatrixSetLink: {},
    resourceUrl: {},
    tileMatrixSets: {},
  };

  let layerDataset = capabilities.contents.datasetDescriptionSummary;
  let opsMetadata = serverConfig.layers.operationsMetadata;

  // TODO Does this need to check that dataset.value exists?
  for (let dataset of layerDataset) {
    if (dataset.value) {
      if (dataset.value.identifier) {
        opsMetadata.identifier = dataset.value.identifier;
      }
      if (dataset.value.title) {
        opsMetadata.title = parseTitles(dataset.value.title);
      }
      if (dataset.value._abstract || dataset.value.abstract) {
        let datasetAbstractArray = dataset.value._abstract || dataset.value.abstract;
        opsMetadata.abstract = parseAbstracts(datasetAbstractArray);
      }
      if (dataset.value.keywords) {
        opsMetadata.keywords = parseKeywords(dataset.value.keywords);
      }
      if (dataset.value.boundingBox) {
        for (let box of dataset.value.boundingBox) {
          if (box.name && box.value) {
            if (box.name.localPart === 'WGS84BoundingBox') {
              // TODO should this be the converted crs, or stored in strange form (probably converted)?
              // urn:ogc:def:crs:OGC::84
              opsMetadata.boundingBox.OGC84 = {
                lowerCorner: box.value.lowerCorner,
                upperCorner: box.value.uppercorner,
                crs: 'OGC:84',
              };
              opsMetadata.boundingBox.OGC84dimensions = box.value.dimensions;
            } else {
              // Uses the CRS as an object-friendly ID (e.g. EPSG4326)
              let crsId = box.value.crs.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1$3');
              // TODO need research help - crs is optional if specified elsewhere... but is there an elsewhere for WMTS?
              opsMetadata.boundingBox[crsId] = {
                lowerCorner: box.value.lowerCorner,
                upperCorner: box.value.uppercorner,
              };
              opsMetadata.boundingBox[crsId].crs = box.value.crs.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
              opsMetadata.boundingBox[crsId].dimensions = box.value.dimensions;
            }
          }
        }
      }
      if (dataset.value.style) {
        for (let style of dataset.value.style) {
          // TODO if a property is undefined, should the information be excluded from our object, or just set to be empty?
          // Currently it is just being set to empty.
          // TODO should we check if title/abstract/keyword is undefined? The functions themselves also check but it might make these
          // sections of code more readable if we check here?
          // TODO should these have an identifier if the property is the identifier?
          opsMetadata.style[style.identifier.value] = {};
          opsMetadata.style[style.identifier.value].identifier = style.identifier.value;

          opsMetadata.style[style.identifier.value].title = parseTitles(style.title);

          let abstractsArray = style._abstract || style.abstract;
          opsMetadata.style[style.identifier.value].abstract = parseAbstracts(abstractsArray);

          opsMetadata.style[style.identifier.value].keywords = parseKeywords(style.keywords);

          if (style.legendURL !== undefined) {
            opsMetadata.style[style.identifier.value].legendURL = style.legendURL;
          }

          if (style.isDefault !== undefined) {
            opsMetadata.style[style.identifier.value].isDefault = style.isDefault;
          }
        }
      }

      if (dataset.value.format) {
        opsMetadata.format = dataset.value.format;
      }

      if (dataset.value.infoFormat) {
        opsMetadata.infoFormat = dataset.value.infoFormat;
      }

      if (dataset.value.dimension) {
        // TODO finish when you can find a wmts dimension example
        // opsMetadata.dimension = parseDimensions(dataset.value.dimension);
        opsMetadata.dimension = dataset.value.dimension;
      }

      if (dataset.value.metadata) {
        opsMetadata.metadata = dataset.value.metadata;
      }

      if (dataset.value.tileMatrixSetLink) {
        let tileMatrixSetLimitsObject = {};
        for (let matrixData of dataset.value.tileMatrixSetLink) {
          opsMetadata.tileMatrixSetLink[matrixData.tileMatrixSet] = {};
          opsMetadata.tileMatrixSetLink[matrixData.tileMatrixSet].tileMatrixSet = matrixData.tileMatrixSet;
          if (matrixData.tileMatrixSetLimits) {
            for (let currentMatrix of matrixData.tileMatrixSetLimits.tileMatrixLimits) {
              let currentMatrixLimits = {};
              currentMatrixLimits[currentMatrix.tileMatrix] = {};
              currentMatrixLimits[currentMatrix.tileMatrix].tileMatrix = currentMatrix.tileMatrix;
              currentMatrixLimits[currentMatrix.tileMatrix].minTileRow = currentMatrix.minTileRow;
              currentMatrixLimits[currentMatrix.tileMatrix].maxTileRow = currentMatrix.maxTileRow;
              currentMatrixLimits[currentMatrix.tileMatrix].minTileCol = currentMatrix.minTileCol;
              currentMatrixLimits[currentMatrix.tileMatrix].maxTileCol = currentMatrix.maxTileCol;
              Object.assign(tileMatrixSetLimitsObject, currentMatrixLimits);
            }
          }
          opsMetadata.tileMatrixSetLink[matrixData.tileMatrixSet].tileMatrixSetLimits = tileMatrixSetLimitsObject;
        }
      }

      if (dataset.value.resourceURL) {
        // TODO fix if we need it
        opsMetadata.resourceUrl = {temp: dataset.value.resourceURL};
      }
    }
  }

  let layerMatrix = capabilities.contents.tileMatrixSet;
  let matrixSets = serverConfig.layers.operationsMetadata.tileMatrixSets;
  for (let matrixSet of layerMatrix) {
    matrixSets[matrixSet.identifier.value] = {};
    matrixSets[matrixSet.identifier.value].identifier = matrixSet.identifier;
    // TODO should this be the converted crs, or stored in strange form (probably converted)?
    matrixSets[matrixSet.identifier.value].crs = matrixSet.supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
    matrixSets[matrixSet.identifier.value].tileMatrices = {};
    for (let tile of matrixSet.tileMatrix) {
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value] = {};
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].identifier = tile.identifier.value;
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].scaleDenominator = tile.scaleDenominator;
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].topLeftCorner = tile.topLeftCorner;
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].tileWidth = tile.tileWidth;
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].tileHeight = tile.tileHeight;
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].matrixWidth = tile.matrixWidth;
      matrixSets[matrixSet.identifier.value].tileMatrices[tile.identifier.value].matrixHeight = tile.matrixHeight;
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
      //
    }
  }
  return dimensionsObject;
}
