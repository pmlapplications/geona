import VisibleLayer from './visible_layer';

export default class LayerWmts extends VisibleLayer {
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.name = layerConfig.wmts.name;
    this.styles = {};
  }
}
