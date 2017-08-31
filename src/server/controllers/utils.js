import request from 'request';

import {wmsContext, wmtsContext, wcsContext} from '../utils/jsonix';

export function wcsGetLayers(req, res) {
  getCapabilities('wcs', req.params.url).then((jsonCapabilities) => {
    res.json(jsonCapabilities);
  }).catch((err) => {
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}

export function wmsGetLayers(req, res) {
  getCapabilities('wms', req.params.url).then((jsonCapabilities) => {
    res.json(jsonCapabilities);
  }).catch((err) => {
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}

export function wmtsGetLayers(req, res) {
  getCapabilities('wmts', req.params.url).then((jsonCapabilities) => {
    res.json(jsonCapabilities);
  }).catch((err) => {
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}

function getCapabilities(protocol, url) {
  return new Promise((resolve, reject) => {
    let cleanUrl = url.replace(/\?.*/g, '') + '?';
    let unmarshaller;

    switch (protocol) {
      case 'wms':
        cleanUrl += 'service=WMS&request=GetCapabilities';
        unmarshaller = wmsContext.createUnmarshaller();
        break;
      case 'wmts':
        cleanUrl += 'service=WMTS&request=GetCapabilities';
        unmarshaller = wmtsContext.createUnmarshaller();
        break;
      case 'wcs':
        cleanUrl += 'service=WCS&request=GetCapabilities';
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
