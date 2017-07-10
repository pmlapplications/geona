import {loadConfig} from './config';
import * as map from './map';

loadConfig(() => {
  map.chooseLibrary(() => {
    map.createMap();
  });
});
