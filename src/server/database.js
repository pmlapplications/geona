/**
 * 
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
   * 
   * @return Connection object
   */
  _connection(next) {
    return adapter.createConnection(this.type + '://' + this.path, next);
  }

  /**
   * Creates the base schema within the selected database; this base schema is updated by {DatabaseAdapter._updateDatabaseSchema()}
   * 
   * @return {Promise}
   */
  initialiseDatabase() {
    return new Promise((resolve, reject) => {
      let conn = this._connection((error) => {
        if (error) {
          reject(error);
        }
      });

      let schema = fs.readFileSync(path.join(__dirname, '../schema/base.sql'));
      let populate_data = fs.readFileSync(path.join(__dirname, '../schema/populate_data.sql'));

      // The any-db apadter will only allow one statement at a time, so whilst this works in as much as it executes the
      // first query and either rejects or returns the promise it will not create the whole schema
      
      // conn.query(schema.toString().replace('\n', ' '), (error, result) => {
      //   if (error) {
      //     reject(error);
      //   } else {
      //     conn.query(populate_data.toString().replace('\n', ' '), (error, result) => {
      //       if (error) {
      //         reject(error);
      //       } else {
      //         resolve(result);
      //       }
      //     });
      //   }
      // });

      
    });
  }

  /**
   * Updates the schema of the database to the latest available using the updates in `src/schema/alterations`
   */
  _updateDatabaseSchema(next) {
    console.log('update schema');
  }
}
