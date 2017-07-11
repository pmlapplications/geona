import conf from '../config';

export function index(req, res) {
  let options = {
    mapLibrary: conf.get('client.mapLibrary'),
  };
  res.render('index', options);
}
