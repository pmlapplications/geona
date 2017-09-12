import request from 'request';

import {WMS_CONTEXT, WMTS_CONTEXT, WCS_CONTEXT, TEST_CONTEXT} from '../jsonix';

/**
 * Download GetCapabilities and covert it to JSON from the provided url and protocol.
 * @param  {String} protocol The OGC protocol/service
 * @param  {String} url      The URL of the service
 * @return {Object}          The GetCapabilities response as a JSON object
 */
export function getCapabilities(protocol, url) {
  return new Promise((resolve, reject) => {
    let cleanUrl = url.replace(/\?.*/g, '');

    switch (protocol) {
      case 'wms':
        cleanUrl += '?service=WMS&request=GetCapabilities';
        break;
      case 'wmts':
        cleanUrl += '?service=WMTS&request=GetCapabilities';
        break;
      case 'wcs':
        cleanUrl += '?service=WCS&request=GetCapabilities';
        break;
    }

    request(cleanUrl, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
}

export function jsonifyCapabilities(protocol, xml) {
  let unmarshaller;

  switch (protocol) {
    case 'wms':
      unmarshaller = WMS_CONTEXT.createUnmarshaller();
      break;
    case 'wmts':
      unmarshaller = WMTS_CONTEXT.createUnmarshaller();
      break;
    case 'wcs':
      unmarshaller = WCS_CONTEXT.createUnmarshaller();
      break;
    case 'test':
      unmarshaller = TEST_CONTEXT.createUnmarshaller();
  }

  let jsonCapabilities;
  try {
    jsonCapabilities = {json: unmarshaller.unmarshalString(xml)};
  } catch (err) {
    jsonCapabilities = {err: err};
  }
  return jsonCapabilities;
}
