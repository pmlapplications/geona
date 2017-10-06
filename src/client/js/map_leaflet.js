/** @module  map_leaflet */

import GeonaMap from './map';
import {
  basemaps as defaultBasemaps, borderLayers as defaultBorders, latLonLabelFormatter,
  addLayerDefaults, selectPropertyLanguage,
} from './map_common';
import CCI5DAY from './rsg.pml.ac.uk-thredds-wms-CCI_ALL-v3.0-5DAY';

let L;

/**
 * Class for a Leaflet map.
 *
 * @implements {GeonaMap}
 */
export class LMap extends GeonaMap {
  /**
   * Instantiate a new LMap and create a new Leaflet map.
   * @param  {Object} config The map config to load
   * @param {HTMLElement} mapDiv The div to put the map in
   */
  constructor(config, mapDiv) {
    super();
    /** @type {Object} The map config */
    this.config = config;
    /**  @type {Object} The available basemaps */
    this._basemaps = {};
    /**  @type {Object} The available country border layers */
    this._countryBorderLayers = {};
    /**  @type {Object} The available data layers */
    this._availableLayers = {};
    /**  @type {L.featureGroup} The layers on the map */
    // TODO try putting '{attribution: 'Geona'} in the featureGroup initially
    this._mapLayers = L.featureGroup();
    this._geonaLayers = [];
    /**  @type {L.latlngGraticule} The map graticule */
    this._graticule = L.latlngGraticule({
      showLabel: true,
      color: '#ccc',
      fontColor: '#ccc',
      opacity: 1,
      weight: 1,
      lineDash: [2, 3],
      zoomInterval: [
        {start: 2, end: 2, interval: 20},
        {start: 3, end: 3, interval: 10},
        {start: 4, end: 4, interval: 5},
        {start: 5, end: 5, interval: 2},
        {start: 6, end: 6, interval: 1},
        {start: 7, end: 7, interval: 0.5},
        {start: 8, end: 8, interval: 0.2},
        {start: 9, end: 9, interval: 0.1},
        {start: 10, end: 20, interval: 0.05},
      ],
      latFormatTickLabel: function(latitude) {
        return latLonLabelFormatter(latitude, 'N', 'S');
      },
      lngFormatTickLabel: function(longitude) {
        return latLonLabelFormatter(longitude, 'E', 'W');
      },
    });

    // TODO sort these when finished
    /** @type {Boolean} Whether the map currently has a basemap */
    this._basemap = false;
    /** @type {Boolean} Whether the map currently has country borders */
    this._borders = false;

    /**  @type {L.map} The Leaflet map */
    this._map = L.map(mapDiv, {
      crs: leafletizeProjection(this.config.projection),
      center: [this.config.viewSettings.center.lat, this.config.viewSettings.center.lon],
      maxBounds: [
        [this.config.viewSettings.maxExtent.minLat, this.config.viewSettings.maxExtent.minLon],
        [this.config.viewSettings.maxExtent.maxLat, this.config.viewSettings.maxExtent.maxLon],
      ],
      maxZoom: leafletizeZoom(this.config.viewSettings.maxZoom, leafletizeProjection(this.config.projection)),
      minZoom: leafletizeZoom(this.config.viewSettings.minZoom, leafletizeProjection(this.config.projection)),
      zoom: leafletizeZoom(this.config.viewSettings.zoom, leafletizeProjection(this.config.projection)),
      zoomControl: false,
    });

    L.control.zoom({
      zoomInText: '<span class="icon-zoom-in"></span>',
      zoomOutText: '<span class="icon-zoom-out"></span>',
      position: 'topright',
    }).addTo(this._map);

    L.control.scale({
      metric: true,
      imperial: false,
      position: 'topright',
    }).addTo(this._map);

    this._mapLayers.addTo(this._map);


    // Load the default basemaps and borders layers, plus any custom ones defined in the config
    this._loadBasemaps();
    this._loadCountryBorderLayers();

    this.loadConfig_();

    this._basemaps.gebco_08_grid.addTo(this._map);
    this._mapLayers.addLayer(this._basemaps.gebco_08_grid);
    this._countryBorderLayers.line_black.addTo(this._map);
    this._mapLayers.addLayer(this._countryBorderLayers.line_black);
  }

  /**
   * Set the graticule as visible or not.
   * @param  {Boolean} display True to display graticule
   */
  displayGraticule(display) {
    if (display) {
      this._graticule.addTo(this._map);
    } else {
      this._graticule.remove();
    }
  }

  /**
   * Clears the basemap if it exists and changes the projection if required.
   * @param {L.tileLayer.wms} layer The layer created in addLayer()
   */
  _clearBasemap(layer) {
    // if (this.config.basemap !== 'none') {
    //   this._basemaps[this.config.basemap].remove();
    // }

    // if (basemap !== 'none') {
    //   // TODO throw error if the provided basemap doesn't exist
    //   let newBasemap = this._basemaps[basemap];
    //   let viewSettings = newBasemap.options.viewSettings;
    //   console.log('setBasemap');
    //   console.log(viewSettings);
    //   if (!newBasemap.options.projections.includes(deLeafletizeProjection(this._map.options.crs))) {
    //     viewSettings.projection = newBasemap.options.projections[0];
    //   }
    //   console.log(viewSettings);
    //   this.setView(viewSettings);

    //   newBasemap.addTo(this._map).bringToBack();
    // }

    // this.config.basemap = basemap;
    // this._geonaLayers.push();
    if (this._basemap === true) {
      // Leaflet doesn't track the ordering of layers...?
      console.log(this._mapLayers.getLayers());
      this._mapLayers.eachLayer((currentLayer) => {
        if (currentLayer.modifier === 'basemap') {
          currentLayer.remove();
        }
      });
    }
    if (this._map.options._crs !== layer.crs) {
      this.setProjection(deLeafletizeProjection(layer.crs));
    }
  }

  /**
   * Clears the country borders if active.
   */
  _clearBorders() {
    if (this._borders === true) {
      this._mapLayers.eachLayer((currentLayer) => {
        if (currentLayer.modifier === 'borders') {
          currentLayer.remove();
        }
      });
    }
  }

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String} projection The projection to use, such as 'EPSG:4326'
   */
  setProjection(projection) {
    // TODO check the basemap supports the projection.
    // This is a bit of a hack and isn't officially supported by Leaflet. Everything may fall over!
    let leafletProjection = leafletizeProjection(projection);

    if (this._map.options.crs !== leafletProjection) {
      // If the map isn't already in the provided projection
      let center = this._map.getCenter();
      let zoom = this._map.getZoom();
      let maxZoom = this._map.getMaxZoom();
      let minZoom = this._map.getMinZoom();

      switch (projection) {
        case 'EPSG:3857':
          zoom += 1;
          maxZoom += 1;
          minZoom += 1;
          break;
        case 'EPSG:4326':
          zoom -= 1;
          maxZoom -= 1;
          minZoom -= 1;
          break;
      }

      this._map.options.crs = leafletProjection;
      this._map._resetView(center, zoom);

      this._map.setMaxZoom(maxZoom);
      this._map.setMinZoom(minZoom);

      this.config.projection = projection;

      console.log(this._map);
      // TODO hopefully this won't infinite loop because you're adding a new layer each time
      this._map.eachLayer((layer) => {
        if (layer._crs !== undefined) {
          layer.remove();
          this._mapLayers.removeLayer(layer);
          // We add the same layer, but now the map projection will have changed.
          // eslint-disable-next-line new-cap
          let newLayer = new L.tileLayer.wms(layer._url, {
            layers: layer.options.layers,
            format: layer.wmsParams.format,
            transparent: layer.options.transparent,
            attribution: layer.options.attribution,
            version: layer.options.version,
            zIndex: layer.options.zIndex,
            modifier: layer.options.modifier,
          }).addTo(this._map);
          this._mapLayers.addLayer(newLayer);
        }
      });
    }
  }

  /**
   * Set the map view with the provided options. Uses OpenLayers style zoom levels.
   * @param {Object}  options            View options. All are optional
   * @param {Object}  options.center     The centre as {lat: <Number>, lon: <Number>}
   * @param {Object}  options.fitExtent  Extent to fit the view to, defined as
   *                                     {minLat: <Number>, minLon: <Number>, maxLat: <Number>, maxLon: <Number>}
   * @param {Object}  options.maxExtent  Extent to restrict the view to, defined as
   *                                     {minLat: <Number>, minLon: <Number>, maxLat: <Number>, maxLon: <Number>}
   * @param {Number}  options.maxZoom    The maximum allowed zoom
   * @param {Number}  options.minZoom    The minimum allowed zoom
   * @param {String}  options.projection The projection, such as 'EPSG:4326'
   * @param {Number}  options.zoom       The zoom
   */
  setView(options) {
    if (options.projection) {
      this.setProjection(options.projection);
      this.config.projection = options.projection;
    }

    if (options.maxExtent) {
      this._map.setMaxBounds([
        [options.maxExtent.minLat, options.maxExtent.minLon],
        [options.maxExtent.maxLat, options.maxExtent.maxLon],
      ]);
      // this._map.setMaxBounds([options.maxExtent.slice(0, 2), options.maxExtent.slice(2, 4)]);
      this.config.viewSettings.maxExtent = options.maxExtent;
    }

    console.log(options);
    if (options.center) {
      this._map.panTo([options.center.lat, options.center.lon]);
      // this._map.panTo(options.center);
      this.config.viewSettings.center = options.center;
    }

    if (options.maxZoom || options.minZoom || options.zoom) {
      let projection = leafletizeProjection(options.projection) || this._map.options.crs;

      if (options.maxZoom) {
        this._map.setMaxZoom(leafletizeZoom(options.maxZoom, projection));
        this.config.viewSettings.maxZoom = options.maxZoom;
      }
      if (options.minZoom) {
        this._map.setMinZoom(leafletizeZoom(options.minZoom, projection));
        this.config.viewSettings.minZoom = options.minZoom;
      }
      if (options.zoom) {
        this._map.setZoom(leafletizeZoom(options.zoom, projection));
        this.config.viewSettings.zoom = options.zoom;
      }
    }

    if (options.fitExtent) {
      this._map.setMaxBounds([
        [options.fitExtent.minLat, options.fitExtent.minLon],
        [options.fitExtent.maxLat, options.fitExtent.maxLon],
      ]);
      // this._map.fitBounds([options.fitExtent.slice(0, 2), options.fitExtent.slice(2, 4)]);
      this.config.viewSettings.fitExtent = options.fitExtent;
    }
  }

  /**
   * Set the map view with the provided options. The same as setView, but uses Leaflet style zoom levels and projection.
   * @param {Object}  options            View options. All are optional
   * @param {Array}   options.center     The centre as [lat, lon]
   * @param {Array}   options.fitExtent  Extent to fit the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Array}   options.maxExtent  Extent to restrict the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Number}  options.maxZoom    The maximum allowed zoom
   * @param {Number}  options.minZoom    The minimum allowed zoom
   * @param {L.CRS}   options.projection The projection
   * @param {Number}  options.zoom       The zoom
   */
  _setView(options) {
    if (options.projection) {
      // options.projection = leafletizeProjection(options.projection);
      options.projection = deLeafletizeProjection(options.projection);
    }

    if (options.maxZoom || options.minZoom || options.zoom) {
      let projection = options.projection || this._map.options.crs;

      if (options.maxZoom) {
        options.maxZoom = deLeafletizeZoom(options.maxZoom, projection);
      }
      if (options.minZoom) {
        options.minZoom = deLeafletizeZoom(options.minZoom, projection);
      }
      if (options.zoom) {
        options.zoom = deLeafletizeZoom(options.zoom, projection);
      }
    }

    this.setView(options);
  }

  /**
   * Create a Leaflet map layer from a Geona layer definition, and add to the map.
   * @param {Layer}   geonaLayer A Layer as defined by Geona, by parsing the GetCapabilities request from a server.
   * @param {String}  [modifier] An optional String used to indicate that a layer is 'basemap' or 'borders'
   * @param {Integer} [index]    The optional one-based index to insert the layer at on the map.
   */
  addLayer(geonaLayer, modifier, index = undefined) {
    // If a layer is a basemap we might change the projection
    // anyway, so it doesn't matter if the layer supports the current projection
    if (geonaLayer.projections.includes(deLeafletizeProjection(this._map.options.crs)) || modifier === 'basemap') {
      let layer;
      let title;
      let time;
      let zIndex = index;
      switch (geonaLayer.PROTOCOL) {
        case 'wms':
          title = geonaLayer.title.und;
          if (geonaLayer.isTemporal === true) {
            // Change to be the closest time previous to the current layers' times
            // i.e. if (currently a temporal layer on the map) {...} else {set to lastTime}
            time = geonaLayer.lastTime;
          }
          // eslint-disable-next-line new-cap
          layer = new L.tileLayer.wms(geonaLayer.layerServer.url, {
            layers: geonaLayer.name,
            format: 'image/png',
            transparent: true,
            attribution: geonaLayer.attribution,
            version: geonaLayer.layerServer.version,
          });
          console.log('layer.format: ' + layer.format);
          if (modifier !== undefined) {
            layer.modifier = modifier;
          }
          break;
        case 'wmts':
          alert('WMTS not currently supported for Leaflet');
          // title = selectPropertyLanguage(geonaLayer.title);
          // layer = createWmtsTileLayer(geonaLayer, deLeafletizeProjection(this._map.options.crs));
          break;
      }
      if (layer.modifier === 'basemap') {
        this._clearBasemap(layer);
        zIndex = 1;
      } else if (layer.modifier === 'borders') {
        this._clearBorders(layer);
        zIndex = this._mapLayers.getLayers().length;
      }

      layer.addTo(this._map);
      this._mapLayers.addLayer(layer);

      if (layer.modifier === 'basemap') {
        layer.bringToBack();
      } else if (layer.modifier === 'borders') {
        layer.bringToFront();
      }

      this._geonaLayers.push(geonaLayer);
    } else {
      alert('Cannot use this projection for this layer');
    }
    // var url = "http://wxs.ign.fr/" + ignKey + "/geoportail/wmts";

    // var ign = new L.TileLayer.WMTS(url,
    //   {
    //     layer: layerIGNScanStd,
    //     style: "normal",
    //     tilematrixSet: "PM",
    //     format: "image/jpeg",
    //     attribution: "<a href='https://github.com/mylen/leaflet.TileLayer.WMTS'>GitHub</a>&copy; <a href='http://www.ign.fr'>IGN</a>"
    //   }
    // );
  }

  /**
 * Load the data layers defined in the config
 */
  _loadLayers() {
    for (let addedLayer of this.config.layers) {
      addedLayer = addLayerDefaults(addedLayer);

      let layerData;
      for (let serverLayer of CCI5DAY.server.Layers) {
        if (serverLayer.Name === addedLayer.id) {
          layerData = serverLayer;
        }
      }

      // let tile;
      switch (addedLayer.source.type) {
        case 'wms':
          this._availableLayers[addedLayer.id] = L.tileLayer.wms(addedLayer.source.url, {
            layers: addedLayer.source.params.layers,
            version: addedLayer.source.params.version,
            attribution: addedLayer.source.attributions,
            projections: addedLayer.projections,
            viewSettings: addedLayer.viewSettings,
            layerData: layerData,
          });
          break;
        case 'wmts':
          console.error('WMTS not yet supported (TODO)');
          break;
      }
    }
  }

  /**
 * Load the default basemaps, and any defined in the config.
 */
  _loadBasemaps() {
    // TODO load from config too
    for (let layer of defaultBasemaps) {
      switch (layer.source.type) {
        case 'wms':
          this._basemaps[layer.id] = L.tileLayer.wms(layer.source.url, {
            layers: layer.source.params.layers,
            version: layer.source.params.version,
            attribution: layer.source.attributions,
            projections: layer.projections,
            viewSettings: layer.viewSettings,
            modifier: 'basemap',
          });
          break;
      }
    }
  }

  /**
 * Load the default border layers, and any defined in the config.
 */
  _loadCountryBorderLayers() {
    // TODO load from config too
    for (let layer of defaultBorders) {
      switch (layer.source.type) {
        case 'wms':
          this._countryBorderLayers[layer.id] = L.tileLayer.wms(layer.source.url, {
            layers: layer.source.params.layers,
            version: layer.source.params.version,
            styles: layer.source.params.styles,
            format: 'image/png',
            transparent: true,
            projections: layer.projections,
            modifier: 'borders',
          });
      }
    }
  }
}

/**
 * Adjust a provided OpenLayers style zoom level to be correct for leaflet.
 * @param  {Number} zoom       OpenLayers style zoom level
 * @param  {L.CRS}  projection The projection that the zoom is for
 * @return {Number}            Leaflet style zoom level
 */
function leafletizeZoom(zoom, projection) {
  switch (projection) {
    case L.CRS.EPSG3857:
      return zoom;
    case L.CRS.EPSG4326:
      return zoom - 1;
    default:
      return zoom;
  }
}

/**
 * Adjust a provided Leaflet style zoom level to be correct for OpenLayers.
 * @param  {Number} zoom       Leaflet style zoom level
 * @param  {L.CRS}  projection The projection that the zoom is for
 * @return {Number}            OpenLayers style zoom level
 */
function deLeafletizeZoom(zoom, projection) {
  switch (projection) {
    case L.CRS.EPSG3857:
      return zoom;
    case L.CRS.EPSG4326:
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
 * @param {String}   geonaServer The url of the Geona Server, or ""
 * @param {Function} next
 */
export function init(geonaServer, next) {
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
            import('../vendor/js/leaflet_tilelayer_wmts'),
          ]);
        })
        .then(() => {
          next();
        });
    };
    mapJs.src = geonaServer + '/js/vendor_leaflet.js';
    head.appendChild(mapJs);
  }
}

/**
 * Generates a WMTS TileLayer for use on Leaflet maps.
 * @param {Layer}  geonaLayer    The Geona Layer object containing this layer data after parsing the GetCapabilities request
 * @param {String} mapProjection
 * @return {*}
 */
function createWmtsTileLayer(geonaLayer, mapProjection) {
  // var url = "http://wxs.ign.fr/" + ignKey + "/geoportail/wmts";

  // var ign = new L.TileLayer.WMTS(url,
  //   {
  //     layer: layerIGNScanStd,
  //     style: "normal",
  //     tilematrixSet: "PM",
  //     format: "image/jpeg",
  //     attribution: "<a href='https://github.com/mylen/leaflet.TileLayer.WMTS'>GitHub</a>&copy; <a href='http://www.ign.fr'>IGN</a>"
  //   }
  // );
  let layer;

  let tileMatrixSetId;

  // TODO check correct - Replace with thing to search for TileMatrixSet that supports the current projection
  // TODO change parser to make any objects with the id as the key changed to arrays with the id as a property :(

  // TODO matrixLimits (get to pass through to wmtsTileGridFromMatrixSet)
  let matrixLimits;
  for (let tileMatrixSet of Object.keys(geonaLayer.layerServer.tileMatrixSets)) {
    for (let tileMatrixSetLink of geonaLayer.tileMatrixSetLinks) {
      // If the TileMatrixSet is one of the links for the current layer and the current map projection is
      // supported, we can use this tileMatrixSet for the layer.
      if (tileMatrixSet === tileMatrixSetLink.tileMatrixSet) {
        matrixLimits = tileMatrixSetLink.tileMatrixLimits;
        if (geonaLayer.layerServer.tileMatrixSets[tileMatrixSet].projection === mapProjection) {
          tileMatrixSetId = tileMatrixSet;
        }
      }
    }
  }
  let format;
  let url;

  // TODO This should pick the style provided in a config
  let style;
  let defaultStyle;
  for (let key in geonaLayer.styles) {
    if (geonaLayer.styles.hasOwnProperty(key)) {
      if (key.isDefault) {
        defaultStyle = key;
      }
      style = key;
    }
  }
  if (defaultStyle !== undefined) {
    style = defaultStyle;
  }

  let requestEncoding;

  let attribution;
  if (geonaLayer.attribution) {
    if (geonaLayer.attribution.onlineResource) {
      attribution = '<a href="' + geonaLayer.attribution.onlineResource + '">' + geonaLayer.attribution.title + '</a>';
    } else {
      attribution = geonaLayer.attribution.title;
    }
  }

  // Even though operationsMetadata can contain REST encodings alongside URLs, these URLs are not the
  // templated form required for REST requests, so we only take KVP information from here. REST information
  // is taken from the resourceUrls section.
  if (geonaLayer.layerServer.operationsMetadata) {
    if (geonaLayer.layerServer.operationsMetadata.GetTile) {
      // If we can use a GET operation we use it instead of a POST.
      if (geonaLayer.layerServer.operationsMetadata.GetTile.get !== undefined) {
        let getTile = geonaLayer.layerServer.operationsMetadata.GetTile.get;
        requestEncoding = 'KVP';
        for (let tile of getTile) {
          for (let encoding of tile.encoding) {
            if (encoding === requestEncoding) {
              url = tile.url;
            }
          }
        }
      } else {
        let postTile = geonaLayer.layerServer.operationsMetadata.GetTile.post;
        requestEncoding = 'KVP';
        for (let tile of postTile) {
          for (let encoding of tile.encoding) {
            if (encoding === requestEncoding) {
              url = tile.url;
            }
          }
        }
      }
    }
  }

  console.log('if url undefined:');
  console.log(url === undefined);
  console.log('if geonaLayer.resourceUrls:');
  console.log(geonaLayer.resourceUrls !== undefined);

  if (url === undefined && geonaLayer.resourceUrls) {
    requestEncoding = 'REST';
    for (let resource of geonaLayer.resourceUrls) {
      if (resource.resourceType === 'tile') {
        format = resource.format;
        url = resource.template;
      }
    }
  }

  if (requestEncoding === 'KVP') {
    layer = new L.TileLayer.WMTS(url,
      {
        layer: geonaLayer.identifier,
        style: style,
        tilematrixSet: tileMatrixSetId,
        format: format,
        attribution: attribution,
      }
    );
  } else {
    // let RestUrl = 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/WMTS/tile/1.0.0/WorldTimeZones/WorldTimeZones/default028mm/{z}/{y}/{x}.png';
    // `WorldTimeZones/WorldTimeZones/default028mm/3/3/3.png?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&Layer=` + geonaLayer.identifier + `&Format=` + format + `&TileMatrixSet=` + tileMatrixSetId + `&TileMatrix={z}&TileRow={y}&TileCol={x}`;
    console.log('url:' + url);
    let restUrl = url.replace(/(?:^|\W)TileMatrix(?:$|\W)/, '{z}').replace('TileCol', 'y').replace('TileRow', 'x');
    console.log('restUrl:' + restUrl);
    layer = new L.TileLayer(restUrl, {
      style: style,
      TileMatrixSet: tileMatrixSetId,
    });
  }


  // KVP we need (maybe)
  // custom URL in the form (url + '&height='+ tile height +'&width='+tile width+'&tilematrixset='+tile matrix set id+'&version='+ version OR '1.0.0' +'&style='+style+'&layer='+layer+'&SERVICE=WMTS&REQUEST=GetTile&format='+format+'&TileMatrix='+tile matrix+'&tileRow='+tile row+'&tileCol='+tile col
  return layer;
}
