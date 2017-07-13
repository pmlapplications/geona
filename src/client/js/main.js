import {loadConfig} from './config';

/**
 * class Main
 */
export default class Main {

  /**
   * Constructor for class Main
   * @param {*} map
   */
  constructor(map, config) {
    loadConfig(() => {
      map.createMap(config);
    });
  }
}
