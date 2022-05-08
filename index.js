const puppeteer = require('puppeteer-core');
const strategy = require('./strategies/vtvSportsStrategy');
const fs = require('fs');
const {openCsvWriter} = require("./lib/openCsvWriter")
const ENCODINGS = {
  'politics': 180,
  'business': 90,
  'world': 122,
  'entertainment': 87,
  'life': 132,
  'education': 166,
  'legal': 179,
  'tech': 109,
}
const CSV_PATH = './output/dataset.csv'
const OUTPUT_DIR = './output/'
let config = {
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--disable-dev-shm-usage']
};

(async () => {
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  let links = await strategy.crawl(page);
  let csvWriter = openCsvWriter(CSV_PATH, true)
  let failures = []
  for(let link of links){
    try{
      await strategy.extractText(csvWriter, link, page)
    } catch(e){
      failures.push(link)
      console.log(`Skipping ${link}...`)
    }
  }
  csvWriter.end()
  if(failures.length > 0){
    console.log("Failed links:")
    console.log(failures.join('\n'))
  }
  //fs.writeFile(OUTPUT_DIR + `vtv/${strategy.subject}.txt`, links.join("\n"), 'utf-8', ()=>console.log(`Written file ${strategy.label}.txt`))
  await browser.close();
})();

async function crawVtv(){
  for(let subject in ENCODINGS){
    let links = await strategy.crawl(page, subject);
    fs.writeFile(OUTPUT_DIR + `vtv/${subject}.txt`, links.join("\n"), 'utf-8', ()=>console.log(`Written file ${subject}.txt`))
  }
}
