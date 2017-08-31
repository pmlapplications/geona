import request from 'request';

import Layer from '../../common/layer/layer';
import LayerServer from '../../common/layer/layer_server';
import LayerWms from '../../common/layer/layer_wms';
import {wmsContext, wmtsContext, wcsContext} from '../utils/jsonix';

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
    let service = jsonCapabilities.service;
    let capability = jsonCapabilities.capability;

    let serverConfig = {
      protocol: 'wms',
      version: capabilities.version,
      url: req.params.url.replace(/\?.*/g, ''),

      service: {
        title: service.title,
        abstract: service._abstract || '',
        keywords: [],
        onlineResource: service.onlineResource.href,
        contactInformation: {},
      },

      capability: {
        getMap: {
          formats: capabilities.capability.getMap.format,
        },
        getFeatureInfo: {
          formats: capabilities.capability.getFeatureInfoo.format,
        },
      },
    };

    if (service.keywordList) {
      for (let keyword of service.keywordList.keyword) {
        serverConfig.service.keywords.push(keyword.value);
      }
    }

    if (service.contactInformation) {
      let contactInfo = service.contactInformation;
      serverConfig.service.contactInformation = {
        person: contactInfo.contactPersonPrimary ? contactInfo.contactPersonPrimary.contactPerson : undefined,
        organization: contactInfo.contactPersonPrimary ? contactInfo.contactPersonPrimary.contactOrganisation :
          undefined,
        phone: contactInfo.contactVoiceTelephone,
        email: contactInfo.contactElectronicMailAddress,
      };
    }

    console.log(serverConfig);

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
        unmarshaller = wmsContext.createUnmarshaller();
        break;
      case 'wmts':
        cleanUrl += '?service=WMTS&request=GetCapabilities';
        unmarshaller = wmtsContext.createUnmarshaller();
        break;
      case 'wcs':
        cleanUrl += '?service=WCS&request=GetCapabilities';
        unmarshaller = wcsContext.createUnmarshaller();
        break;
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
