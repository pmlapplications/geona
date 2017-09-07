import request from 'request';

import Layer from '../../common/layer/layer';
import LayerServer from '../../common/layer/layer_server';
import LayerWms from '../../common/layer/layer_wms';
import {getCapabilities} from '../utils/ogc/common';
import {parseWmsCapabilities} from '../utils/ogc/wms_capabilities_parser';

/**
 * Get the available data layers and server details from a wcs server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wcsGetLayers(req, res) {
  getCapabilities('wcs', req.params.url).then((jsonCapabilities) => {
    res.json(jsonCapabilities);
  }).catch((err) => {
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}

/**
 * Get the available layers and server details from a wms server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wmsGetLayers(req, res) {
  getCapabilities('wms', req.params.url).then((jsonCapabilities) => {
    // res.json(jsonCapabilities);
    return parseWmsCapabilities(req.params.url);
  }).then((layer) => {
    res.json(layer);
    // console.log(JSON.stringify(layer));
  }).catch((err) => {
    console.log(err);
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}

/**
 * Get the available layers and server details from a wmts server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wmtsGetLayers(req, res) {
  // Add parsing for Layers
  getCapabilities('wmts', req.params.url).then((jsonCapabilities) => {
    res.json(jsonCapabilities);

    let capabilities = jsonCapabilities.value;
    let serviceId = capabilities.serviceIdentification;
    let servicePr = capabilities.serviceProvider;

    let titleArray = serviceId.title || [];
    let title = {};
    if (titleArray.length > 1) {
      // loop through and categorise
      for (let currentTitle of serviceId.title) {
        if (currentTitle.lang) {
          Object.assign(title, {
            [currentTitle.lang]: currentTitle.value,
          });
        } else {
          Object.assign(title, {
            'und': currentTitle.value,
          });
        }
      }
    } else {
      // straight create an object
      if (titleArray[0].lang) {
        title = {
          [titleArray[0].lang]: titleArray[0].value,
        };
      } else {
        title = {
          'und': titleArray[0].value,
        };
      }
    }

    let abstractArray = serviceId._abstract || serviceId.abstract || [];
    let abstract = {};
    if (abstractArray.length > 1) {
      // loop through and categorise
      let serviceIdAbstract = serviceId.abstract || serviceId._abstract;
      if (serviceIdAbstract) {
        for (let currentAbstract of serviceIdAbstract) {
          if (currentAbstract.lang) {
            Object.assign(abstract, {
              [currentAbstract.lang]: currentAbstract.value,
            });
          } else {
            Object.assign(abstract, {
              'und': currentAbstract.value,
            });
          }
        }
      }
    } else {
      // straight create an object
      if (abstractArray[0].lang) {
        abstract = {
          [abstractArray[0].lang]: abstractArray[0].value,
        };
      } else {
        abstract = {
          'und': abstractArray[0].value,
        };
      }
    }

    let serverConfig = {
      protocol: 'wmts',
      version: capabilities.version,
      url: req.params.url.replace(/\?.*/g, ''),

      service: {
        title: title || {},
        abstract: abstract || {},
        keywords: {},
        accessConstraints: serviceId.accessConstraints || [],
        onlineResource: servicePr.providerSite.href,
        contactInformation: {},
        fees: serviceId.fees,
      },

      capability: {},

      layer: {
        styles: {},
        layerData: capabilities.contents.datasetDescriptionSummary,
      },
    };

    if (serviceId.keywords && serviceId.keywords !== []) {
      for (let keywordList of serviceId.keywords) {
        if (keywordList.keyword !== []) {
          for (let keyword of keywordList.keyword) {
            // if undefined, we use the und language code
            if (!keyword.lang) {
              if (!serverConfig.service.keywords[keyword.lang]) {
                serverConfig.service.keywords.und = [];
              }
              serverConfig.service.keywords.und.push(keyword.value);
            } else {
              if (!serverConfig.service.keywords[keyword.lang]) {
                serverConfig.service.keywords[keyword.lang] = [];
              }
              serverConfig.service.keywords[keyword.lang].push(keyword.value);
            }
          }
        }
      }
    }

    if (servicePr.serviceContact) {
      serverConfig.service.contactInformation.person = servicePr.serviceContact.individualName;
      serverConfig.service.contactInformation.position = servicePr.serviceContact.positionName;
      if (servicePr.serviceContact.contactInfo) {
        if (servicePr.serviceContact.contactInfo.address) {
          // If email isn't the only property in address.
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

    console.log(JSON.stringify(serverConfig));
  }).catch((err) => {
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}

export function testGetLayers(req, res) {
  getCapabilities('test', req.params.url).then((jsonCapabilities) => {
    // res.json(jsonCapabilities);
    console.log(jsonCapabilities);
    res.send();
  }).catch((err) => {
    console.log(err);
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}
