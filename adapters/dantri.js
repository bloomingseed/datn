const SELECTOR = "#bai-viet > div.col.col-840 > article > article > div.article-thumb > a"

async function getArticleUrls(page, url){
  const MAX_TRIES = 3;
  let tries = 0;
  console.log("Visiting "+ url)
  while (tries < MAX_TRIES){
    try{
      return await process(page, url);
    } catch(e){
      console.log(e, "Tries #"+tries+1)
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
