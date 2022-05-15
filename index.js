const puppeteer = require('puppeteer-core');
const path = require('path')
const CONFIG = require("./lib/config")
const strategies = require('./strategies');
const adapters = require("./adapters");
const {Worker, delay} = require('./lib/worker')
const WORKERS = 2;
const loadDb = require('./lib/db');
const NAVIGATION_TIMEOUT = 10000; //ms

let config = {
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding']
};
//const adapter = require("./adapters/vietnamnet");

/*
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
*/

(async () => {
  const browsers = [];
  //const browser = await puppeteer.launch(config);
  let {connection, db} = await loadDb()
  //const connections = []
  const workers = [];
  console.log(adapters, strategies)

  for(let i = 0; i<WORKERS; ++i){
    let browser = await puppeteer.launch(config);
    browsers.push(browser);
    let page = await browser.newPage()
    page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT)
    workers.push(Worker(i, 
      adapters, strategies,
      page, db //db: connections[i].db
    ))
    //connections.push(await loadDb());
  }
//const page = await browser.newPage();

  await Promise.all(workers);
/*
  for(let source_id = 0; source_id<CONFIG.length; ++source_id){
    let source = CONFIG[source_id];
    let adapter = adapters[source.name]
    let strategy = strategies[source.name]
    for(let category_id = 0; category_id<source.templates.length; ++category_id){
      let workers = [];
      for(let i = 0; i<WORKERS; ++i){
        workers.push(Worker(i, {
          adapter, strategy, source_id, category_id, 
          page: pages[i], db //db: connections[i].db
        }))
      }
      await Promise.all(workers);
      */
      /*
      for(let result of results){
        for(let row of result){
          rows.push(row)
          delay(10);
        }
        delay(10);
      }
      for(let i = 1; i<=source.limit; ++i){
        console.log(`${source.name} -- Category ${category_id} -- Page ${i}/${source.limit}`)
        let indexUrl = source.templates[category_id].replace('#{i}', i)
        let articleUrls = await adapter.getArticleUrls(page, indexUrl);
        console.log(articleUrls.length)
        for(let url of articleUrls){
          let text = await strategy.crawl(url, page)
          console.log({source_id, category_id, url, text})
          rows.push(row)
        }
      }
      let writer = openCsvWriter(CSV_PATH)
      for(let row of rows) writer.write(row)
      writer.end()
      delay(10);
      */
    //}
  //}
  /*
  let adapter = adapters.vietnamnet
  let source = CONFIG[3];
  //for(let h = 0; h<source.templates.length; ++h){
    //let template = source.templates[h];
    let template = source.templates[0];
    let urls = [];
    //for(let i = 1; i<=source.limit; ++i){
      let indexUrl = template.replace('#{i}', 1)
      let articleUrls = await adapter.getArticleUrls(page, indexUrl);
      console.log(articleUrls.length, articleUrls[0])

      for(let url of articleUrls){
        console.log(await strategy.crawl(url, page))
      }

      //for(let url of articleUrls) urls.push(url);
    //}
  //}
  */

  //await browser.close();
  for(let i = 0; i<browser.lengt; ++i)
    await browsers[i].close();
  await connection.close()
  //for(let i = 0; i<connections.length; ++i)
  //  await connections[i].close();
})();
