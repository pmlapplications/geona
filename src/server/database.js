/**
 * @module database
 */
import adapter from 'any-db';
import * as path from 'path';
import fs from 'fs';

import * as config from './config';

export default class DatabaseAdapter {
  /**
   * Both params are optional as normally this will be drawn from the config except during first initialisation or migration
   * 
   * @param {String} type - optional; database type (sqlite3|postgres)
   * @param {String} path - optional; path to the database
   */
  constructor(type, path) {
    let configServer = config.server.getProperties();

    this.type = type || configServer.database.type;
    this.path = path || configServer.database.path;
  }

  /**
   * Return a connection to the database
   */
  connection() {
    return adapter.createConnection(this.type + '://' + this.path);
  }

  initialiseDatabase() {
    let conn = this.connection();
    let schema = fs.readFileSync(path.join(__dirname, '../schema/base.sql'));

    conn.query(schema.toString(), function(error, result) {
      console.log(error);
      console.log(result);
    });

  }

  updateDatabaseSchema() {

  }
}
