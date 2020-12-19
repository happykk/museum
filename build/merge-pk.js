var path = require('path');
var fs = require("fs");

if (
   fs.existsSync(path.resolve(__dirname, '../package.json')) &&
   fs.existsSync(path.resolve(__dirname, '../package.pro.json'))) {
  var pk = require('../package.json');
  var proPk = require('../package.pro.json');
  var mergeJSON = require("merge-json");
  var ctn = mergeJSON.merge(pk, proPk);
  fs.writeFile(path.resolve(__dirname, '../package.json'), JSON.stringify(ctn), {
    flag: 'w'
  }, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('merge package.json file success!');
    }
  });
}

