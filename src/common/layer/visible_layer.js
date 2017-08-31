import Layer from './layer';

export default class VisibleLayer extends Layer {
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.viewSettings = layerConfig.viewSettings;
  }
}
