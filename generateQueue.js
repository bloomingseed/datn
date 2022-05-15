const path = require('path')
const CONFIG = require("./lib/config")
const loadDb = require('./lib/db');
let last_id = 0;

(async () => {
  const {connection, db} = await loadDb();

  for(let source_id = 0; source_id<CONFIG.length; ++source_id){
    let source = CONFIG[source_id];
    for(let category_id = 0; category_id<source.templates.length; ++category_id){
      let queue = [];
      for(let i = 1; i<=source.limit; ++i)
        queue.push({id: ++last_id, url: source.templates[category_id].replace('#{i}', i), 
        source_id, category_id, source_name: source.name})
      await db.collection("queue").insertMany(queue)
    }
  }
  await connection.close();
})();
