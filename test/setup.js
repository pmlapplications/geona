import path from 'path';

before(function() {
  global.test = {
    depPath: path.join(__dirname, '../test_dependencies/'),
    resPath: path.join(__dirname, '../test_dependencies/resources'),
    expPath: path.join(__dirname, '../test_dependencies/expected'),
  };
});
