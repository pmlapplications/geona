/** @module controllers/utils */

import {getCapabilities} from '../utils/ogc/common';
import {parseWmsCapabilities} from '../utils/ogc/wms_capabilities_parser';
import {parseWmtsCapabilities} from '../utils/ogc/wmts_capabilities_parser';

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
  // getCapabilities('wms', req.params.url).then((jsonCapabilities) => {
  // res.json(jsonCapabilities);
  // return parseWmsCapabilities(req.params.url);
  // })
  parseWmsCapabilities(req.params.url).then((layer) => {
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
    console.log(JSON.stringify(jsonCapabilities));
    return parseWmtsCapabilities(req.params.url);
  }).then((layer) => {
    res.json(layer);
    // console.log(JSON.stringify(layer));
  }).catch((err) => {
    res.status(500).json({error: 'Error processing XML: ' + err.message});
  });
}
