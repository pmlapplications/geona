import request from 'request';

import Layer from '../../common/layer/layer';
import LayerServer from '../../common/layer/layer_server';
import LayerWms from '../../common/layer/layer_wms';
import {WMS_CONTEXT, WMTS_CONTEXT, WCS_CONTEXT, TEST_CONTEXT} from '../utils/jsonix';

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
    res.json(jsonCapabilities);

    let capabilities = jsonCapabilities.value;
    let service = capabilities.service;
    let capability = capabilities.capability;

    let serverConfig = {
      protocol: 'wms',
      version: capabilities.version,
      url: req.params.url.replace(/\?.*/g, ''),

      service: {
        title: service.title,
        abstract: service._abstract || service.abstract || '',
        keywords: [],
        onlineResource: service.onlineResource.href,
        contactInformation: {},
      },

      capability: {},
    };

    if (service.keywordList) {
      for (let keyword of service.keywordList.keyword) {
        serverConfig.service.keywords.push(keyword.value);
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
      serverConfigContactInfo.address = contactInfo.contactAddress;
      serverConfigContactInfo.phone = contactInfo.contactVoiceTelephone;
      serverConfigContactInfo.email = contactInfo.contactElectronicMailAddress;
    }

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

    console.log(JSON.stringify(serverConfig));

    // let layerServer = new LayerServer();
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
  getCapabilities('wmts', req.params.url).then((jsonCapabilities) => {
    res.json(jsonCapabilities);
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

/**
 * Download GetCapabilities and covert it to JSON from the provided url and protocol.
 * @param  {String} protocol The OGC protocol/service
 * @param  {String} url      The URL of the service
 * @return {Object}          The GetCapabilities response as a JSON object
 */
function getCapabilities(protocol, url) {
  return new Promise((resolve, reject) => {
    let cleanUrl = url.replace(/\?.*/g, '');
    let unmarshaller;

    switch (protocol) {
      case 'wms':
        cleanUrl += '?service=WMS&request=GetCapabilities';
        unmarshaller = WMS_CONTEXT.createUnmarshaller();
        break;
      case 'wmts':
        cleanUrl += '?service=WMTS&request=GetCapabilities';
        unmarshaller = WMTS_CONTEXT.createUnmarshaller();
        break;
      case 'wcs':
        cleanUrl += '?service=WCS&request=GetCapabilities';
        unmarshaller = WCS_CONTEXT.createUnmarshaller();
        break;
      case 'test':
        unmarshaller = TEST_CONTEXT.createUnmarshaller();
    }

    request(cleanUrl, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        resolve(unmarshaller.unmarshalString(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}
