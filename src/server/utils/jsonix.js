import {Jsonix as jsonix} from 'jsonix';
import {XLink_1_0 as xLink} from 'w3c-schemas';
import * as ogcSchemas from 'ogc-schemas';

/*
 * See https://github.com/highsource/jsonix/wiki/Using-Jsonix-in-Your-JavaScript-Program for Jsonix usage docs
 */

const MAP_SERVER = {
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


// Jsonix Contexts are thread-safe and reusable so create any we need here
export const WMS_CONTEXT = new jsonix.Context([
  xLink,
  MAP_SERVER,
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
]);
