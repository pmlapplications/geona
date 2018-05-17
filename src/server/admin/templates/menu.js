/**
 * @fileoverview Defines the administrative menu structure
 */

export let structure = [
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

