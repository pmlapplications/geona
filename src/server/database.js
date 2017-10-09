/**
 * 
 */
import adapter from 'any-db';
import * as path from 'path';
import fs from 'fs';
import os from 'os';
import exec from 'child_process';

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
   * We fire of a child process exec to create and populate the database here as the any-db abstraction layer prevents
   * us from running multiple commands in a single execution step.
   * 
   * @return {Boolean|Error}
   */
  initialiseDatabase() {
    let schema = path.join(__dirname, '../schema/base.sql');
    
    if (this.type == 'sqlite3') {
      let schemaContent = this._translateToSqlite(fs.readFileSync(schema).toString());
      let tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'geona-')); 
      let sqliteSchema = path.join(tmpFolder, 'sqliteSchema.sql');
      fs.writeFileSync(sqliteSchema, schemaContent);

      let cmd = exec.execSync('sqlite3 ' + this.path + ' < ' + sqliteSchema, (error, stdout, stderr) => {
        if (error || stderr) {
          return new Error(stderr);
        } else {
          return true;
        }
      });   
    }

    if (this.type == 'postgres') {
      // TODO: do the do for the pgsql command
    }
  }

  /**
   * Sepeicifcally to add missing functionality in SQLite. Replaces SQL functions in the schema with the values that the 
   * function would return if run in PostgreSQL
   * 
   * @param {String} schema 
   */
  _translateToSqlite(schema) {
    schema = schema.replace('GETDATE()', 'DATE()');

    return schema;
  }
  /**
   * Updates the schema of the database to the latest available using the updates in `src/schema/alterations`
   */
  _updateDatabaseSchema(next) {
    console.log('update schema');
  }
}
