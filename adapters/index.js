const path = require('path')
const NAMES = ["dantri", "vnexpress", "thanhnien", "vietnamnet"]
var adapters = {}
for(let name of NAMES){
  adapters[name] = require(path.resolve(__dirname, `${name}.js`))
}

module.exports = adapters;
