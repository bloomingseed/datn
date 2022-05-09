const yaml = require('js-yaml');
const fs   = require('fs');

// Get document, or throw exception on error
try {
  const doc = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
  console.log(JSON.stringify(doc));
  for(let i in doc.sources) console.log(i, doc.sources[i].name)
} catch (e) {
  console.log(e);
}
