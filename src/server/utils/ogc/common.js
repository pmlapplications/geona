/** @module utils/ogc/common */

import request from 'request';

import {WMS_CONTEXT, WMTS_CONTEXT, WCS_CONTEXT, TEST_CONTEXT} from '../jsonix';

/**
 * Download the GetCapabilities XML for the provided protocol from the provided url.
 * @param  {String}  protocol The OGC protocol/service type
 * @param  {String}  url      The URL of the service
 * @return {Promise}          A promise that resolves with the GetCapabilities XML
 */
export function getCapabilities(protocol, url) {
  return new Promise((resolve, reject) => {
    // If a version is specified in the URL, it will be added onto the clean URL.
    let version = '&' + url.match(/version=.*?(?=[&\s])|version=.*/);
    let cleanUrl = url.replace(/\?.*/g, '');

    switch (protocol) {
      case 'wms':
        cleanUrl += '?service=WMS&request=GetCapabilities' + version;
        break;
      case 'wmts':
        cleanUrl += '?service=WMTS&request=GetCapabilities' + version;
        break;
      case 'wcs':
        cleanUrl += '?service=WCS&request=GetCapabilities' + version;
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

/**
 * Convert a GetCapabilities XML into a JSON object.
 * @param  {String} protocol The OGC protocol/service type
 * @param  {String} xml      The XML document as a String
 * @return {Object}          The capabilities as a JSON object
 *
 * @throws Throws any error thrown by unmarshaller.unmarshalString
 */
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
    jsonCapabilities = unmarshaller.unmarshalString(xml);
  } catch (err) {
    throw err;
  }
  return jsonCapabilities;
}
