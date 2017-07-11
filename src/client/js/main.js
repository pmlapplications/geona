import {loadConfig} from './config';

export default function(map) {
  loadConfig(() => {
    map.createMap();
  });
}
