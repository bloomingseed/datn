const LIMIT = 50;
const POSTS_LIMIT = 800;
function pushLinks(links, moreLinks){
  for(let link of moreLinks) links.push(link);
}
async function crawl(page, callback = undefined){
  let links = [];
  await page.goto('https://vtv.vn/suc-khoe/nong.htm');

  pushLinks(links, await crawlSession(page));
  console.log(null, links.length);

  await crawlTimeline(links, page);
  return links;
}

async function crawlSession(page){
  await page.waitForSelector(`div[class="session-1"]`)
  return await page.$$eval(`div[class="session-1"] a`, links=>{
    return links.map(a=>a.href)
  })
}

async function crawlTimeline(links, page){
  pushLinks(links, await page.$$eval('ul[class="session-post-vertical__body"]', uls=>{
    return [].concat(
      Array.from(uls[0].querySelectorAll('.item .row > div > a')).map(a=>a.href),
      Array.from(uls[1].querySelectorAll('.item .row > div > a')).map(a=>a.href))
  }))
  console.log(null, links.length);
  await page.waitForSelector('div[class="session-post-vertical timeline"] > ul')
  await page.waitForSelector('button[class="loadbtn"]')
  let loadMoreBtn = await page.$('button[class="loadbtn"]');
  let container = await page.$('div[class="session-post-vertical timeline"] > ul');

  for(let i = 0; i<LIMIT; ++i){
    await page.waitForSelector(`div[class="session-post-vertical timeline"] > ul > li`)
    let moreLinks = await container.$$eval('.item .row > div > a', elms=>elms.map(a=>a.href))
    for(let link of moreLinks){
      if(links.length >= POSTS_LIMIT){
        console.log(i, links.length)
        return;
      };
      links.push(link);
    }
    console.log(i, links.length)
    await page.$eval('div[class="session-post-vertical timeline"] > ul', container=>container.innerHTML = '')
    //container.innerHTML = '';
    await loadMoreBtn.click();
  }
}

exports.crawl = crawl;
exports.label = 'health';
