import LayerServer from './layer_server';

/**
 * Class for an OWS layer server
 * @extends {LayerServer}
 */
export default class LayerServerOws extends LayerServer {
  /**
   * Instantiate a new LayerServerOws
   * @param  {Object} serverConfig The server config. See the class diagram.
   */
  constructor(serverConfig) {
    super(serverConfig);

    this.operationsMetadata = serverConfig.operationsMetadata;
  }
}
