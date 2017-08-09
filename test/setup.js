import path from 'path';

before(function() {
  // Setup global test variables for use in tests
  global.test = {
    depPath: path.join(__dirname, '../test_dependencies/'),
    resPath: path.join(__dirname, '../test_dependencies/resources'),
    expPath: path.join(__dirname, '../test_dependencies/expected'),
  };
});
