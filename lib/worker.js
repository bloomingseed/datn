const path = require('path')
const {openCsvWriter} = require("./openCsvWriter")
const CSV_PATH = path.resolve(__dirname, '../output/dataset-v3.csv')
const {ObjectId} = require('mongodb')
const WORKERS = 3;
const TOTAL_URLS = 2500;
//const START_INDEX = 1;
const START_INDEX = 541;

const Worker = async (index, adapters, strategies, page, db) => {
  const history = [];
  let current_id = index+START_INDEX;
  //const rows = [];
  //params.rows = rows;
  let workAmount = TOTAL_URLS/WORKERS;
  let job = await db.collection("queue").findOne({id: {$eq: current_id}});
  while(job != null){
    let {source_id, category_id, url, source_name} = job;
    history.push(url);
    //console.log('Worker #' + index + ' grabbed new job:' + url +'. History is:', history);
    console.log(`Worker #${index} grabbed: {id: ${current_id}, url: ${url}}. History is:`, history);
    let articleUrls = await adapters[source_name].getArticleUrls(page, url);
    //console.log(articleUrls.length)
    for(let url of articleUrls){
      let text = await strategies[source_name].crawl(url, page)
      await db.collection("dataset").insertOne({source_id, category_id, url, text})
      //rows.push({source_id, category_id, url, text})
      delay(100)
    }
    current_id += WORKERS;
    job = await db.collection("queue").findOne({id: {$eq: current_id}});
  //await process(job, params)
    //params.db.collection("queue").updateOne({_id: jobObject._id}, {status: 1});
  }
  //return rows;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.Worker = Worker
exports.delay = delay
