var md5 = require('md5');

module.exports = function plugin() {
  console.log(md5('plugin test'));
};
