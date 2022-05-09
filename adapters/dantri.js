const SELECTOR = "#bai-viet > div.col.col-840 > article > article > div.article-thumb > a"

async function getArticleUrls(page, url){
  console.log("Visiting "+ url)
  await page.goto(url, {waitUntil: "domcontentloaded"});
  console.log("Waiting for "+ SELECTOR)
  await page.waitForSelector(SELECTOR)
  return await page.$$eval(SELECTOR, anchors => anchors.map(a=>a.href));
}

exports.getArticleUrls = getArticleUrls;
