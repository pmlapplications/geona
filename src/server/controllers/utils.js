/** @module controllers/utils */

import {getCapabilities, jsonifyCapabilities, getMetadata} from '../utils/ogc/common';
import {parseWmsCapabilities} from '../utils/ogc/wms_capabilities_parser';
import {parseWmtsCapabilities} from '../utils/ogc/wmts_capabilities_parser';
import {parseWcsCapabilities} from '../utils/ogc/wcs_capabilities_parser';
import {parseWfsCapabilities} from '../utils/ogc/wfs_capabilities_parser';
import {rotate} from '../utils/rotation';

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
 * Get the available layer metadata details from a wms server.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function wmsGetMetadata(req, res) {
  getMetadata('wms', req.params.url, req.params.layerIdentifier)
    .then((jsonMetadata) => {
      res.send(jsonMetadata);
    }).catch((err) => {
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

/**
 * Gets a rotated image based on an image URL.
 * @param {Object} req Express request.
 * @param {Object} res Express response.
 */
export function rotateImageFromUrl(req, res) {
  // todo proxy whitelist - if not on the whitelist respond with a 401 error
  rotate(req.params.url, parseFloat(req.params.angle))
    .then((rotatedImage) => {
      res.send(rotatedImage);
    }).catch((err) => {
      // if it's the angle being invalid say that, otherwise just pass generic 404 error
    });
}
