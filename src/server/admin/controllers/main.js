/**
 * @fileoverview Controllers for the Administration application
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
import * as config from '../../config';
import * as menu from '../templates/menu';

/**
 * Renders the main index page for the administration application
 * @param {*} req 
 * @param {*} res 
 */
export function index(req, res) {
  let data = {
    config: config.server.getProperties(),
    template: 'temp2',
    menu: menu.structure,
    body: 'Something',
  };

  res.render('admin_template', data);
}
