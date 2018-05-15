/**
   * Sets the bindings for all menu-related events with the corresponding Menu methods.
   * @param {EventManager} eventManager The event manager for the current instance of Geona.
   * @param {MainMenu} menu The MainMenu object for the current instance of Geona.
   */
export function registerBindings(eventManager, menu) {
  // Close panel
  eventManager.bind('mainMenu.closePanel', () => {
    menu.closePanel();
  });
  // Open menu
  eventManager.bind('mainMenu.openMenu', () => {
    menu.openMenu();
  });
  // Close menu
  eventManager.bind('mainMenu.closeMenu', () => {
    menu.closeMenu();
  });


  /**
   * Explore Panel
   */
  // Display explore panel
  eventManager.bind('mainMenu.displayExplorePanel', () => {
    menu.displayExplorePanel();
  });
  // Auto-select service option
  eventManager.bind('mainMenu.autoselectService', (url) => {
    menu.autoselectService(url);
  });
  // Scan for pre-cached URLs
  eventManager.bind('mainMenu.scanCache', (url) => {
    menu.scanCache(url);
  });
  // Submit service URL
  eventManager.bind('mainMenu.getLayerServer', ([url, service, save, useCache]) => {
    menu.getLayerServer(url, service, save, useCache);
  });
  // Change add URL text
  eventManager.bind('mainMenu.addLayerButtonTextAsUrl', (checked) => {
    menu.addLayerButtonTextAsUrl(checked);
  });
  // Add layer from URL to map
  eventManager.bind('mainMenu.addUrlLayerToMap', (layerIdentifier) => {
    menu.addUrlLayerToMap(layerIdentifier);
  });
  // Add layer from availableLayers to map
  eventManager.bind('mainMenu.addAvailableLayerToMap', (layerIdentifier) => {
    menu.addAvailableLayerToMap(layerIdentifier);
  });

  /**
   * Layers Panel
   */
  // Display layers panel
  eventManager.bind('mainMenu.displayLayersPanel', () => {
    menu.displayLayersPanel();
  });
  // Reorder layers
  eventManager.bind('mainMenu.reorderLayers', (item) => { // Item is the list item that was dragged and dropped
    menu.reorderLayers(item[0]);
  });
  // Show layer
  eventManager.bind('mainMenu.showLayer', ([identifier, item]) => { // Item is the icon that was clicked
    menu.showLayer(identifier, item);
  });
  // Hide layer
  eventManager.bind('mainMenu.hideLayer', ([identifier, item]) => { // Item is the icon that was clicked
    menu.hideLayer(identifier, item);
  });
  // Toggle layers panel item panel
  eventManager.bind('mainMenu.toggleLayersPanelItemTab', ([item, panel]) => {
    menu.toggleLayersPanelItemTab(item, panel);
  });
  // Remove layer
  eventManager.bind('mainMenu.removeLayer', (item) => { // Item is the list item that contained the icon that was clicked
    menu.removeLayer(item[0]);
  });
  // Validate (calls update and draw) scale
  eventManager.bind('mainMenu.layersPanelScalebars.validateScale', ([item, layerIdentifier, min, max, log, instant]) => {
    try {
      menu.layersPanelScalebars[layerIdentifier].validateScale(min, max, log, instant);
    } catch (err) {
      let geonaLayer = menu.geona.map.availableLayers[layerIdentifier];
      switch (err.name) {
        case 'MinValueInvalidError':
          menu.setScalebarInputs(item, geonaLayer.scale.min, max, log);
          break;
        case 'MaxValueInvalidError':
          menu.setScalebarInputs(item, min, geonaLayer.scale.max, log);
          break;
        case 'SwappedValuesError':
          menu.setScalebarInputs(item, geonaLayer.scale.min, geonaLayer.scale.max, log);
          break;
        default:
          throw err;
      }
    }
  });
  // Apply auto scale
  eventManager.bind('mainMenu.applyAutoScale', (item) => {
    menu.applyAutoScale(item);
  });
  // Re-enable auto scale
  eventManager.bind('mainMenu.reEnableAutoScale', (item) => {
    menu.reEnableAutoScale(item);
  });
  // Reset scale
  eventManager.bind('mainMenu.layersPanelScalebars.resetScale', (layerIdentifier) => {
    menu.layersPanelScalebars[layerIdentifier].resetScale();
  });

  // Change layer datetime display
  eventManager.bind('timePanel.timeChanged', () => {
    menu.updateLayersDatetimeGraphic();
  });

  // Change layer opacity
  eventManager.bind('mainMenu.changeLayerOpacity', ([item, opacity]) => {
    menu.changeLayerOpacity(item, opacity);
  });
  // Change layer elevation
  eventManager.bind('mainMenu.changeElevationStyle', ([layerIdentifier, elevation]) => {
    menu.changeLayerElevation(layerIdentifier, elevation);
  });
  // Change layer style
  eventManager.bind('mainMenu.changeLayerStyle', ([item, style]) => { // Item is the list item that contained the select
    menu.changeLayerStyle(item, style);
  });
  // Select below min color
  eventManager.bind('mainMenu.setBelowMinColor', ([layerIdentifier, option]) => {
    menu.setBelowMinColor(layerIdentifier, option);
  });
  // Set below min color graphics
  eventManager.bind('mainMenu.updateBelowMinColorGraphic', ([item, colorCode]) => {
    menu.updateBelowMinColorGraphic(item, colorCode);
  });
  // Select above max color
  eventManager.bind('mainMenu.setAboveMaxColor', ([layerIdentifier, option]) => {
    menu.setAboveMaxColor(layerIdentifier, option);
  });
  // Set above max color graphics
  eventManager.bind('mainMenu.updateAboveMaxColorGraphic', ([item, colorCode]) => {
    menu.updateAboveMaxColorGraphic(item, colorCode);
  });
  // Show below min color input
  eventManager.bind('mainMenu.showBelowMinColorInput', (item) => {
    menu.showBelowMinColorInput(item);
  });
  // Hide below min color input
  eventManager.bind('mainMenu.hideBelowMinColorInput', (item) => {
    menu.hideBelowMinColorInput(item);
  });
  // Show above max color input
  eventManager.bind('mainMenu.showAboveMaxColorInput', (item) => {
    menu.showAboveMaxColorInput(item);
  });
  // Hide above max color input
  eventManager.bind('mainMenu.hideAboveMaxColorInput', (item) => {
    menu.hideAboveMaxColorInput(item);
  });
  // Set number of color bands
  eventManager.bind('mainMenu.setNumberOfColorBands', ([item, numColorBands]) => {
    menu.setNumberOfColorBands(item, numColorBands);
  });
  // Zoom to data

  // Execute changes buffer
  eventManager.bind('mainMenu.executeChangesBuffer', (layerIdentifier) => {
    menu.executeChangesBuffer(layerIdentifier);
  });

  // Submit WCS URL
  eventManager.bind('mainMenu.submitWcsUrl', ([item, url]) => {
    menu.submitWcsUrl(item, url);
  });

  /*
   * Analysis Panel
   */
  eventManager.bind('mainMenu.displayAnalysisPanel', () => {
    menu.displayAnalysisPanel();
  });


  /**
   * Login Panel
   */
  eventManager.bind('mainMenu.displayLoginPanel', () => {
    menu.displayLoginPanel();
  });

  /**
   * Options Panel
   */
  // Display options panel
  eventManager.bind('mainMenu.displayOptionsPanel', () => {
    menu.displayOptionsPanel();
  });
  // Set basemap
  eventManager.bind('mainMenu.setBasemap', (basemapIdentifier) => {
    menu.setBasemap(basemapIdentifier);
  });
  // Set borders
  eventManager.bind('mainMenu.setBorders', ([bordersIdentifier, bordersStyle]) => {
    menu.setBorders(bordersIdentifier, bordersStyle);
  });
  // Show graticule
  eventManager.bind('mainMenu.showGraticule', () => {
    menu.showGraticule();
  });
  // Hide graticule
  eventManager.bind('mainMenu.hideGraticule', () => {
    menu.hideGraticule();
  });
  // Set projection
  eventManager.bind('mainMenu.setProjection', ([previousProjection, newProjection]) => {
    menu.setProjection(previousProjection, newProjection);
  });

  /**
   * Help Panel
   */
  eventManager.bind('mainMenu.displayHelpPanel', () => {
    menu.displayHelpPanel();
  });


  /**
   * Share Panel
   */
  eventManager.bind('mainMenu.displaySharePanel', () => {
    menu.displaySharePanel();
  });
}
