import GeonaMap from './map';
import {baseLayers as defaultBasemaps, borderLayers as defaultBorders} from './map_common';

let L;

/**
 * @implements {GeonaMap}
 */
export class LMap extends GeonaMap {
  /**
   * Instantiate a new LMap and create a new Leaflet map
   * @param  {Object} config The map config to load
   */
  constructor(config) {
    super();
    // TODO this is only for testing
    window.LMap = this;

    /** @type {Object} The map config */
    this.config = config;
    /** @private @type {Object} The available basemaps */
    this.baseLayers_ = {};
    /** @private @type {Object} The available country border layers */
    this.countryBorderLayers_ = {};
    /** @private @type {L.latlngGraticule} The map graticule */
    this.graticule_ = L.latlngGraticule();

    /** @private @type {L.map} The Leaflet map */
    this.map_ = L.map(this.config.divId, {
      crs: leafletizeProjection(this.config.projection),
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 13,
      zoomControl: false,
    });

    L.control.zoom({
      zoomInText: '<span class="icon-zoom-in"></span>',
      zoomOutText: '<span class="icon-zoom-out"></span>',
      position: 'topright',
    }).addTo(this.map_);

    L.control.scale({
      metric: true,
      imperial: false,
      position: 'topright',
    }).addTo(this.map_);

    // Load the default base layers and borders layers, plus any custom ones defined in the config
    this.loadBaseLayers_();
    this.loadCountryBorderLayers_();

    if (this.config.basemap !== 'none') {
      this.setBasemap(this.config.basemap);
    }
  }

  /**
   * Set the graticles as visible or not.
   * @param  {Boolean} display True to display graticles
   */
  displayGraticule(display) {
    if (display) {
      this.graticule_.addTo(this.map_);
    } else {
      this.graticule_.remove();
    }
  }

  /**
   * Set the basemap.
   * @param {String} basemap The id of the basemap to use, or 'none'
   */
  setBasemap(basemap) {
    if (this.config.basemap !== 'none') {
      this.baseLayers_[this.config.basemap].remove();
    }

    if (basemap !== 'none') {
      // TODO throw error if the provided basemap doesn't exist
      let newBasemap = this.baseLayers_[basemap];
      if (!newBasemap.options.projections.includes(deLeafletizeProjection(this.map_.options.crs))) {
        this.setProjection(newBasemap.options.projections[0]);
      }
      newBasemap.addTo(this.map_).bringToBack();
    }

    this.config.basemap = basemap;
  }

  /**
   * Set the country borders to display, or none.
   * @param {String} borders The borders to display, or 'none'
   */
  setCountryBorders(borders) {
    if (this.config.countryBorders !== 'none' && this.config.countryBorders !== borders) {
      this.countryBorderLayers_[this.config.countryBorders].remove();
    }

    if (borders !== 'none') {
      // TODO throw error if the provided borders don't exist
      let newBorders = this.countryBorderLayers_[borders];
      if (!newBorders.options.projections.includes(deLeafletizeProjection(this.map_.options.crs))) {
        this.setProjection(newBorders.options.projections[0]);
      }
      newBorders.addTo(this.map_).bringToFront();
    }

    this.config.countryBorders = borders;
  }

  /**
   * Set the projection.
   * @param {String} projection The projection to use
   */
  setProjection(projection) {
    // This is a bit of a hack and isn't officially supported by leaflet. Everything may fall over!
    let LeafletProjection = leafletizeProjection(projection);
    let center = this.map_.getCenter();
    let zoom = this.map_.getZoom();

    switch (projection) {
      case 'EPSG:3857':
        zoom += 1;
        break;
      case 'EPSG:4326':
        zoom -= 1;
        break;
    }

    this.map_.options.crs = LeafletProjection;
    this.map_._resetView(center, zoom);

    this.config.projection = projection;
  }

  /**
   * Load the default basemaps, and any defined in the config.
   * @private
   */
  loadBaseLayers_() {
    for (let layer of defaultBasemaps) {
      switch (layer.source.type) {
        case 'wms':
          this.baseLayers_[layer.id] = L.tileLayer.wms(layer.source.url, {
            layers: layer.source.params.layers,
            version: layer.source.params.version,
            attribution: layer.source.attributions,
            projections: layer.projections,
          });
          break;
      }
    }
  }

  /**
   * Load the default border layers, and any defined in the config.
   * @private
   */
  loadCountryBorderLayers_() {
    for (let layer of defaultBorders) {
      switch (layer.source.type) {
        case 'wms':
          this.countryBorderLayers_[layer.id] = L.tileLayer.wms(layer.source.url, {
            layers: layer.source.params.layers,
            version: layer.source.params.version,
            styles: layer.source.params.styles,
            format: 'image/png',
            transparent: true,
            projections: layer.projections,
          });
      }
    }
  }
}

/**
 * Adjust a provided OpenLayers style zoom level to be correct for leaflet.
 * @param  {Number} zoom       OpenLayers style zoom level
 * @param  {String} projection The projection that the zoom is for
 * @return {Number}            Leaflet style zoom level
 */
function leafletizeZoom(zoom, projection) {
  switch (projection) {
    case 'EPSG:3857':
      return zoom;
    case 'EPSG:4326':
      return zoom - 1;
    default:
      return zoom;
  }
}

/**
 * Adjust a provided Leaflet style zoom level to be correct for OpenLayers.
 * @param  {Number} zoom       Leaflet style zoom level
 * @param  {String} projection The projection that the zoom is for
 * @return {Number}            OpenLayers style zoom level
 */
function deLeafletizeZoom(zoom, projection) {
  switch (projection) {
    case 'EPSG:3857':
      return zoom;
    case 'EPSG:4326':
      return zoom + 1;
    default:
      return zoom;
  }
}

/**
 * Convert a projection string to a Leaflet CRS object
 * @param  {String} projection A projection string
 * @return {L.CRS}             A leaflet CRS object
 */
function leafletizeProjection(projection) {
  switch (projection) {
    case 'EPSG:3395':
      return L.CRS.EPSG3395;
    case 'EPSG:3857':
      return L.CRS.EPSG3857;
    case 'EPSG:4326':
      return L.CRS.EPSG4326;
    default:
      return null;
  }
}

/**
 * Convert a Leaflet CRS object into a projection string
 * @param  {L.CRS}  projection A leaflet CRS object
 * @return {String}            A projection string
 */
function deLeafletizeProjection(projection) {
  switch (projection) {
    case L.CRS.EPSG3395:
      return 'EPSG:3395';
    case L.CRS.EPSG3857:
      return 'EPSG:3857';
    case L.CRS.EPSG4326:
      return 'EPSG:4326';
    default:
      return null;
  }
}

/**
 * Load the Leaflet library and any Leaflet plugins
 * @param  {Function} next
 */
export function init(next) {
  if (L) {
    // If leaflet has already been loaded
    next();
  } else {
    let head = document.getElementsByTagName('head')[0];
    let mapJs = document.createElement('script');
    mapJs.onload = function() {
      import('leaflet')
        .then((leaflet) => {
          L = leaflet;

          // Import Leaflet plugins
          return Promise.all([
            import('../vendor/js/leaflet_latlng_graticule'),
          ]);
        })
        .then(() => {
          next();
        });
    };
    mapJs.src = 'js/vendor_leaflet.js';
    head.appendChild(mapJs);
  }
}
