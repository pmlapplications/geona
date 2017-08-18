export class GeonaLayer {
  /**
   * 
   * @param {Object} layerInformation 
   * @param {Object} serverInformation 
   */
  constructor(layerInformation, serverInformation) {
    console.log(layerInformation);
    console.log(serverInformation);
    console.log(layerInformation.Name);
    this.name = layerInformation.Name;
    this.title = layerInformation.Title;
    this.abstract = layerInformation.Abstract;
    this.firstDate = layerInformation.FirstDate;
    this.lastDate = layerInformation.LastDate;
    this.boundingBox = {
      east: layerInformation.EX_GeographicBoundingBox.EastBoundLongitude,
      north: layerInformation.EX_GeographicBoundingBox.NorthBoundLatitude,
      south: layerInformation.EX_GeographicBoundingBox.SouthBoundLatitude,
      west: layerInformation.EX_GeographicBoundingBox.WestBoundLongitude,
    };
    // TODO update to get real CRS codes when we actually make requests to THREDDS
    this.crs = ['EPSG:4326', 'CRS:84', 'EPSG:41001', 'EPSG:27700', 'EPSG:3408', 'EPSG:3409', 'EPSG:3857', 'EPSG:900913', 'EPSG:32661', 'EPSG:32761'];
    this.serviceUrl = serverInformation.serviceURL || serverInformation.wmsURL;
    this.serviceType = serverInformation.serviceType || 'wms';
  }
}
