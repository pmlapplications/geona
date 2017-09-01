import VisibleLayer from './visible_layer';

export default class LayerWms extends VisibleLayer {
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.PROTOCOL = 'wms';
    this.name = layerConfig.wms.name;
    this.styles = {};
  }
}
