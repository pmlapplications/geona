import VisibleLayer from './visible_layer';

export class LayerWms extends VisibleLayer {
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.name = layerConfig.wms.name;
    this.styles = {};
  }
}
