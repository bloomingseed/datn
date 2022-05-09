const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');
const FILE_PATH = path.resolve(__dirname, '../config.yaml');
//console.log(FILE_PATH)

module.exports = yaml.load(fs.readFileSync(FILE_PATH, 'utf8'));
