/** @module layer/server/layer_server */

/**
 * Class for a layer server
 */
export default class LayerServer {
  /**
   * Instantiate a new LayerServer
   * @param {Object} serverConfig    The config to instantiate the server with. See class diagram for possible options.
   * @param {String} identifier      String to use as the unique id for this LayerServer.
   */
  constructor(serverConfig, identifier) {
    this.identifier = identifier;

    this.protocol = serverConfig.protocol;
    this.version = serverConfig.version;
    this.url = serverConfig.url;

    this.service = serverConfig.service;

    this.capability = serverConfig.capability;

    this.tags = serverConfig.tags;
  }
}
