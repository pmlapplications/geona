export default class Layer {
  constructor(layerConfig, layerServer) {
    this.PROTOCOL = null;

    this.layerServer = layerServer;

    this.title = layerConfig.title;
    this.abstract = layerConfig.abstract;
    this.contactDetails = layerConfig.contactDetails;
    this.provider = layerConfig.provider;
    this.tags = layerConfig.tags;

    this.boundingBox = layerConfig.boundingBox;
    this.projections = layerConfig.projections;

    this.isTemporal = layerConfig.isTemporal;
    this.firstTime = layerConfig.firstTime;
    this.lastTime = layerConfig.lastTime;

    this.dimensions = layerConfig.dimensions;

    if (this.layerServer) {
      this.layerServer.layers.push(this);
    }

    // this.crs = ['EPSG:4326', 'CRS:84', 'EPSG:41001', 'EPSG:27700', 'EPSG:3408',
    // 'EPSG:3409', 'EPSG:3857', 'EPSG:900913', 'EPSG:32661', 'EPSG:32761'];
  }
}
