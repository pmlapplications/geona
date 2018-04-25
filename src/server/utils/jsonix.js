/** @module utils/jsonix */

/**
 * @fileOverview Defines mappings for jsonix and exports jsonix contexts for xml to json parsing
 */

import {Jsonix as jsonix} from 'jsonix';
import {XLink_1_0 as xLink, WS_Addr_1_0_Core as wsAddr} from 'w3c-schemas';
import * as ogcSchemas from 'ogc-schemas';

import {INSPIRE_COMMON_1_0_1} from '../vendor/jsonix_mappings/inspire_common_1_0_1';

/*
 * See https://github.com/highsource/jsonix/wiki/Using-Jsonix-in-Your-JavaScript-Program for Jsonix usage docs
 */

const MAP_SERVER_1_0_0 = {
  name: 'mapServer',
  dens: 'http://mapserver.gis.umn.edu/mapserver',
  deps: ['WMS_1_3_0'],
  eis: [{
    en: 'Service',
  }, {
    en: 'GetStyles',
    ti: 'WMS_1_3_0.OperationType',
    sh: {
      lp: '_ExtendedOperation',
      ns: 'http://www.opengis.net/wms',
    },
  }],
};

const INSPIRE_VS_1_0_1 = {
  name: 'inspire_vs',
  dens: 'http://inspire.ec.europa.eu/schemas/inspire_vs/1.0',
  deps: ['WMS_1_3_0', 'INSPIRE_COMMON_1_0_1'],
  eis: [{
    en: 'ExtendedCapabilities',
    ti: 'INSPIRE_COMMON_1_0_1.ExtendedCapabilitiesType',
    sh: {
      lp: '_ExtendedOperation',
      ns: 'http://www.opengis.net/wms',
    },
  }],
};


// Jsonix Contexts are thread-safe and reusable so create any we need here
export const WMS_CONTEXT = new jsonix.Context([
  xLink,
  MAP_SERVER_1_0_0,
  INSPIRE_COMMON_1_0_1,
  INSPIRE_VS_1_0_1,
  ogcSchemas.SMIL_2_0,
  ogcSchemas.SMIL_2_0_Language,
  ogcSchemas.GML_2_1_2,
  ogcSchemas.GML_3_1_1,
  ogcSchemas.Filter_1_0_0,
  ogcSchemas.Filter_1_1_0,
  ogcSchemas.SE_1_1_0,
  ogcSchemas.OWS_1_0_0,
  ogcSchemas.OWS_1_1_0,
  ogcSchemas.WMS_1_0_0,
  ogcSchemas.WMS_1_1_0,
  ogcSchemas.WMS_1_1_1,
  ogcSchemas.WMS_1_3_0,
  ogcSchemas.WMS_1_3_0_Exceptions,
  ogcSchemas.SLD_1_0_0,
  ogcSchemas.SLD_1_0_0_GeoServer,
  ogcSchemas.SLD_1_1_0,
]);

export const WMTS_CONTEXT = new jsonix.Context([
  xLink,
  ogcSchemas.SMIL_2_0,
  ogcSchemas.SMIL_2_0_Language,
  ogcSchemas.GML_3_1_1,
  ogcSchemas.OWS_1_1_0,
  ogcSchemas.WMTS_1_0,
]);

export const WCS_CONTEXT = new jsonix.Context([
  xLink,
  ogcSchemas.SMIL_2_0,
  ogcSchemas.SMIL_2_0_Language,
  ogcSchemas.SWE_2_0,
  ogcSchemas.GML_3_1_1,
  ogcSchemas.GML_3_2_1,
  ogcSchemas.GMLCOV_1_0,
  ogcSchemas.OWS_1_1_0,
  ogcSchemas.OWS_2_0,
  ogcSchemas.GML4WCS_1_0_0,
  ogcSchemas.WCS_1_0_0,
  ogcSchemas.WCS_1_1,
  ogcSchemas.WCS_2_0,
  // new
  // ogcSchemas.WCS_CRS_1_0,
  // ogcSchemas.WCS_Interpolation_1_0,
  // ogcSchemas.WCS_Processing_2_0,
  // ogcSchemas.WCS_Range_Subsetting_1_0,
  // ogcSchemas.WCS_Scaling_1_0,
  // ogcSchemas.GML_1_0_0,
  // ogcSchemas.GML_2_1_2,
  // ogcSchemas.GML_3_2_0,
  // ogcSchemas.GML_CE_3_3,
  // ogcSchemas.GML_EXR_3_3,
  // ogcSchemas.GML_LR_3_3,
  // ogcSchemas.GML_LRO_3_3,
  // ogcSchemas.GML_LROV_3_3,
  // ogcSchemas.GML_LRTR_3_3,
  // ogcSchemas.GML_RGRID_3_3,
  // ogcSchemas.GML_TIN_3_3,
  // ogcSchemas.GML_XBT_3_3,
  // ogcSchemas.GMLCOV_GeoTIFF_1_0,
  // ogcSchemas.GMLJP2_2_0,
  // ogcSchemas.WCS_WCSEO_1_0,
]);

export const WFS_CONTEXT = new jsonix.Context([
  xLink,
  ogcSchemas.GML_2_1_2,
  ogcSchemas.GML_3_1_1,
  ogcSchemas.SMIL_2_0,
  ogcSchemas.SMIL_2_0_Language,
  ogcSchemas.OWS_1_0_0,
  ogcSchemas.OWS_1_1_0,
  ogcSchemas.WFS_1_0_0,
  ogcSchemas.Filter_1_0_0,
  ogcSchemas.Filter_1_1_0,
  ogcSchemas.Filter_2_0,
  ogcSchemas.WFS_1_1_0,
  ogcSchemas.WFS_2_0,
]);

export const SOS_CONTEXT = new jsonix.Context([
  wsAddr,
  xLink,
  ogcSchemas.WSN_T_1,
  ogcSchemas.SWES_2_0,
  ogcSchemas.GML_3_1_1,
  ogcSchemas.GML_3_2_1,
  ogcSchemas.SMIL_2_0,
  ogcSchemas.SMIL_2_0_Language,
  ogcSchemas.SWE_1_0_1,
  ogcSchemas.SWE_2_0,
  ogcSchemas.OWS_1_1_0,
  ogcSchemas.OM_1_0_0,
  ogcSchemas.OM_2_0,
  ogcSchemas.SensorML_1_0_1,
  ogcSchemas.IC_2_0,
  ogcSchemas.ISO19139_GMD_20070417,
  ogcSchemas.ISO19139_GCO_20070417,
  ogcSchemas.ISO19139_GTS_20070417,
  ogcSchemas.ISO19139_GSS_20070417,
  ogcSchemas.ISO19139_GSR_20070417,
  ogcSchemas.Filter_2_0,
  ogcSchemas.SOS_1_0_0,
  ogcSchemas.SOS_1_0_0_Filter,
  ogcSchemas.SOS_2_0,
]);
