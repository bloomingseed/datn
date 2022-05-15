const SELECTOR = "#st-container > div > div.site-content > div:nth-child(6) > div.w-content.list-content-left > div.cate-content > div.zone--timeline > div > article > a"

async function getArticleUrls(page, url){
  console.log("Visiting "+ url)
  let tries = 0;
  const MAX_TRIES = 3;
  while(tries<MAX_TRIES){
    try{
      return await process(page, url)
    } catch(e){
      console.log(e, `Tries #${tries+1}`);
      tries++;
    }

    
  }
  return [];
}

async function process(page, url){
  await page.goto(url, {waitUntil: "domcontentloaded"});
  console.log("Waiting for "+ SELECTOR)
  await page.waitForSelector(SELECTOR)
  return await page.$$eval(SELECTOR, anchors => anchors.map(a=>a.href));

}

exports.getArticleUrls = getArticleUrls;
