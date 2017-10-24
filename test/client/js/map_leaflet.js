import chai from 'chai';
import chaiHttp from 'chai-http';
import $ from 'jquery';

// import {LMap} from '../../../src/client/js/map_leaflet';

chai.use(chaiHttp);
let expect = chai.expect;

describe('client/js/map_leaflet', () => {
  // before(function() {
  //   console.log(window);
  //   if (window.__html__) {
  //     document.body.innerHTML = window.__html__['../index.html'];
  //   }

  //  We want to load a bunch of layers, saved locally from a WMS request. This could take more than
  //  two seconds, so we change the default timeout, since the tests here are dependent on the existence of layers.
  //  We should make sure these are the correct projection.
  //  this.timeout(10000);
  // });
  // describe('constructor', function() {
  //   it('should successfully create an LMap object', function() {
  //     let map = new LMap({}, document.body);
  //     console.log(map);
  //     console.log('running constructor test');
  //     expect('').to.equal('');
  //   });
  // });

  describe('Leaflet', function() {
    it('should exist', function() {
      $('#leaflet').hasClass('geona-container');
    });
  });

  describe('addLayer()', function() {
    it('should have four layers in the _mapLayers FeatureGroup', function() {
      // addLayer(layer1);
      // addLayer(layer2);
      // addLayer(layer3);
      // addLayer(layer4);

      // expect(geonaL.map._mapLayers.getLayers().length).to.equal(4);
    });
  });

  describe('_mapLayers', function() {
    it('should only contain tile layers', function() {
      for (let layer of geonaL.map._mapLayers.getLayers()) {
        if (layer.options.crs === undefined) {
          assert.fail(
            'Layer CRS is undefined',
            'Tile layers should have a CRS',
            `_mapLayers should only contain tile layers. Check _mapLayers for unexpected layers.
             It may also be the case that the assumption that a tile layer should have a CRS is incorrect - in
             this case, the logic in addLayer() should be updated.`
          );
        }
      }
    });
  });

  describe('reorderLayers()', function() {
    before(function() {
      // Clear the map of all layers
      // Define the layers here?
      // Adds four layers to the map
      // geonaL.map.addLayer();

    });
    it('should have set the lowest zIndex to be 0', function() {
      let lowestZIndex = 999;
      // for (let layer of geonaL.map._mapLayers.getLayers()) {
      //   if (layer.options.zIndex < lowestZIndex) {
      //     lowestZIndex = layer.options.zIndex;
      //   }
      // }
      expect(lowestZIndex).to.equal(0);
    });
    it('should have set the highest zIndex to be 3', function() {
      let highestZIndex = -999;
      // for (let layer of geonaL.map._mapLayers.getLayers()) {
      //   if (layer.options.zIndex > highestZIndex) {
      //     highestZIndex = layer.options.zIndex;
      //   }
      // }
      expect(highestZIndex).to.equal(3);
    });
    it('should only have unique zIndex values', function() {
      let previousZIndices = [];
      // for (let layer of geonaL.map._mapLayers.getLayers()) {
      //   if (previousZIndices.includes(layer.options.zIndex)) {
      //     assert.fail(
      //       'value already found in layers',
      //       'all zIndex values to be unique',
      //       'all zIndex values should be unique in order to have a clear ordering of layers on the map'
      //     );
      //   }
      // }
      // // I think this test will pass simply by not failing, but check it
    });

    // Used for the test after next. When we reorder the layer from 1 to 2, we
    // want to make sure that the layer that used to be in 2 is now in position 1.
    let zIndex2LayerIdentifier;
    it('should reorder the layer with zIndex 1 to zIndex 2', function() {
      let zIndex1LayerIdentifier;
      // for (let layer of geonaL.map._mapLayers.getLayers()) {
      //   if (layer.options.zIndex === 1) {
      //    zIndex1LayerIdentifier = layer.options.identifier;
      //   } else if (layer.options.zIndex === 2) {
      //    zIndex2LayerIdentifier = layer.options.identifier;
      // }
      // }
      // geonaL.map.reorderLayers(zIndex1LayerIdentifier, 2);
      // catch error
    });
    it('should have set the layer with zIndex 2 to have zIndex 1 in the previous test', function() {
      // for (let layer of geonaL.map._mapLayers.getLayers()) {
      //   if (layer.options.zIndex === 1) {
      //     // Hopefully this quits out of the test by itself, but it probably doesn't
      //     expect(layer.options.identifier).to.equal(zIndex2LayerIdentifier);
      //   }
      // }
    });
    it('should keep the basemap at zIndex 0 when reordering a data layer to 0', function() {
      // geonaL.map.reorderLayers(zIndex1LayerIdentifier, 0);
    });
    it('should keep the borders at zIndex 3 when reordering a data layer to 3', function() {
      // geonaL.map.reorderLayers(zIndex1LayerIdentifier, 0);
    });
  });
});
