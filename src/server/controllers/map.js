/** @module controllers/map */

import fs from 'fs';
import $ from 'jquery';
import LayerServer from '../../common/layer/server/layer_server';
import LayerServerWmts from '../../common/layer/server/layer_server_wmts';
import {urlToFilename} from '../../common/map';
import {urlInCache} from '../../client/js/map_common';
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


/**
 * Fetches layers for all supported services.
 * @param  {String}  url        URL for service request
 * @param  {String}  service    Explicitly-defined service type
 * @param  {Boolean} save       Whether to save the retrieved config to cache
 * @param  {Boolean} [useCache] Whether to retrieve from cache or to fetch from the web and overwrite
 * @return {Array}              List of layers found from the request
 */
export function getServersideLayerServer(req, res) {
  console.log('getServersideLayerServer');
  let protocol = req.params.service.toLocaleLowerCase();
  getLayerServerFromCacheOrUrl(req.params.url, protocol, req.params.save, req.params.useCache)
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
      // Retrieve information from cache - will resolve/reject immediately
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
      // $.ajax(parserUrl)
      //   .done((getCapabilitiesJson) => {
      //     console.log('done ajax');
      //     // Create the appropriate LayerServer
      //     let layerServer;
      //     switch (protocol) {
      //       case 'wms':
      //         layerServer = new LayerServer(getCapabilitiesJson);
      //         break;
      //       case 'wmts':
      //         layerServer = new LayerServerWmts(getCapabilitiesJson);
      //         break;
      //     }
      //     layerServer = JSON.stringify(layerServer);
      //     console.log('about to save');
      //     if (save === true) {
      //       fs.writeFileSync(filepath, layerServer, 'utf8');
      //       console.log('saved');
      //     }
      //     resolve(layerServer);
      //   })
      //   .fail((err) => {
      //     console.log('fail ajax');
      //     reject(err);
      //   });
      request(parserUrl, (err, response, body) => {
        // console.log(err);
        // console.log(response);
        console.log(body);
        if (err) {
          reject(err);
          return;
        }
        // fs.writeFileSync(filepath, body, 'utf8');
        let layerServer;
        switch (protocol) {
          case 'wms':
            layerServer = new LayerServer(JSON.parse(body));
            break;
          case 'wmts':
            layerServer = new LayerServerWmts(body);
            break;
        }
        layerServer = JSON.stringify(layerServer);
        console.log('about to save');
        if (save === true) {
          // fs.writeFileSync(filepath, layerServer, 'utf8');
          console.log('saved');
        }
        resolve(layerServer);
        // resolve(body);
      });
    }
  });
}


