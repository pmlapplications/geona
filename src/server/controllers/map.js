/** @module controllers/map */

import fs from 'fs';
import $ from 'jquery';
import LayerServer from '../../common/layer/server/layer_server';
import LayerServerWmts from '../../common/layer/server/layer_server_wmts';
import {urlToFilename} from '../../common/map';
import request from 'request';


/**
 * Render the index page
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function getCache(req, res) {
  // let cacheUri = '../../../cache/';
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
 * @param  {Object} req Contains information about the HTTP request
 *   @property {String}  req.params.url      URL for service request
 *   @property {String}  req.params.service  Explicitly-defined service type
 *   @property {Boolean} req.params.save     Whether to save the retrieved config to cache
 *   @property {Boolean} req.params.useCache Whether to retrieve from cache or to fetch from the web and overwrite
 *
 * @param  {Object} res Express response parameter
 *
 * @return {Object}     Geona LayerServer returned from the request
 */
export function getServersideLayerServer(req, res) {
  console.log(res);
  let params = resetParameterTypes([req.params.url, req.params.service, req.params.save, req.params.useCache]);
  let protocol = params[1].toLocaleLowerCase();
  getLayerServerFromCacheOrUrl(params[0], protocol, params[2], params[3])
    .then((layerServer) => {
      // res.sendFile(layerServer);
      res.json(JSON.parse(layerServer));
    })
    .catch((err) => {
      console.log(err);
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
function getLayerServerFromCacheOrUrl(url, protocol, save, useCache) {
  console.log('getLayerServerFromCacheOrUrl');
  console.log(url);
  console.log(protocol);
  console.log(save);
  console.log(useCache);
  return new Promise((resolve, reject) => {
    let cacheUri = '/local1/data/scratch/git/web-development/gp2-contribution-guide/cache/';
    let filename = urlToFilename(url) + '.json';
    let filepath = cacheUri + filename;
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
          parserUrl = 'http://127.0.0.1:7890/utils/wms/getLayers/' + encodeURIComponent(url);
          break;
        case 'wmts':
          parserUrl = 'http://127.0.0.1:7890/utils/wmts/getLayers/' + encodeURIComponent(url);
          break;
      }
      console.log('about to ajax parserUrl');
      request(parserUrl, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }
        let layerServer;
        switch (protocol) {
          case 'wms':
            layerServer = new LayerServer(JSON.parse(body));
            break;
          case 'wmts':
            layerServer = new LayerServerWmts(JSON.parse(body));
            break;
        }
        layerServer = JSON.stringify(layerServer);
        console.log('about to save');
        console.log(typeof(save));
        if (save === true) {
          console.log('abouterrr to save');
          fs.writeFileSync(filepath, layerServer, 'utf8');
          console.log('saved');
        }
        resolve(layerServer);
      });
    }
  });
}

/**
 * When parameters are passed to the server in the URL, they all get turned into strings.
 * This function will reset them to their previous form (if they were not a String before)
 * @param  {Array} parameters All the parameters to reset
 * @return {Array}            The reset parameters
 */
function resetParameterTypes(parameters) {
  // Doesn't support arrays or objects currently, so if you need them, you'll have to add them first
  let convertedParameters = [];
  for (let param of parameters) {
    // If the param is a number
    if (!isNaN(param)) {
      // If the param contains a decimal point
      if (/\./.test(param) === true) {
        convertedParameters.push(parseFloat(param));
      } else { // param is an int
        convertedParameters.push(parseInt(param));
      }
    } else if (param === 'true') {
      convertedParameters.push(true);
    } else if (param === 'false') {
      convertedParameters.push(false);
    } else {
      convertedParameters.push(param);
    }
  }
  return convertedParameters;
}


