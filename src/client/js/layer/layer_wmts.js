import VisibleLayer from './visible_layer';

export class LayerWmts extends VisibleLayer {
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.name = layerConfig.wmts.name;
    this.styles = {};
  }
}
