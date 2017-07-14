import * as ol from './map_openlayers';
import Main from './main';

/**
 *
 * @param {*} config
 */
export function testInit(config) {
  console.log('testInit called for OpenLayers');
  let lintHappy = new Main(ol, config);
}

