/* eslint camelcase: 0 */

import {getCapabilities} from './common';

export function parseWmsCapabilities(url) {
  return new Promise((resolve, reject) => {
    console.log('parseWmsCapabilities');
    getCapabilities('wms', url).then((jsonCapabilities) => {
      console.log('getCapabilities done');
      let capabilities = jsonCapabilities.value;

      switch (capabilities.version) {
        case '1.0.0':
          reject(new Error('No support for WMS 1.0.0 currently'));
          break;
        case '1.1.0':
        case '1.1.1':
          resolve(parse1_1(url, capabilities));
          break;
        case '1.3.0':
          resolve(parse1_3(url, capabilities));
          break;
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function parseCommon(url, capabilities) {
  let service = capabilities.service;
  let capability = capabilities.capability;

  let serverConfig = {
    protocol: 'wms',
    version: capabilities.version,
    url: url.replace(/\?.*/g, ''),

    service: {
      title: {und: service.title},
      abstract: {und: service._abstract} || {und: service.abstract} || {},
      keywords: {und: []},
      onlineResource: service.onlineResource.href,
      contactInformation: {},
    },

    capability: {},
  };

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

  function getFormats(formatArray) {
    let formats = [];
    for (let format of formatArray) {
      formats.push(format.value);
    }
    return formats;
  }

  return serverConfig;
}

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
