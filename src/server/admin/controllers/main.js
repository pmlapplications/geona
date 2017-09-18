/**
 * @fileoverview Controllers for the Administration application
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
import * as config from '../../config';

/**
 * Renders the main index page for the administration application
 * @param {*} req 
 * @param {*} res 
 */
export function index(req, res) {
  let data = {
    config: config.server.getProperties(),
    template: 'temp2',
    menu: {
      home: 'path/to/home',
    },
    body: 'Something',
  };

  res.render('admin_template', data);
}
