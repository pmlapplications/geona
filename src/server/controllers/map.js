/** @module controllers/map */

import fs from 'fs';
import $ from 'jquery';
import LayerServer from '../../common/layer/server/layer_server';
import LayerServerWmts from '../../common/layer/server/layer_server_wmts';
import {urlToFilename} from '../../common/map';
import request from 'request';
import LayerWms from '../../common/layer/layer_wms';
import LayerWmts from '../../common/layer/layer_wmts';


/**
 * Checks the cache for the requested file, and returns it if found.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function getCache(req, res) {
  let cacheUri = '/local1/data/scratch/git/web-development/gp2-contribution-guide/cache/';
  let searchFile = cacheUri + req.params.url;
  fs.readFile(searchFile, 'utf8', (err) => {
    if (err !== null) {
      res.status(404).send('File not found');
    } else {
      res.sendFile(searchFile);
    }
  });
}

// eslint-disable-next-line valid-jsdoc
/**
 * Fetches LayerServers for all supported services.
 *
 * @param  {Object} req Contains information about the HTTP request.
 *   @param {String}  req.params.geonaServer The server that Geona is running on.
 *   @param {String}  req.params.url         URL for service request.
 *   @param {String}  req.params.service     Explicitly-defined service type.
 *   @param {Boolean} req.params.save        Whether to save the retrieved config to cache.
 *   @param {Boolean} req.params.useCache    Whether to retrieve from cache or to fetch from the web and overwrite.
 *
 * @param  {Object} res Express response.
 *
 * @return {Object}     Geona LayerServer returned from the request
 */
export function getServersideLayerServer(req, res) { // TODO rename whole chain to LayerServerInfo
  // The parameters will all be strings because of the URL, so reset them
  let params = resetParameterTypes(
    [
      req.params.geonaServer,
      req.params.url,
      req.params.service,
      req.params.save,
      req.params.useCache,
    ]
  );
  let protocol = params[2].toLocaleLowerCase();

  getLayerServerFromCacheOrUrl(decodeURIComponent(params[0]), params[1], protocol, params[3], params[4])
    .then((layerServerInfo) => {
      res.json(layerServerInfo);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
}

/**
 * Gets the server config from cache or from URL
 * @param  {String}  url      URL for service request
 * @param  {String}  protocol Explicitly-defined lowercase service type
 * @param  {Boolean} save     Whether to save the retrieved config to cache
 * @param  {Boolean} useCache Whether to retrieve from cache or to fetch from the web and overwrite
 * @return {Array}            List of layers found from the request
 */
export function getLayerServerFromCacheOrUrl(geonaServer, url, protocol, save, useCache) {
  return new Promise((resolve, reject) => {
    let cacheUri = '/local1/data/scratch/git/web-development/gp2-contribution-guide/cache/';
    let filename = urlToFilename(url);
    let filepath = cacheUri + filename + '.json';
    if (useCache === true) {
      // Retrieve information from cache - will resolve/reject immediately (synchronously)
      try {
        resolve(fs.readFileSync(filepath, 'utf8'));
      } catch (err) {
        reject(err);
      }
    } else {
      // Retrieve information from web server and update cache
      let parserUrl;
      // TODO add remaining protocols
      switch (protocol) {
        case 'wms':
          parserUrl = geonaServer + '/utils/wms/getLayers/' + encodeURIComponent(url);
          break;
        case 'wmts':
          parserUrl = geonaServer + '/utils/wmts/getLayers/' + encodeURIComponent(url);
          break;
        default:
          throw new Error('protocol ' + protocol + ' is not a supported protocol.');
      }
      try {
        request(parserUrl, (err, response, body) => {
          if (err) {
            reject(err);
            return;
          }
          let layerServer;
          let layers = [];
          switch (protocol) {
            case 'wms': {
              let serverInfo = JSON.parse(body);
              layerServer = new LayerServer(serverInfo, filename);
              for (let layer of serverInfo.layers) {
                layers.push(new LayerWms(geonaServer, layer, layerServer));
              }
              break;
            }
            case 'wmts': {
              let serverInfo = JSON.parse(body);
              layerServer = new LayerServerWmts(JSON.parse(body), filename);
              for (let layer of serverInfo.layers) {
                layers.push(new LayerWmts(layer, layerServer));
              }
              break;
            }
          }

          let layerServerInfo = {
            layerServer: layerServer,
            layers: layers,
          };

          layerServerInfo = JSON.stringify(layerServerInfo);

          if (save === true) {
            fs.writeFileSync(filepath, layerServerInfo, 'utf8');
          }
          resolve(layerServerInfo);
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
}

/**
 * When parameters are passed to the server in the URL, they all get turned into strings.
 * This function will reset them to their previous form (if they were not a String before)
 * @param  {Array} parameters All the parameters to reset
 * @return {Array}            The reset parameters
 */
export function resetParameterTypes(parameters) {
  // Doesn't support arrays or objects currently, so if you need them, you'll have to add them first
  let convertedParameters = [];
  for (let param of parameters) {
    // If the param is a number
    if (!isNaN(param)) {
      // If the param contains a decimal point or the word 'Infinity'
      if (/\.|Infinity/.test(param) === true) {
        convertedParameters.push(parseFloat(param));
      } else { // Param is an int
        convertedParameters.push(parseInt(param, 10));
      }
    } else if (param === 'true') {
      convertedParameters.push(true);
    } else if (param === 'false') {
      convertedParameters.push(false);
    } else if (param === 'undefined') {
      convertedParameters.push(undefined);
    } else if (param === 'null') {
      convertedParameters.push(null);
    } else {
      convertedParameters.push(param);
    }
  }
  return convertedParameters;
}


