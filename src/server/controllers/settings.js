import conf from '../config';

export function config(req, res) {
  res.json(conf.getProperties().client);
}

export function configSchema(req, res) {
  res.json(conf.getSchema().properties.client);
}
