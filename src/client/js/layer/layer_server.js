export class LayerServer {
  constructor(serverConfig) {
    this.layers = [];

    this.serviceType = serverConfig.serviceType;
    this.url = serverConfig.url;
    this.contactDetails = serverConfig.contactDetails;
    this.tags = serverConfig.tags;
  }
}
