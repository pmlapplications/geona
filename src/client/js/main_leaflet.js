import * as leaflet from './map_leaflet';
import Main from './main';

/**
 *
 * @param {*} config
 */
export function testInit() {
  console.log('testInit called for Leaflet');
  let lintHappy = new Main(leaflet);
}
