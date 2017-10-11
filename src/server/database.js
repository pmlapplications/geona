/**
 * 
 */

import * as config from './config';

import {Builder} from 'sequelize-classes';
import {User} from './models/user';

// Normal sequelize options.
const options = {
  database: config.server.get('database.dialect'),
  username: null,
  pass: null,
  config: {
    dialect: config.server.get('database.dialect'),
    storage: config.server.get('database.storage')
  }
};

// Pass sequelize connection options and an array of Classes extended from Model.
const database = new Builder(options, [User]);

// You can now access your sequelize instance via database.base and access all your models by name - database.User