const path = require('path')
const {openCsvWriter} = require("./openCsvWriter")
const CSV_PATH = path.resolve(__dirname, '../output/dataset-v3.csv')
const {ObjectId} = require('mongodb')
const WORKERS = 3;
const TOTAL_URLS = 2500;

async function process(indexUrl, params){
  let {db, adapter, strategy, source_id, category_id, page} = params
  let articleUrls = await adapter.getArticleUrls(page, indexUrl);
  //console.log(articleUrls.length)
  for(let url of articleUrls){
    let text = await strategy.crawl(url, page)
    await db.collection("dataset").insertOne({source_id, category_id, url, text})
    //rows.push({source_id, category_id, url, text})
    delay(100)
  }
  //let writer = openCsvWriter(CSV_PATH)
  //for(let row of rows) writer.write(row)
  //writer.end()
}

const Worker = async (index, adapters, strategies, page, db) => {
  const history = [];
  //const rows = [];
  //params.rows = rows;
  let workAmount = TOTAL_URLS/WORKERS;
  let jobs = await db.collection("queue").find({id: {$lte: (index+1)*workAmount, $gt: index*workAmount}}).toArray();
  console.log(`#${index}, ${jobs.length}`)
  while(jobs.length > 0){
    let {source_id, category_id, url, source_name} = jobs.shift();
    history.push(url);
    console.log('Worker #' + index + ' grabbed new job:' + url +'. History is:', history);
    let articleUrls = await adapters[source_name].getArticleUrls(page, url);
    //console.log(articleUrls.length)
    for(let url of articleUrls){
      let text = await strategies[source_name].crawl(url, page)
      await db.collection("dataset").insertOne({source_id, category_id, url, text})
      //rows.push({source_id, category_id, url, text})
      delay(100)
    }
    //await process(job, params)
    //params.db.collection("queue").updateOne({_id: jobObject._id}, {status: 1});
  }
  //return rows;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.Worker = Worker
exports.delay = delay
