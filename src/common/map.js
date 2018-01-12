/**
 * Converts a layer server request URL into a filename that can be used to cache the contents of the request.
 * Example: url: 'https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.1-5DAY?service=WMS&version=1.3.0&request=GetCapabilities'
 *          filename: 'https__rsg_pml_ac_uk_thredds_wms_CCI_ALL_v3_1_5DAY__WMS_1.3.0_GetCapabilities'
 *
 * @param {String} url A URL for a layer server request (e.g. GetCapabilities)
 * @return {String}    The URL converted to a Geona filename
 */
export function urlToFilename(url) {
  // 1) Extract protocol, host and path
  let mainUrl = url.replace(/\?.*/g, '');
  // 2) Replace special characters with underscores
  let mainFilename = mainUrl.replace(/:\/|\//g, '_');
  // 3) Extract service, version, and request parameters if they exist
  let parameters = '';
  let service = url.match(/service=.*?(?=[&\s])|service=.*/);
  if (service !== null) {
    parameters += service;
  }
  let version = url.match(/version=.*?(?=[&\s])|version=.*/);
  if (version !== null && service !== null) {
    parameters += '_' + version;
  } else if (version !== null) {
    parameters += version;
  }
  let request = url.match(/request=.*?(?=[&\s])|request=.*/);
  if (request !== null && (service !== null || version !== null)) {
    parameters += '_' + request;
  } else if (request !== null) {
    parameters += request;
  }

  // 4) Remove service, version and request tags
  let paramsFilename = parameters.replace(/service=|version=|request=/g, '');
  // 5) Construct full filename
  let filename = mainFilename;
  if (paramsFilename.length > 0) {
    filename += '__' + paramsFilename;
  }
  // 6) Cut strings of 3+ underscores down to 2
  filename = filename.replace(/_{3,}/, '__');

  // 7) Convert to all-lowercase
  filename = filename.toLocaleLowerCase();

  return filename;
}

/**
 * 
 * @param {String} filename The filename created from a URL originally
 * @return {String}         The original URL converted back from the filename
 */
export function filenameToUrl(filename) {
  let components = filename.split('__');

  let protocol = components[0] + '://';

  let body = components[1];


  let url;
  return url;
}
