/** @module controllers/utils */

import {getCapabilities, jsonifyCapabilities} from '../utils/ogc/common';
import {parseWmsCapabilities} from '../utils/ogc/wms_capabilities_parser';
import {parseWmtsCapabilities} from '../utils/ogc/wmts_capabilities_parser';
import {parseWcsCapabilities} from '../utils/ogc/wcs_capabilities_parser';
import {parseWfsCapabilities} from '../utils/ogc/wfs_capabilities_parser';

/**
 * Get the available data layers and server details from a wcs server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wcsGetLayers(req, res) {
  // getCapabilities('wcs', req.params.url)
  //   .then((jsonCapabilities) => {
  //     res.json(jsonifyCapabilities('wcs', jsonCapabilities));
  //   }).catch((err) => {
  //     res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
  //   });
  parseWcsCapabilities(req.params.url)
    .then((layer) => {
      res.json(layer);
    // console.log(JSON.stringify(layer));
    }).catch((err) => {
      console.log(err);
      res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
    });
}

/**
 * Get the available data layers and server details from a wcs server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wfsGetLayers(req, res) {
  // getCapabilities('wfs', req.params.url)
  //   .then((jsonCapabilities) => {
  //     res.json(jsonifyCapabilities('wfs', jsonCapabilities));
  //   }).catch((err) => {
  //     res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
  //   });
  parseWfsCapabilities(req.params.url)
    .then((layer) => {
      res.json(layer);
    // console.log(JSON.stringify(layer));
    }).catch((err) => {
      console.log(err);
      res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
    });
}

/**
 * Get the available layers and server details from a wms server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wmsGetLayers(req, res) {
  // getCapabilities('wms', req.params.url)
  //   .then((jsonCapabilities) => {
  //     res.json(jsonifyCapabilities('wms', jsonCapabilities));
  //   }).catch((err) => {
  //     res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
  //   });
  parseWmsCapabilities(req.params.url)
    .then((layer) => {
      res.json(layer);
      // console.log(JSON.stringify(layer));
    }).catch((err) => {
      console.log(err);
      res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
    });
}

/**
 * Get the available layers and server details from a wmts server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wmtsGetLayers(req, res) {
  // getCapabilities('wmts', req.params.url).then((jsonCapabilities) => {
  //   res.json(jsonifyCapabilities('wmts', jsonCapabilities));
  //   console.log(JSON.stringify(jsonCapabilities));
  // });

  parseWmtsCapabilities(req.params.url)
    .then((layer) => {
      res.json(layer);
      // console.log(JSON.stringify(layer));
    }).catch((err) => {
      res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
    });
}

/**
 * Get the available data layers and server details from a sos server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function sosGetLayers(req, res) {
  getCapabilities('sos', req.params.url)
    .then((jsonCapabilities) => {
      res.json(jsonifyCapabilities('sos', jsonCapabilities));
    }).catch((err) => {
      res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
    });
  // parseWcsCapabilities(req.params.url)
  //   .then((layer) => {
  //     res.json(layer);
  //   // console.log(JSON.stringify(layer));
  //   }).catch((err) => {
  //     console.log(err);
  //     res.status(500).json({error: 'Error processing XML: ' + err.message + ' ' + err.stack});
  //   });
}
