/**
 * @fileoverview Defines the administrative menu structure
 */
import _ from 'lodash';

let _structure = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Administration',
    path: '/admin',
  },
  {
    title: 'About',
    path: '/about',
  },
  {
    title: 'Documentation',
    children: [
      {
        title: 'Client docs',
        path: '/documentation/client',
      },
      {
        title: 'Server docs',
        path: '/documentation/server',
      },
      {
        title: 'Administration docs',
        path: '/documentation/admin',
      },
    ],
  },
  {
    title: 'Contact',
    path: '/contact',
  },
];

/**
 * Returns a JSON object that contains the administration menu structure with the `path` set to use an `active` class
 * 
 * @export
 * @param {String} path - path of the current route excluding any sub folder that the application may be running in
 */
export function getMenu(path) {
  let menu = _structure;

  _.forEach(menu, function(menuItem) {
    if (menuItem.path === path) {
      menuItem.active = true;
    }
  });
  return menu;
}
