/** @module utils/ogc/wmts_capabilities_parser */

/* eslint camelcase: 0 */

import {getCapabilities, jsonifyCapabilities} from './common';
import proj4 from 'proj4';

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
  // TODO comment this whole method for readability
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
  if (servicePr) {
    if (servicePr.providerSite) {
      if (servicePr.providerSite.href) {
        serverConfig.service.onlineResource = servicePr.providerSite.href;
      }
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
          let requestMethod = {};
          requestMethod.url = getOrPost.value.href;
          requestMethod.encoding = [];
          for (let constraint of getOrPost.value.constraint) {
            if (constraint.name === 'GetEncoding') {
              for (let value of constraint.allowedValues.valueOrRange) {
                requestMethod.encoding.push(value.value);
              }
            }
          }
          serverConfig.operationsMetadata[operation.name].get.push(requestMethod);
        } else {
          if (serverConfig.operationsMetadata[operation.name].post === undefined) {
            serverConfig.operationsMetadata[operation.name].post = [];
          }
          let requestMethod = {};
          requestMethod.url = getOrPost.value.href;
          requestMethod.encoding = [];
          for (let constraint of getOrPost.value.constraint) {
            if (constraint.name === 'PostEncoding') {
              for (let value of constraint.allowedValues.valueOrRange) {
                requestMethod.encoding.push(value.value);
              }
            }
          }
          serverConfig.operationsMetadata[operation.name].post.push(requestMethod);
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
            layerData.boundingBox = populateBoundingBox(box);
          }
        }
      }
    }
    // Style is a mandatory property
    layerData.styles = [];
    for (let style of dataset.value.style) {
      let styleObject = {};
      styleObject.identifier = style.identifier.value;

      if (style.title) {
        styleObject.title = parseTitles(style.title);
      }

      if (style._abstract) {
        styleObject.abstract = parseAbstracts(style._abstract);
      }

      if (style.keywords) {
        styleObject.keywords = parseKeywords(style.keywords);
      }

      if (style.legendURL !== undefined) {
        styleObject.legendURL = style.legendURL;
      }

      if (style.isDefault !== undefined) {
        styleObject.isDefault = style.isDefault;
      }

      layerData.styles.push(styleObject);
    }

    // Format is a mandatory property
    layerData.formats = dataset.value.format;


    if (dataset.value.infoFormat) {
      layerData.infoFormat = dataset.value.infoFormat;
    }

    if (dataset.value.dimension) {
      layerData.dimensions = parseDimensions(dataset.value.dimension);
    }

    if (dataset.value.metadata) {
      // Real metadata examples did not match the schema, so we take everything and remove TYPE_NAME afterwards
      layerData.metadata = dataset.value.metadata;
      for (let data of layerData.metadata) {
        data.TYPE_NAME = undefined;
      }
    }

    // TileMatrixSetLink is a mandatory property
    layerData.tileMatrixSetLinks = [];
    for (let matrixData of dataset.value.tileMatrixSetLink) {
      let setLinksObject = {};
      setLinksObject.tileMatrixSet = matrixData.tileMatrixSet;

      let tileMatrixLimitsArray = [];
      if (matrixData.tileMatrixSetLimits) {
        for (let currentMatrix of matrixData.tileMatrixSetLimits.tileMatrixLimits) {
          let currentMatrixLimits = {};
          currentMatrixLimits.identifier = currentMatrix.tileMatrix;
          currentMatrixLimits.minTileRow = currentMatrix.minTileRow;
          currentMatrixLimits.maxTileRow = currentMatrix.maxTileRow;
          currentMatrixLimits.minTileCol = currentMatrix.minTileCol;
          currentMatrixLimits.maxTileCol = currentMatrix.maxTileCol;
          tileMatrixLimitsArray.push(currentMatrixLimits);
        }
      }
      if (tileMatrixLimitsArray.length === 0) {
        setLinksObject.tileMatrixLimits = undefined;
      } else {
        setLinksObject.tileMatrixLimits = tileMatrixLimitsArray;
      }
      layerData.tileMatrixSetLinks.push(setLinksObject);
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
    serverConfig.layers.push(layerData);
  }

  let layerMatrix = capabilities.contents.tileMatrixSet;
  if (layerMatrix) {
    // Sometimes the bounding box data is stored in the TileMatrixSet, so we need to populate the bounding box
    // of the layers here instead
    if (!serverConfig.layers[0].boundingBox) {
      for (let layer of serverConfig.layers) {
        for (let tileMatrixSet of layer.tileMatrixSetLinks) {
          // TODO If the layer has a link to the current tile matrix set AND there isn't already a bounding box, add the bounding box to the layer
          for (let tileMatrixSetId of layerMatrix) {
            if (tileMatrixSet.tileMatrixSet === tileMatrixSetId.identifier.value) {
              if (tileMatrixSetId.boundingBox) {
                let currentTileMatrixBox = tileMatrixSetId.boundingBox;
                layer.boundingBox = {};
                if (currentTileMatrixBox.name && currentTileMatrixBox.value) {
                  layer.boundingBox = populateBoundingBox(currentTileMatrixBox);
                }
              }
            }
          }
        }
      }
    }
    serverConfig.tileMatrixSets = {};
    let matrixSets = serverConfig.tileMatrixSets;
    for (let matrixSet of layerMatrix) {
      let thisMatrixSet = matrixSets[matrixSet.identifier.value] = {};
      thisMatrixSet.projection = convertCrs(matrixSet.supportedCRS);
      if (thisMatrixSet.projection === 'OGC:CRS84') {
        thisMatrixSet.projection = 'EPSG:4326';
      }

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
  let dimensionsArray = [];
  if (dimensions !== undefined) {
    if (dimensions !== []) {
      for (let dimension of dimensions) {
        // Contains all the information for one dimension
        let dimensionObject = {identifier: dimension.identifier.value};
        if (dimension.title) {
          dimensionObject.title = parseTitles(dimension.title);
        }
        if (dimension._abstract) {
          dimensionObject.abstract = parseAbstracts(dimension._abstract);
        }
        if (dimension.keywords) {
          dimensionObject.keywords = parseKeywords(dimension.keywords);
        }
        if (dimension.uom) {
          dimensionObject.uom = dimension.uom.value;
        }
        if (dimension.unitSymbol) {
          dimensionObject.unitSymbol = dimension.unitSymbol;
        }

        // Default is a mandatory property
        let dimDefault = dimension._default || dimension.default;
        dimensionObject.default = dimDefault;

        if (dimension.current) {
          dimensionObject.current = dimension.current;
        }

        // Value is a mandatory property
        dimensionObject.value = dimension.value;

        dimensionsArray.push(dimensionObject);
      }
    }
  }
  return dimensionsArray;
}

/**
 * Converts the crs from the long OGC specification style into a normal crs string.
 * @param {String}  crs The crs in OGC specification style, e.g. 'urn:ogc:def:crs:OGC:2:84'.
 * @return {String}     The crs in normal style, e.g. 'OGC:84'.
 */
function convertCrs(crs) {
  return crs.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');
}

/**
 * Populates and returns an Object containing bounding box data
 * with the correct axis orientation, projection code and dimensions.
 * @param {Object}  box The bounding box
 * @return {Object}     The bounding box data as an Object
 */
function populateBoundingBox(box) {
  let boundingBox;
  if (box.name.localPart === 'WGS84BoundingBox') {
    boundingBox = {
      minLat: box.value.lowerCorner[1],
      minLon: box.value.lowerCorner[0],
      maxLat: box.value.upperCorner[1],
      maxLon: box.value.upperCorner[0],
      style: 'wgs84BoundingBox',
      dimensions: box.value.dimensions,
    };
    if (box.value.crs) {
      boundingBox.projection = convertCrs(box.value.crs);
    }
  } else {
    // Gets the proj4 axis orientation, e.g. 'enu' and takes only the first two letters to get the x/y order
    let xyOrientation = proj4(convertCrs(box.value.crs)).oProj.axis.substr(0, 2);
    if (xyOrientation === 'en') {
      boundingBox = {
        minLat: box.value.lowerCorner[1],
        minLon: box.value.lowerCorner[0],
        maxLat: box.value.upperCorner[1],
        maxLon: box.value.upperCorner[0],
        style: 'boundingBox',
        dimensions: box.value.dimensions,
      };
      if (box.value.crs) {
        boundingBox.projection = convertCrs(box.value.crs);
      }
    } else {
      boundingBox = {
        minLat: box.value.lowerCorner[0],
        minLon: box.value.lowerCorner[1],
        maxLat: box.value.upperCorner[0],
        maxLon: box.value.upperCorner[1],
        style: 'boundingBox',
        dimensions: box.value.dimensions,
      };
      if (box.value.crs) {
        boundingBox.projection = convertCrs(box.value.crs);
      }
    }
  }
  return boundingBox;
}
