async function process(indexUrl, params){
  let {rows, adapter, strategy, source_id, category_id, page} = params
  let articleUrls = await adapter.getArticleUrls(page, indexUrl);
  //console.log(articleUrls.length)
  for(let url of articleUrls){
    let text = await strategy.crawl(url, page)
    rows.push({source_id, category_id, url, text})
  }
}

const Worker = async (name, queue, params) => {
  const history = [];
  const rows = [];
  params.rows = rows;
  while(queue.length > 0){
    let job = queue.shift();
    history.push(job);
    console.log('Worker ' + name + ' grabbed new job:' + job +'. History is:', history);
    await process(job, params)
  }
  return rows;
}

module.exports = Worker
