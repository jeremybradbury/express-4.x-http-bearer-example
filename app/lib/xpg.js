var generate = require('xkcd-pass-plus');
module.exports = function(){
  var options = { 
    words: { dictionary: 'mixed', num: 4, min: 4, max: 8 },
    separator: ' ',
    paddingDigits: { after: 0 },
    paddingSymbols: { after: 0 }
  };
  return generate(options).pass.toLowerCase();
};