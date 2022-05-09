const path = require('path')
const NAMES = ["dantri", "vnexpress", "thanhnien", "vietnamnet"]
var strategies = {}
for(let name of NAMES){
  strategies[name] = require(path.resolve(__dirname, `${name}.js`))
}

module.exports = strategies;
