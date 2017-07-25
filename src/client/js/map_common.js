export let baselayers = [
  {
    id: 'EOX',
    title: 'EOX',
    description: 'EPSG:4326 only',
    projections: ['EPSG:4326'],
    source: {
      url: 'https://tiles.maps.eox.at/wms/?',
      crossOrigin: null,
      params: {
        type: 'wms',
        LAYERS: 'terrain-light',
        VERSION: '1.1.1',
        wrapDateLine: true,
      },
      attributions: ['EOX'],
    },
  },
  {
    tile: {
      id: 'OSM',
      title: 'OSM',
      description: 'EPSG:3857 only',
      projections: ['EPSG:3857'],
      source: {
        type: 'osm',
      },
    },
    // view: new ol.View({
    //   center: ol.proj.fromLonLat([37.41, 8.82]),
    //   zoom: 4,
    // }),
  },
  {
    tile: {
      id: 'GEBCO',
      title: 'GEBCO',
      projections: ['EPSG:4326', 'EPSG:3857'],
      source: {
        type: 'wms',
        url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
        crossOrigin: null,
        params: {LAYERS: 'gebco_08_grid', VERSION: '1.1.1', FORMAT: 'image/jpeg', wrapDateLine: true},
        attributions: ['GEBCO'],
      },
    },
  },
];
